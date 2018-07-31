import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { createGmailClient } from './utils'
import server from '../src/main'

describe('aktnmap', () => {
  let userService, userObject, memberObject, orgService, orgObject, authorisationService, devicesService, pusherService, sns,
    mailerService, memberService, tagService, tagObject, memberTagObject, groupService, groupObject, gmailClient, gmailUser,
    client, password
  let now = new Date()
  let logFilePath = path.join(__dirname, 'logs', 'aktnmap-' + now.toISOString().slice(0, 10) + '.log')
  const device = {
    registrationId: 'fakeId',
    platform: 'ANDROID',
    uuid: 'id'
  }
  const otherDevice = {
    registrationId: 'other-fakeId',
    platform: 'ANDROID',
    uuid: 'other-id'
  }
  const memberDevice = {
    registrationId: 'member-fakeId',
    platform: 'ANDROID',
    uuid: 'member-id'
  }
  
  before(() => {
    chailint(chai, util)
    // Add hooks for contextual services
    server.app.on('service', service => {
      if (service.name === 'members') {
        memberService = service
      } else if (service.name === 'tags') {
        tagService = service
      } else if (service.name === 'groups') {
        groupService = service
      }
    })
  })

  it('is CommonJS compatible', () => {
    expect(typeof server).to.equal('object')
  })

  it('initialize the server/client', async () => {
    await server.run() 
    client = feathers()
    let socket = io(server.app.get('domain'), {
      transports: ['websocket'],
      path: server.app.get('apiPath') + 'ws'
    })
    client.configure(feathers.socketio(socket))
    client.configure(feathers.authentication({ path: server.app.get('apiPath') + '/authentication' }))
  })
  // Let enough time to process
  .timeout(10000)

  it('registers the services', () => {
    userService = server.app.getService('users')
    expect(userService).toExist()
    orgService = server.app.getService('organisations')
    expect(orgService).toExist()
    authorisationService = server.app.getService('authorisations')
    expect(authorisationService).toExist()
    devicesService = server.app.getService('devices')
    expect(devicesService).toExist()
    mailerService = server.app.getService('mailer')
    expect(mailerService).toExist()
    pusherService = server.app.getService('pusher')
    expect(pusherService).toExist()
  })

  it('setup access to SNS', () => {
    // For now we only test 1 platform, should be sufficient due to SNS facade
    sns = pusherService.getSnsApplication(device.platform)
    expect(sns).toExist()
  })

  it('setup access to gmail', async () => {
    const gmailApiConfig = {
      user: process.env.GMAIL_API_USER,
      clientEmail: process.env.GMAIL_API_CLIENT_EMAIL,
      // The private key file is set as an environment variable containing \n
      // So we need to parse it such as if it came from a JSON file
      privateKey: JSON.parse('{ "key": "' + process.env.GMAIL_API_PRIVATE_KEY + '" }').key
    }
    gmailUser = gmailApiConfig.user
    gmailClient = await createGmailClient(gmailApiConfig)
  })
  // Let enough time to process
  .timeout(5000)

  it('cannot create a user with a weak password', (done) => {
    userService.create({
      email: gmailUser,
      password: '12345678',
      name: 'test-user'})
    .catch(error => {
      expect(error).toExist()
      expect(error.name).to.equal('BadRequest')
      expect(error.data.translation.params.failedRules).to.deep.equal(['uppercase', 'lowercase', 'symbols', 'oneOf'])
      done()
    })
  })
  // Let enough time to process
  .timeout(5000)

  it('creates a user with his org', () => {
    let operation = userService.create({
      email: gmailUser,
      password: 'Pass;word1',
      name: 'test-user'
    }, { checkAuthorisation: true })
    .then(user => {
      userObject = user
      return orgService.find({ query: {}, user: userObject, checkAuthorisation: true })
    })
    .then(orgs => {
      expect(orgs.data.length > 0).beTrue()
      orgObject = orgs.data[0]
      expect(orgObject.name).to.equal('test-user')
      expect(orgObject.topics).toExist()
      expect(Object.keys(orgObject.topics).length > 0).beTrue()
      return devicesService.update(device.registrationId, device, { user: userObject, checkAuthorisation: true })
    })
    .then(device => {
      return userService.get(userObject._id, { user: userObject, checkAuthorisation: true })
    })
    .then(user => {
      // Update user with its device
      userObject = user
      expect(userObject.devices).toExist()
      expect(userObject.devices.length === 1).beTrue()
      expect(userObject.devices[0].uuid).to.equal(device.uuid)
      expect(userObject.devices[0].registrationId).to.equal(device.registrationId)
      expect(userObject.devices[0].platform).to.equal(device.platform)
      expect(userObject.devices[0].arn).toExist()
      expect(userObject.devices[0].lastActivity).toExist()
    })
    let event = new Promise((resolve, reject) => {
      sns.once('subscribed', (subscriptionArn, endpointArn, topicArn) => {
        expect(orgObject.topics[device.platform]).to.equal(topicArn)
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(15000)

  it('check user emails', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Security alert - new device signin', (err) => {
        if (err) done(err)
        else gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Confirm your signup', (err) => done(err))
      })
    }, 10000)
  })
  // Let enough time to process
  .timeout(15000)

  it('errors appear in logs', (done) => {
    userService.create({
      email: gmailUser,
      password: 'Pass;word1',
      name: 'test-user'
    }, { checkAuthorisation: true })
    .catch(() => {
      let log = 'duplicate key error collection: kalisio-test.users'
      // FIXME: need to let some time to proceed with log file
      // Didn't find a better way since fs.watch() does not seem to work...
      setTimeout(() => {
        fs.readFile(logFilePath, 'utf8', (err, content) => {
          expect(err).beNull()
          expect(content.includes(log)).to.equal(true)
          done()
        })
      }, 2500)
    })
  })
  // Let enough time to process
  .timeout(5000)

  it('cannot create multiple free organisations', () => {
    return orgService.create({ name: 'test-org' }, { user: userObject, checkAuthorisation: true })
    .catch(error => {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    })
  })

  it('create user tag', () => {
    let operation = memberService.patch(userObject._id.toString(), { // We need at least devices for subscription
      tags: [{ value: 'test', scope: 'members' }],
      devices: _.clone(userObject.devices)
    }, { user: userObject, previousItem: _.clone(userObject), checkAuthorisation: true }) // Because we bypass populate hooks give the previousItem directly
    .then(user => {
      // Update user with its tag
      userObject = user
      expect(userObject.tags).toExist()
      expect(userObject.tags.length === 1).beTrue()
      expect(userObject.tags[0].value).to.equal('test')
      expect(userObject.tags[0].context.toString()).to.equal(orgObject._id.toString())
    })
    let event = new Promise((resolve, reject) => {
      sns.once('subscribed', (subscriptionArn, endpointArn, topicArn) => {
        tagService.find({ query: { value: 'test', scope: 'members' }, paginate: false })
        .then(tags => {
          tagObject = tags[0]
          expect(tagObject.topics).toExist()
          expect(tagObject.topics[device.platform]).to.equal(topicArn)
          expect(tagObject.count).to.equal(1)
          expect(userObject.devices[0].arn).to.equal(endpointArn)
          resolve()
        })
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(10000)

  it('creates an organisation group', () => {
    let operation = groupService.create({ name: 'test-group' }, { user: userObject, checkAuthorisation: true })
    .then(() => {
      return groupService.find({ query: { name: 'test-group' }, user: userObject, checkAuthorisation: true })
    })
    .then(groups => {
      expect(groups.data.length > 0).beTrue()
      groupObject = groups.data[0]
      expect(groupObject.name).to.equal('test-group')
      return userService.get(userObject._id, { user: userObject, checkAuthorisation: true })
    })
    .then(user => {
      // Update user with its group
      userObject = user
      expect(userObject.groups).toExist()
      expect(userObject.groups.length === 1).beTrue()
      expect(userObject.groups[0].name).to.equal('test-group')
      expect(userObject.groups[0].context.toString()).to.equal(orgObject._id.toString())
    })
    let event = new Promise((resolve, reject) => {
      sns.once('subscribed', (subscriptionArn, endpointArn, topicArn) => {
        groupService.find({ query: { name: 'test-group' }, paginate: false, user: userObject, checkAuthorisation: true })
        .then(groups => {
          groupObject = groups[0]
          expect(groupObject.topics).toExist()
          expect(groupObject.topics[device.platform]).to.equal(topicArn)
          expect(userObject.devices[0].arn).to.equal(endpointArn)
          resolve()
        })
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(10000)

  it('updates the user devices', () => {
    let operation = devicesService.update(otherDevice.registrationId, otherDevice, { user: userObject, checkAuthorisation: true })
    .then(device => {
      return userService.get(userObject._id, { user: userObject, checkAuthorisation: true })
    })
    .then(user => {
      // Update user with its new device
      userObject = user
      expect(userObject.devices).toExist()
      expect(userObject.devices.length === 2).beTrue()
      expect(userObject.devices[1].uuid).to.equal(otherDevice.uuid)
      expect(userObject.devices[1].registrationId).to.equal(otherDevice.registrationId)
      expect(userObject.devices[1].platform).to.equal(otherDevice.platform)
      expect(userObject.devices[1].arn).toExist()
      expect(userObject.devices[1].lastActivity).toExist()
    })
    let events = new Promise((resolve, reject) => {
      // This should subscribe the new device to all topics: org, group, tag
      // Because we check for resubscription after update to avoid any problem we get 2 for each
      const expectedSubscriptions = 2 * 3
      let subscriptions = 0
      sns.on('subscribed', (subscriptionArn, endpointArn, topicArn) => {
        expect(topicArn).to.satisfy(topic => (topic === orgObject.topics[otherDevice.platform]) ||
          (topic === groupObject.topics[otherDevice.platform]) ||
          (topic === tagObject.topics[otherDevice.platform]))
        subscriptions++
        if (subscriptions === expectedSubscriptions) {
          sns.removeAllListeners('subscribed')
          resolve()
        }
      })
    })
    return Promise.all([operation, events])
  })
  // Let enough time to process
  .timeout(10000)

  it('check new device email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Security alert - new device signin', (err) => done(err))
    }, 10000)
  })
  // Let enough time to process
  .timeout(15000)

  it('removes a user device', () => {
    const previousArn = userObject.devices[0].arn
    let operation = devicesService.remove(device.registrationId, { user: userObject, checkAuthorisation: true })
    .then(device => {
      return userService.get(userObject._id, { user: userObject, checkAuthorisation: true })
    })
    .then(user => {
      // Update user with its new device
      userObject = user
      expect(userObject.devices).toExist()
      expect(userObject.devices.length === 1).beTrue()
      expect(userObject.devices[0].uuid).to.equal(otherDevice.uuid)
      expect(userObject.devices[0].registrationId).to.equal(otherDevice.registrationId)
    })
    let events = new Promise((resolve, reject) => {
      // This should unsubscribe old device to all topics: org, group, tag
      const expectedUnsubscriptions = 3
      let unsubscriptions = 0
      // This should unregister the old device
      let userDeleted = false
      sns.on('unsubscribed', (subscriptionArn) => {
        // We do not store subscription ARN
        unsubscriptions++
        if (userDeleted && (unsubscriptions === expectedUnsubscriptions)) {
          sns.removeAllListeners('unsubscribed')
          resolve()
        }
      })
      sns.once('userDeleted', endpointArn => {
        expect(previousArn).to.equal(endpointArn)
        userDeleted = true
        if (userDeleted && (unsubscriptions === expectedUnsubscriptions)) resolve()
      })
    })
    return Promise.all([operation, events])
  })
  // Let enough time to process
  .timeout(10000)

  it('invites a member to join the organisation', () => {
    let sponsor = { id: userObject._id, organisationId: orgObject._id, roleGranted: 'member' }
    return userService.create({ email: gmailUser.replace('com', 'xyz'), name: 'test-user-3', sponsor: sponsor }, { checkAuthorisation: true })
    .then(user => {
      memberObject = user
      expect(memberObject.organisations).toExist()
      expect(userObject.organisations.length === 1).beTrue()
      expect(memberObject.organisations[0]._id.toString()).to.equal(orgObject._id.toString())
      expect(memberObject.organisations[0].permissions).to.equal('member')
      return devicesService.update(memberDevice.registrationId, memberDevice, { user: memberObject, checkAuthorisation: true })
    })
    .then(device => {
      return userService.get(memberObject._id, { user: memberObject, checkAuthorisation: true })
    })
    .then(user => {
      // Update user with its device
      memberObject = user
      expect(memberObject.devices).toExist()
      expect(memberObject.devices.length === 1).beTrue()
      expect(memberObject.devices[0].registrationId).to.equal(memberDevice.registrationId)
      expect(memberObject.devices[0].platform).to.equal(memberDevice.platform)
      expect(memberObject.devices[0].arn).toExist()
      expect(memberObject.devices[0].lastActivity).toExist()
    })
  })
  // Let enough time to process
  .timeout(10000)

  it('check invitation email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Security alert - new device signin', (err) => {
        if (err) done(err)
        else gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Welcome', (err, message) => {
          if (err) done(err)
          else {
            // Extract password from email
            message = Buffer.from(message.body.data, 'base64').toString()
            const passwordEntry = 'password: ' // then come the password xxxxxxxx
            const passwordIndex = message.indexOf(passwordEntry) + passwordEntry.length
            // Generated passwords have 8 characters
            password = message.substring(passwordIndex, passwordIndex + 8)
            done()
          }
        })
      })
    }, 10000)
  })
  // Let enough time to process
  .timeout(15000)

  it('connects member client', async () => {
    let response = await client.authenticate({
      strategy: 'local',
      email: gmailUser.replace('com', 'xyz'),
      password
    })
    const payload = await client.passport.verifyJWT(response.accessToken)
    expect(payload.userId).to.equal(memberObject._id.toString())
  })
  // Let enough time to process
  .timeout(5000)

  it('creates a member tag', () => {
    let operation = memberService.patch(memberObject._id.toString(), { // We need at least devices for subscription
      tags: [{ value: 'test-member', scope: 'members' }],
      devices: _.clone(memberObject.devices)
    }, { user: userObject, previousItem: _.clone(memberObject), checkAuthorisation: true }) // Because we bypass populate hooks give the previousItem directly
    .then(user => {
      // Update member with its tag
      memberObject = user
      expect(memberObject.tags).toExist()
      expect(memberObject.tags.length === 1).beTrue()
      expect(memberObject.tags[0].value).to.equal('test-member')
      expect(memberObject.tags[0].context.toString()).to.equal(orgObject._id.toString())
    })
    let event = new Promise((resolve, reject) => {
      // This should subscribe the device to new tag topic
      sns.once('subscribed', (subscriptionArn, endpointArn, topicArn) => {
        tagService.find({ query: { value: 'test-member', scope: 'members' }, paginate: false })
        .then(tags => {
          memberTagObject = tags[0]
          expect(memberTagObject.topics).toExist()
          expect(memberTagObject.topics[device.platform]).to.equal(topicArn)
          expect(memberTagObject.count).to.equal(1)
          expect(memberObject.devices[0].arn).to.equal(endpointArn)
          resolve()
        })
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(10000)

  it('adds existing tag to member', () => {
    let operation = memberService.patch(memberObject._id.toString(), { // We need at least devices for subscription
      tags: [_.clone(memberObject.tags[0]), _.clone(tagObject)],
      devices: _.clone(memberObject.devices)
    }, { user: userObject, previousItem: _.clone(memberObject), checkAuthorisation: true }) // Because we bypass populate hooks give the previousItem directly
    .then(user => {
      // Update member with its tag
      memberObject = user
      expect(memberObject.tags).toExist()
      expect(memberObject.tags.length === 2).beTrue()
      expect(memberObject.tags[1].value).to.equal('test')
      expect(memberObject.tags[1].context.toString()).to.equal(orgObject._id.toString())
    })
    let event = new Promise((resolve, reject) => {
      // This should subscribe the device to new tag topic
      sns.once('subscribed', (subscriptionArn, endpointArn, topicArn) => {
        tagService.find({ query: { value: 'test', scope: 'members' }, paginate: false })
        .then(tags => {
          tagObject = tags[0]
          expect(tagObject.count).to.equal(2)
          expect(tagObject.topics[device.platform]).to.equal(topicArn)
          expect(memberObject.devices[0].arn).to.equal(endpointArn)
          resolve()
        })
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(10000)

  it('removes user tags', () => {
    let operation = memberService.patch(userObject._id.toString(), { // We need at least devices for unsubscription
      tags: [],
      devices: _.clone(userObject.devices)
    }, { user: userObject, previousItem: _.clone(userObject), checkAuthorisation: true }) // Because we bypass populate hooks give the previousItem directly
    .then(user => {
      userObject = user
      expect(userObject.tags).toExist()
      expect(userObject.tags.length === 0).beTrue()
    })
    let event = new Promise((resolve, reject) => {
      sns.once('unsubscribed', (subscriptionArn) => {
        tagService.find({ query: { value: 'test', scope: 'members' }, paginate: false })
        .then(tags => {
          tagObject = tags[0]
          expect(tagObject.count).to.equal(1)
          // We do not store subscription ARN
          resolve()
        })
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(10000)

  it('updating group should not dispatch event to non member client', (done) => {
    const clientGroupService = client.service(server.app.get('apiPath') + '/' + orgObject._id.toString() + '/groups')
    let count = 0
    clientGroupService.on('patched', (group) => count++)
    groupService.patch(groupObject._id.toString(),
      { name: 'new-test-group' }, { user: userObject, checkAuthorisation: true })
    setTimeout(() => {
      clientGroupService.removeListener('patched')
      if (count > 0) done(new Error('Service event raised'))
      else done()
    }, 5000)
  })
  // Let enough time to process
  .timeout(10000)

  it('adds member to a group', () => {
    let operation = authorisationService.create({
      scope: 'groups',
      permissions: 'member',
      subjects: memberObject._id.toString(),
      subjectsService: 'users',
      resource: groupObject._id.toString(),
      resourcesService: orgObject._id.toString() + '/groups'
    }, {
      user: userObject,
      checkAuthorisation: true
    })
    .then(authorisation => {
      expect(authorisation).toExist()
      return userService.get(memberObject._id.toString(), { checkAuthorisation: true, user: memberObject })
    })
    .then(user => {
      // Update member with its group
      memberObject = user
      expect(memberObject.groups[0]._id.toString()).to.equal(groupObject._id.toString())
      expect(memberObject.groups[0].permissions).to.equal('member')
    })
    let event = new Promise((resolve, reject) => {
      sns.once('subscribed', (subscriptionArn, endpointArn, topicArn) => {
        expect(groupObject.topics[device.platform]).to.equal(topicArn)
        expect(memberObject.devices[0].arn).to.equal(endpointArn)
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(10000)

  it('updating group should dispatch event to member client', (done) => {
    const clientGroupService = client.service(server.app.get('apiPath') + '/' + orgObject._id.toString() + '/groups')
    let count = 0
    clientGroupService.on('patched', (group) => count++)
    groupService.patch(groupObject._id.toString(),
      { name: 'new-test-group' }, { user: userObject, checkAuthorisation: true })
    setTimeout(() => {
      clientGroupService.removeListener('patched')
      if (count === 0) done(new Error('Service event not raised'))
      else done()
    }, 5000)
  })
  // Let enough time to process
  .timeout(10000)

  it('removes member from the organisation', () => {
    let operation = authorisationService.remove(orgObject._id, {
      query: {
        scope: 'organisations',
        subjects: memberObject._id.toString(),
        subjectsService: orgObject._id.toString() + '/members',
        resourcesService: 'organisations'
      },
      user: userObject,
      checkAuthorisation: true
    })
    .then(authorisation => {
      expect(authorisation).toExist()
      return userService.get(memberObject._id, { user: memberObject, checkAuthorisation: true })
    })
    .then(user => {
      // Update member with his new permissions
      memberObject = user
      expect(memberObject.organisations).toExist()
      expect(memberObject.organisations.length === 0).beTrue()
      expect(memberObject.tags).toExist()
      expect(memberObject.tags.length === 0).beTrue()
      expect(memberObject.groups).toExist()
      expect(memberObject.groups.length === 0).beTrue()
    })
    let events = new Promise((resolve, reject) => {
      // This should unsubscribe device to all topics: org, group, 2 tags
      const expectedUnsubscriptions = 4
      let unsubscriptions = 0
      sns.on('unsubscribed', (subscriptionArn) => {
        // We do not store subscription ARN
        unsubscriptions++
        if (unsubscriptions === expectedUnsubscriptions) {
          sns.removeAllListeners('unsubscribed')
          resolve()
        }
      })
    })
    return Promise.all([operation, events])
  })
  // Let enough time to process
  .timeout(20000)

  it('cannot remove the organisation while a group do exists', () => {
    return orgService.remove(orgObject._id, { user: userObject, checkAuthorisation: true })
    .catch(error => {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    })
  })

  it('removes an organisation group', () => {
    let operation = groupService.remove(groupObject._id, { user: userObject, checkAuthorisation: true })
    .then(() => {
      return groupService.find({ query: { name: groupObject.name }, user: userObject, checkAuthorisation: true })
    })
    .then(groups => {
      expect(groups.data.length === 0).beTrue()
    })
    let event = new Promise((resolve, reject) => {
      // This should unsubscribe device to group topic
      sns.once('unsubscribed', (subscriptionArn) => {
        // We do not store subscription ARN
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(10000)

  it('removes the organisation', () => {
    let operation = orgService.remove(orgObject._id, { user: userObject, checkAuthorisation: true })
    .then(org => {
      return userService.get(userObject._id, { user: userObject, checkAuthorisation: true })
    })
    .then(user => {
      // Update user with his new permissions
      userObject = user
      expect(userObject.organisations).toExist()
      expect(userObject.organisations.length === 0).beTrue()
      expect(userObject.tags).toExist()
      expect(userObject.tags.length === 0).beTrue()
      expect(userObject.groups).toExist()
      expect(userObject.groups.length === 0).beTrue()
      return orgService.find({ query: {} })
    })
    .then(orgs => {
      expect(orgs.data.length === 0).beTrue()
    })
    let events = new Promise((resolve, reject) => {
      // This should unsubscribe device to org topic
      sns.once('unsubscribed', (subscriptionArn) => {
        // We do not store subscription ARN
        resolve()
      })
    })
    return Promise.all([operation, events])
  })
  // Let enough time to process
  .timeout(20000)

  it('removes the users', () => {
    const previousUserArn = userObject.devices[0].arn
    const previousMemberArn = memberObject.devices[0].arn
    let operation = userService.remove(userObject._id, { user: userObject, checkAuthorisation: true })
    .then(user => {
      return userService.remove(memberObject._id, { user: memberObject, checkAuthorisation: true })
    })
    .then(user => {
      return userService.find({ query: {}, checkAuthorisation: true })
    })
    .then(users => {
      expect(users.data.length === 0).beTrue()
    })
    let event = new Promise((resolve, reject) => {
      // This should unregister the devices
      const expectedDeletions = 2
      let deletions = 0
      sns.on('userDeleted', endpointArn => {
        deletions++
        if (deletions === expectedDeletions) {
          sns.removeAllListeners('unsubscribed')
          resolve()
        }
        expect(endpointArn).to.satisfy(arn => (arn === previousUserArn) || (arn === previousMemberArn))
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
  .timeout(10000)

  // Cleanup
  after(() => {
    fs.emptyDirSync(path.join(__dirname, 'logs'))
    server.app.db.instance.dropDatabase()
  })
})
