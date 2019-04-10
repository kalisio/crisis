const _ = require('lodash')
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID
const sns = require('sns-mobile')
const program = require('commander')
const util = require('util')
const path = require('path')
const fs = require('fs')
const readline = require('readline')

let app, client, db, orgs, topics, subscriptions, rl

program
    .usage('[options]')
    .option('-u, --url [url]', 'MongoDB URL of the application database to be checked', 'mongodb://127.0.0.1:27017')
    .option('-d, --database [database]', 'MongoDB application database name to be checked', 'aktnmap')
    .option('-k, --key [key]', 'SNS Access Key')
    .option('-K, --secret-key [key]', 'SNS Secret Access Key')
    .option('-a, --app [arn]', 'SNS application ARN')
    .option('-t, --input-topics [file]', 'List of input application topics to be checked, if not given will pull from SNS')
    .option('-T, --output-topics [file]', 'Where the list of output application topics to be deleted should be generated', 'topics.json')
    .option('-A, --apply', 'Apply cleanup in SNS')
    .parse(process.argv)

// Connect to AWS/DB and get org list
async function initialize() {
  const url = process.env.DB_URL || program.url
  const accessKeyId = process.env.SNS_ACCESS_KEY || program.key
  const secretAccessKey = process.env.SNS_SECRET_ACCESS_KEY || program.secretKey
  const platformApplicationArn = process.env.SNS_ANDROID_ARN || program.app
  app = new sns({
    platform: 'ANDROID',
    accessKeyId,
    secretAccessKey,
    region: 'eu-west-1',
    apiVersion: '2010-03-31',
    platformApplicationArn
  })
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
// Read topics from either SNS or input file
async function readTopics () {
  if (program.inputTopics) {
    let topicsFile = program.inputTopics
    // When relative path is given assume it relative to working dir
    if (!path.isAbsolute(topicsFile)) topicsFile = path.join(process.cwd(), topicsFile)
    topics = require(topicsFile)
    console.log(`Read ${topics.length} application topics from file`)
  } else {
    topics = await util.promisify(app.getTopics.bind(app))()
    console.log(`Found ${topics.length} application topics in SNS`)
  }
}
// Remove from read topics those found in DB
async function filterTopics() {
  let nbOrgTopics = nbGroupTopics = nbTagTopics = 0
  // Loop over orgs
  for (let i = 0; i < orgs.length; i++) {
    // Filter topics according to orgs
    nbOrgTopics += _.remove(topics, (topic) => _.find(orgs, org => org.topics.ANDROID === topic.TopicArn)).length
    const org = orgs[i]
    const orgDb = client.db(org._id.toString())
    // Filter topics according to groups
    let groups = orgDb.collection('groups')
    groups = await groups.find({}).toArray()
    nbGroupTopics += _.remove(topics, (topic) => _.find(groups, group => group.topics.ANDROID === topic.TopicArn)).length
    // Filter topics according to tags
    let tags = orgDb.collection('tags')
    tags = await tags.find({}).toArray()
    nbTagTopics += _.remove(topics, (topic) => _.find(tags, group => group.topics.ANDROID === topic.TopicArn)).length
  }
  console.log(`Found ${nbOrgTopics + nbGroupTopics + nbTagTopics} existing application topics, ${nbOrgTopics} org topics, ${nbGroupTopics} group topics, ${nbTagTopics} tag topics`)
}
// Remove all subscriptions on given topic from SNS
async function cleanSubscriptions (topic) {
  let subscriptions = await util.promisify(app.getSubscriptions.bind(app))(topic.TopicArn)
  console.log(`Removing ${subscriptions.length} application subscriptions in SNS for topic ${topic.TopicArn}`)
  // Loop over subscriptions
  for (let i = 0; i < subscriptions.length; i++) {
    const subscription = subscriptions[i]
    try {
      await util.promisify(app.unsubscribe.bind(app))(subscription.SubscriptionArn)
    } catch (error) {
      console.log(error)
    }
  }
}
// Export topics not found in DB to file then remove it from SNS as well if it is required
async function cleanTopics () {
  if (program.outputTopics) {
    let topicsFile = program.outputTopics
    // When relative path is given assume it relative to working dir
    if (!path.isAbsolute(topicsFile)) topicsFile = path.join(process.cwd(), topicsFile)
    fs.writeFileSync(topicsFile, JSON.stringify(topics))
    console.log(`Written ${topics.length} application topics to be deleted to file`)
  }
  if (program.apply) {
    rl = readline.createInterface({ input: process.stdin, output: process.stdout })
    const answer = await new Promise((resolve, reject) => rl.question(`Are you sure you want to remove ${topics.length} topics from SNS [yes|no]`, resolve))
    if (answer === 'yes') {
      // Loop over topics
      for (let i = 0; i < topics.length; i++) {
        const topic = topics[i]
        try {
          await cleanSubscriptions(topic)
          console.log(`Removing topic ${topic.TopicArn}`)
          await util.promisify(app.deleteTopic.bind(app))(topic.TopicArn)
        } catch (error) {
          console.log(error)
        }
      }
    }
  }
}

async function run() {
  await initialize()
  console.log('Initialized SNS cleanup script')
  console.time('Running time')
  await readTopics()
  await filterTopics()
  await cleanTopics()
  await finalize()
  console.timeEnd('Running time')
}

run()

