import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import chai, { util, expect, assert } from 'chai'
import chailint from 'chai-lint'
import { createGmailClient } from './utils.js'
import { createServer, runServer } from '../src/server.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/* Scenario story board

  Creates a user with an org
  Creates a user group and tag in the org
  User invites a new member in its org
  User creates a new tag for member
  Removes tags from the user
  Adds member to group then update it
  Removes member from org
  Removes group
  Removes org
  Removes users
*/
describe('crisis', () => {
  let server, expressServer, userService, userObject, memberObject, orgService, orgObject,
    authorisationService, mailerService,
    memberService, tagService, tagObject, memberTagObject, groupService, groupObject,
    gmailClient, gmailUser, subscriptionObject, client, password
  const now = new Date()
  const logFilePath = path.join(__dirname, 'logs', 'crisis-' + now.toISOString().slice(0, 10) + '.log')
  
  before(() => {
    chailint(chai, util)
  })

  it('is ES module compatible', () => {
    expect(typeof createServer).to.equal('function')
  })

  it('initialize the server/client', async () => {
    server = createServer()
    expressServer = await runServer(server)
    client = feathers()
    const socket = io(server.app.get('domain'), {
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
    mailerService = server.app.getService('mailer')
    expect(mailerService).toExist()
  })
  // Let enough time to process
    .timeout(2000)

  it('setup access to gmail', async () => {
    const gmailApiConfig = {
      user: process.env.GMAIL_API_USER,
      clientEmail: process.env.GMAIL_API_CLIENT_EMAIL,
      privateKey: process.env.GMAIL_API_PRIVATE_KEY
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
      name: 'test-user'
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('BadRequest')
        expect(error.data.translation.params.failedRules).to.deep.equal(['uppercase', 'lowercase', 'symbols', 'oneOf'])
        done()
      })
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a user with his org', async () => {
    const user = await userService.create({
      email: gmailUser,
      password: 'Pass;word1',
      name: 'test-user'
    }, { checkAuthorisation: true })
    userObject = user
    await orgService.create({ name: 'test-org' }, { user: userObject, checkAuthorisation: true })
    const orgs = await orgService.find({ query: { name: 'test-org' }, user: userObject, checkAuthorisation: true })
    expect(orgs.data.length > 0).beTrue()
    orgObject = orgs.data[0]
    memberService = server.app.getService(`${orgObject._id.toString()}/members`)
    expect(memberService).toExist()
    tagService = server.app.getService(`${orgObject._id.toString()}/tags`)
    expect(tagService).toExist()
    groupService = server.app.getService(`${orgObject._id.toString()}/groups`)
    expect(groupService).toExist()
  })
  // Let enough time to process
    .timeout(30000)

  it('check user emails', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Confirm your signup', (err) => done(err))
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
        const log = 'duplicate key error collection: crisis-test.users'
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
    .timeout(10000)

  // See https://github.com/kalisio/aktnmap/issues/15
  it('cannot create more than one free organisations', async () => {
    try {
      await orgService.create({ name: 'another-test-org' }, { user: userObject, checkAuthorisation: true })
      assert.fail('should not be able to create more than two organisations')
    } catch(error) {
      expect(error).toExist()
      expect(error.name).to.equal('Forbidden')
    }
  })

  it('connects user client', async () => {
    const response = await client.authenticate({
      strategy: 'local',
      email: gmailUser,
      password: 'Pass;word1'
    })
    expect(response.user._id).to.equal(userObject._id.toString())
  })
  // Let enough time to process
    .timeout(10000)

  it('cannot update organisation quotas from external clients', async () => {
    const org = await client.service(server.app.get('apiPath') + '/organisations').patch(orgObject._id.toString(), { name: 'test-org', 'quotas.members': 200 })
    expect(org.quotas).beUndefined()
  })

  it('disconnects user client', async () => {
    await client.logout()
  })
  // Let enough time to process
    .timeout(10000)

  it('create user tag', async () => {
    await tagService.create({ value: 'test' }, { user: userObject, checkAuthorisation: true })
    const tags = await tagService.find({ query: { value: 'test', scope: 'members' }, paginate: false })
    tagObject = tags[0]
    const user = await memberService.patch(userObject._id.toString(), {
      tags: [tagObject]
    }, { user: userObject, checkAuthorisation: true })
    // Update user with its tag
    userObject = user
    expect(userObject.tags).toExist()
    expect(userObject.tags.length === 1).beTrue()
    expect(userObject.tags[0].value).to.equal('test')
    expect(userObject.tags[0].context.toString()).to.equal(orgObject._id.toString())
  })
  // Let enough time to process
    .timeout(15000)

  it('creates an organisation group', async () => {
    await groupService.create({ name: 'test-group' }, { user: userObject, checkAuthorisation: true })
    const groups = await groupService.find({ query: { name: 'test-group' }, user: userObject, checkAuthorisation: true })
    expect(groups.data.length > 0).beTrue()
    groupObject = groups.data[0]
    expect(groupObject.name).to.equal('test-group')
  })
  // Let enough time to process
    .timeout(10000)

  it('invites a member to join the organisation', async () => {
    const sponsor = { id: userObject._id, organisationId: orgObject._id, roleGranted: 'member' }
    let user = await userService.create({ email: gmailUser.replace('com', 'xyz'), name: 'test-user-3', sponsor: sponsor }, { checkAuthorisation: true })
    memberObject = user
    expect(memberObject.organisations).toExist()
    expect(userObject.organisations.length === 1).beTrue()
    expect(memberObject.organisations[0]._id.toString()).to.equal(orgObject._id.toString())
    expect(memberObject.organisations[0].permissions).to.equal('member')
  })
  // Let enough time to process
    .timeout(15000)

  it('check invitation email', (done) => {
    // Add some delay to wait for email reception
    setTimeout(() => {
      gmailClient.checkEmail(userObject, mailerService.options.auth.user, 'Welcome', (err, message) => {
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
    }, 10000)
  })
  // Let enough time to process
    .timeout(15000)

  it('connects member client', async () => {
    const response = await client.authenticate({
      strategy: 'local',
      email: gmailUser.replace('com', 'xyz'),
      password
    })
    expect(response.user._id).to.equal(memberObject._id.toString())
  })
  // Let enough time to process
    .timeout(10000)

  it('cannot update member from external clients', async () => {
    try {
      await client.service(server.app.get('apiPath') + '/users').update(memberObject._id.toString(), { name: 'new name' })
    } catch (error) {
      expect(error).toExist()
      expect(error.name).to.equal('MethodNotAllowed')
    }
  })

  it('cannot update member permissions without using authorisations service', async () => {
    const member = await client.service(server.app.get('apiPath') + '/users').patch(memberObject._id.toString(), { name: 'new name', groups: [] })
    expect(member.groups).beUndefined()
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a member tag', async () => {
    await tagService.create({ value: 'test-member' }, { user: userObject, checkAuthorisation: true })
    const tags = await tagService.find({ query: { value: 'test-member', scope: 'members' }, paginate: false })
    memberTagObject = tags[0]
    const user = await memberService.patch(memberObject._id.toString(), {
      tags: [memberTagObject]
    }, { user: userObject, checkAuthorisation: true })
    // Update member with its tag
    memberObject = user
    expect(memberObject.tags).toExist()
    expect(memberObject.tags.length === 1).beTrue()
    expect(memberObject.tags[0].value).to.equal('test-member')
    expect(memberObject.tags[0].context.toString()).to.equal(orgObject._id.toString())
  })
  // Let enough time to process
    .timeout(10000)

  it('adds existing tag to member', async () => {
    const user = await memberService.patch(memberObject._id.toString(), {
      tags: [_.clone(memberTagObject), _.clone(tagObject)]
    }, { user: userObject, checkAuthorisation: true })
    // Update member with its tag
    memberObject = user
    expect(memberObject.tags).toExist()
    expect(memberObject.tags.length === 2).beTrue()
    expect(memberObject.tags[1].value).to.equal('test')
    expect(memberObject.tags[1].context.toString()).to.equal(orgObject._id.toString())
  })
  // Let enough time to process
    .timeout(10000)

  it('removes user tags', async () => {
    const user = await memberService.patch(userObject._id.toString(), {
      tags: []
    }, { user: userObject, checkAuthorisation: true })
    userObject = user
    expect(userObject.tags).toExist()
    expect(userObject.tags.length === 0).beTrue()
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

  it('adds member to a group', async () => {
    const authorisation = await authorisationService.create({
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
    expect(authorisation).toExist()
    const user = await userService.get(memberObject._id.toString(), { checkAuthorisation: true, user: memberObject })
    // Update member with its group
    memberObject = user
    expect(memberObject.groups).toExist()
    expect(memberObject.groups.length === 1).beTrue()
    expect(memberObject.groups[0]._id.toString()).to.equal(groupObject._id.toString())
    expect(memberObject.groups[0].context.toString()).to.equal(orgObject._id.toString())
    expect(memberObject.groups[0].permissions).to.equal('member')
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

  it('removes member from the organisation', async () => {
    const authorisation = await authorisationService.remove(orgObject._id, {
      query: {
        scope: 'organisations',
        subjects: memberObject._id.toString(),
        subjectsService: orgObject._id.toString() + '/members',
        resourcesService: 'organisations'
      },
      user: userObject,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const user = await userService.get(memberObject._id, { user: memberObject, checkAuthorisation: true })
    // Update member with his new permissions
    memberObject = user
    expect(memberObject.organisations).toExist()
    expect(memberObject.organisations.length === 0).beTrue()
    expect(memberObject.tags).toExist()
    expect(memberObject.tags.length === 0).beTrue()
    expect(memberObject.groups).toExist()
    expect(memberObject.groups.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(20000)

  it('removes an organisation group', () => {
    return groupService.remove(groupObject._id, { user: userObject, checkAuthorisation: true })
      .then(() => {
        return groupService.find({ query: { name: groupObject.name }, user: userObject, checkAuthorisation: true })
      })
      .then(groups => {
        expect(groups.data.length === 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(10000)

  // it('removes the organisation', async () => {
  //   const org = await orgService.remove(orgObject._id, { user: userObject, checkAuthorisation: true })
  //   const user = await userService.get(userObject._id, { user: userObject, checkAuthorisation: true })
  //   // Update user with his new permissions
  //   userObject = user
  //   expect(userObject.organisations).toExist()
  //   expect(userObject.organisations.length === 0).beTrue()
  //   expect(userObject.tags).toExist()
  //   expect(userObject.tags.length === 0).beTrue()
  //   const orgs = await orgService.find({ query: {} })
  //   expect(orgs.data.length === 0).beTrue()
  //   memberService = server.app.getService(`${orgObject._id.toString()}/members`)
  //   expect(memberService).beNull()
  //   tagService = server.app.getService(`${orgObject._id.toString()}/tags`)
  //   expect(tagService).beNull()
  //   groupService = server.app.getService(`${orgObject._id.toString()}/groups`)
  //   expect(groupService).beNull()
  // })
  // // Let enough time to process
  //   .timeout(20000)

  // it('removes the users', async () => {
  //   await userService.remove(userObject._id, { user: userObject, checkAuthorisation: true })
  //   await userService.remove(memberObject._id, { user: memberObject, checkAuthorisation: true })
  //   const users = await userService.find({ query: {}, checkAuthorisation: true })
  //   expect(users.data.length === 0).beTrue()
  // })
  // // Let enough time to process
  //   .timeout(10000)

  // Cleanup
  after(async () => {
    if (expressServer) await expressServer.close()
    fs.emptyDirSync(path.join(__dirname, 'logs'))
    await server.app.db.instance.dropDatabase()
    await server.app.db.disconnect()
  })
})
