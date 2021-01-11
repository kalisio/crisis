const sns = require('sns-mobile')
const util = require('util')

// Script used to evaluate SNS latency on infrastructures

app = new sns({
  platform: 'ANDROID',
  accessKeyId: process.env.SNS_ACCESS_KEY,
  secretAccessKey: process.env.SNS_SECRET_ACCESS_KEY,
  region: 'eu-west-1',
  apiVersion: '2010-03-31',
  platformApplicationArn: process.env.SNS_ANDROID_ARN
})

const deviceArn = process.env.SNS_ANDROID_DEVICE_ARN

async function readTopics () {
  console.time('readTopics')
  const topics = await util.promisify(app.getTopics.bind(app))()
  console.log(`Found ${topics.length} application topics in SNS`)
  console.timeEnd('readTopics')
  return topics
}

async function createTopic (name) {
  console.time('createTopic')
  const topicArn = await util.promisify(app.createTopic.bind(app))(name)
  console.log(`Created ${topicArn} application topic in SNS`)
  console.timeEnd('createTopic')
  return topicArn
}

async function subscribeTopic (deviceArn, topicArn) {
  console.time('subscribeTopic')
  const subscriptionArn = await util.promisify(app.subscribe.bind(app))(deviceArn, topicArn)
  console.log(`Subscribed ${deviceArn} to application topic in SNS`)
  console.timeEnd('subscribeTopic')
  return subscriptionArn
}

async function readSubscriptions (topicArn) {
  console.time('readSubscriptions')
  const subscriptions = await util.promisify(app.getSubscriptions.bind(app))(topicArn)
  console.log(`Found ${subscriptions.length} application topic subscriptions in SNS`)
  console.timeEnd('readSubscriptions')
  return subscriptions
}

async function unsubscribeTopic (subscriptionArn) {
  console.time('unsubscribeTopic')
  await util.promisify(app.unsubscribe.bind(app))(subscriptionArn)
  console.log(`Unsubscribed ${subscriptionArn} from application topic in SNS`)
  console.timeEnd('unsubscribeTopic')
}

async function removeTopic (topicArn) {
  console.time('removeTopic')
  topics = await util.promisify(app.deleteTopic.bind(app))(topicArn)
  console.log(`Removed ${topicArn} application topic in SNS`)
  console.timeEnd('removeTopic')
}

async function run() {
  const topics = await readTopics()
  const topicArn = await createTopic('MyBenchmarkTopic')
  const subscriptionArn = await subscribeTopic(deviceArn, topicArn)
  const subscriptions = await readSubscriptions(topicArn)
  await unsubscribeTopic(subscriptionArn)
  await removeTopic(topicArn)
}

run()