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

program
    .usage('[options]')
    .option('-u, --url [url]', 'MongoDB URL of the application database to be checked', 'mongodb://127.0.0.1:27017')
    .option('-d, --database [database]', 'MongoDB application database name to be checked', 'aktnmap')
    .option('-i, --input-databases [file]', 'List of input organisation databases to be checked, if not given will pull from database')
    .option('-o, --output-databases [file]', 'Where the list of output organisation databases to be deleted should be generated', 'databases.json')
    .option('-f, --force', 'Force to remove databases even if not empty')
    .option('-A, --apply', 'Apply cleanup in database')
    .parse(process.argv)

// Connect to DB and get org list
async function initialize() {
  const url = process.env.DB_URL || program.url
  client = await MongoClient.connect(url, { useNewUrlParser: true })
  db = client.db(program.database)
  orgs = db.collection('organisations')
  orgs = await orgs.find({}).toArray()
  console.log(`Found ${orgs.length} organisations to be checked`)
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
// Export databases found in app DB to file then remove it from app DB as well if it is required
async function cleanDatabases () {
  if (program.outputDatabases) {
    let databasesFile = program.outputDatabases
    // When relative path is given assume it relative to working dir
    if (!path.isAbsolute(databasesFile)) databasesFile = path.join(process.cwd(), databasesFile)
    fs.writeFileSync(databasesFile, JSON.stringify(databases))
    console.log(`Written ${databases.length} organisation databases to be deleted to file`)
  }
  if (program.apply) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const answer = await new Promise((resolve, reject) => rl.question(`Are you sure you want to remove ${databases.length} organisation databases from application database [yes|no]`, resolve))
    rl.close()
    if (answer === 'yes') {
      // Loop over databases
      for (let i = 0; i < databases.length; i++) {
        const database = databases[i]
        try {
          orgDb = client.db(database.name)
          const stats = await orgDb.stats()
          console.log(stats)
          if ((stats.objects === 0) || program.force) {
            await orgDb.dropDatabase()
            console.log(`Dropping ${database.name}`)
          } else {
            console.log(`Skipping non-empty DB ${database.name}`)
          }
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}

async function run() {
  await initialize()
  console.log('Initialized databases cleanup script')
  console.time('Running time')
  await readDatabases()
  await filterDatabases()
  await cleanDatabases()
  await finalize()
  console.timeEnd('Running time')
}

run()
