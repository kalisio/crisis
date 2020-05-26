const _ = require('lodash')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const program = require('commander')
const util = require('util')
const path = require('path')
const fs = require('fs')
const readline = require('readline')

let client, db, orgs, databases, rl
let apply = false

program
    .usage('[options]')
    .option('-u, --url [url]', 'MongoDB URL of the application database to be checked', 'mongodb://127.0.0.1:27017')
    .option('-d, --database [database]', 'MongoDB application database name to be checked', 'aktnmap')
    .option('-i, --input-databases [file]', 'List of input organisation databases to be checked, if not given will pull from database')
    .option('-o, --output-databases [file]', 'Where the list of output organisation databases to be migrated should be generated', 'databases.json')
    .option('-A, --apply', 'Apply database migration')
    .parse(process.argv)

// Connect to DB and get org list
async function initialize() {
  const url = process.env.DB_URL || program.url
  client = await MongoClient.connect(url, { useNewUrlParser: true })
  db = client.db(program.database)
  orgs = db.collection('organisations')
  orgs = await orgs.find({}).toArray()
  console.log(`Found ${orgs.length} organisation(s) to be checked`)
}
// Disconnect from DB
async function finalize() {
  await client.close()
}
// Read databases from either app DB or input file
async function readDatabases () {
  if (program.inputDatabases) {
    let databasesFile = program.inputDatabases
    // When relative path is given assume it relative to working dir
    if (!path.isAbsolute(databasesFile)) databasesFile = path.join(process.cwd(), databasesFile)
    databases = require(databasesFile)
    console.log(`Read ${databases.length} organisation databases from file`)
  } else {
    const dbInfos = await db.admin().listDatabases()
    databases = dbInfos.databases.map(dbInfo => ({ name: dbInfo.name }))
    console.log(`Found ${databases.length} databases in MongoDB`)
  }
}
// Remove from read databases those found in app DB
async function filterDatabases() {
  let nbNoOrgDatabase = nbOrgDatabases = 0
  // Filter DBs that are not Object IDs
  nbNoOrgDatabase += _.remove(databases, (database) => {
    try {
      const id = new ObjectID(database.name)
      return !ObjectID.isValid(id) // If we can create a valid ObjectID it is in the right format
    } catch (error) {
      return true // Otherwise it is not, remove it
    }
  }).length
  // Loop over orgs
  for (let i = 0; i < orgs.length; i++) {
    const org = orgs[i]
    // Filter DBs according to existing orgs
    nbOrgDatabases += _.remove(databases, (database) => !_.find(orgs, org => org._id.toString() === database.name)).length
  }
  console.log(`Found ${nbOrgDatabases} existing organisation databases, filtered ${nbNoOrgDatabase} non organisation databases`)
}
// Get items from a given collection then
// apply update operation on the list of items
async function updateItems(collectionName, filter, updater, orgId) {
  let migratedDb = (orgId ? client.db(orgId) : db)
  let collection = migratedDb.collection(collectionName)
  let items = await collection.find({}).toArray()
  console.log(`Found ${items.length} existing ${collectionName} for DB ${orgId ? orgId : program.database}`)
  // Loop over items
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (filter(item)) {
      const query = { _id: item._id }
      const operation = updater(item)
      console.log(`Updating ${collectionName} with query ${util.inspect(query)} and operation ${util.inspect(operation)}`)
      if (apply) await collection.updateOne(query, operation)
    }
  }
}
// Migrate data model owing a topic
async function migrateTopics(collectionName, orgId) {
  console.log(`Migrating ${collectionName} topics for organisation DB ${orgId ? orgId : program.database}`)
  await updateItems(collectionName,
    (item) => _.has(item, 'topics.ANDROID') && !_.has(item, 'topics.IOS'),
    (item) => ({ $set: { 'topics.IOS': _.get(item, 'topics.ANDROID') } }), orgId)
}
// Migrate resource permission data model referencing objects owing a topic
async function migratePermissionsTopics(scopeName) {
  console.log(`Migrating ${scopeName} permissions for ${program.database} DB users`)
  await updateItems('users',
    (item) => {
      const scope = _.get(item, scopeName) || []
      return _.some(scope, (resource) => _.has(resource, 'topics.ANDROID') && !_.has(resource, 'topics.IOS'))
    },
    (item) => {
      const scope = _.get(item, scopeName) || []
      const update = {}
      scope.forEach((resource, index) => {
        if (_.has(resource, 'topics.ANDROID') && !_.has(resource, 'topics.IOS')) {
          Object.assign(update, { [`${scopeName}.${index}.topics.IOS`]: _.get(resource, 'topics.ANDROID') })
        }
      })
      return { $set: update }
    })
}
// Export databases found in app DB to file then migrate it as well if it is required
async function migrateDatabases () {
  if (program.outputDatabases) {
    let databasesFile = program.outputDatabases
    // When relative path is given assume it relative to working dir
    if (!path.isAbsolute(databasesFile)) databasesFile = path.join(process.cwd(), databasesFile)
    fs.writeFileSync(databasesFile, JSON.stringify(databases))
    console.log(`Written ${databases.length} organisation databases to be migrated to file`)
  }
  if (program.apply) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const answer = await new Promise((resolve, reject) => rl.question(`Are you sure you want to migrate ${databases.length} organisation databases in application database [yes|no]`, resolve))
    rl.close()
    apply = (answer === 'yes')
  }
  try {
    // Loop over org databases
    for (let i = 0; i < databases.length; i++) {
      const database = databases[i]
      await migrateTopics('tags', database.name)
      await migrateTopics('groups', database.name)
    }
    // Then over orgs
    await migrateTopics('organisations')
    // Then over permissions
    await migratePermissionsTopics('tags')
    await migratePermissionsTopics('groups')
    await migratePermissionsTopics('organisations')
  } catch (error) {
    console.log(error)
  }
}

// For v0.7.0 the main change is iOS support so that each group/tag/org has now two topic entries: ANDROID/IOS
// They are actually the same because SNS take care of this but the way it is coded requires to duplicate the entry for now
// See https://github.com/kalisio/kNotify/issues/22
async function run() {
  await initialize()
  console.log('Initialized databases migration script')
  console.time('Running time')
  await readDatabases()
  await filterDatabases()
  await migrateDatabases()
  await finalize()
  console.timeEnd('Running time')
}

run()
