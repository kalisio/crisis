import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import core, { kalisio, hooks as coreHooks, permissions as corePermissions } from '@kalisio/kdk/core.api'
import * as permissions from '../src/permissions'
import { createOrganisationServices, removeOrganisationServices } from '../src/services'

describe('events', () => {
  let app, userService, userObject, orgManagerObject, orgObject, orgUserObject, orgService,
    authorisationService, devicesService, pusherService, sns,
    storageService, storageObject, eventService, eventObject, eventTemplateService, eventLogService,
    archivedEventService, archivedEventLogService

  const managerDevice = {
    registrationId: 'managerFakeId',
    platform: 'ANDROID'
  }
  const memberDevice = {
    registrationId: 'memberFakeId',
    platform: 'ANDROID'
  }

  before(() => {
    chailint(chai, util)

    // Register all default hooks for authorisation
    // Default rules for all users
    corePermissions.defineAbilities.registerHook(corePermissions.defineUserAbilities)
    // Then rules for organisations
    corePermissions.defineAbilities.registerHook(corePermissions.defineOrganisationAbilities)
    // Then rules for groups
    corePermissions.defineAbilities.registerHook(corePermissions.defineGroupAbilities)
    // Then rules for events
    corePermissions.defineAbilities.registerHook(permissions.defineUserAbilities)

    app = kalisio()
    // Register authorisation/log hook
    app.hooks({
      before: { all: [coreHooks.authorise] },
      error: { all: coreHooks.log }
    })
    // Add hooks for contextual services
    app.on('service', service => {
      if (service.name === 'groups') {
        service.hooks({
          after: {
            create: [coreHooks.createGroupAuthorisations],
            remove: [coreHooks.removeGroupAuthorisations]
          }
        })
      }
    })

    return app.db.connect()
  })

  it('registers the global services', async () => {
    await app.configure(core)
    userService = app.getService('users')
    expect(userService).toExist()
    userService.hooks({
      before: {
        remove: [coreHooks.unregisterDevices]
      }
    })
    devicesService = app.getService('devices')
    expect(devicesService).toExist()
    pusherService = app.getService('pusher')
    expect(pusherService).toExist()
    // For now we only test 1 platform, should be sufficient due to SNS facade
    sns = pusherService.getSnsApplication('ANDROID')
    expect(sns).toExist()
    orgService = app.getService('organisations')
    expect(orgService).toExist()
    // Register services hook for organisations
    orgService.registerOrganisationServicesHook({
      createOrganisationServices, removeOrganisationServices
    })
    orgService.hooks({
      after: {
        create: [coreHooks.createOrganisationAuthorisations],
        remove: [coreHooks.removeOrganisationAuthorisations]
      }
    })
    authorisationService = app.getService('authorisations')
    expect(authorisationService).toExist()
  })
  // Let enough time to process
    .timeout(5000)

  it('creates a test user', async () => {
    const user = await userService.create({ email: 'test@test.org', name: 'test-user' }, { checkAuthorisation: true })
    userObject = user
    const users = await userService.find({ query: { 'profile.name': 'test-user' }, checkAuthorisation: true, user: userObject })
    expect(users.data.length > 0).beTrue()
  })
  // Let enough time to process
    .timeout(15000)

  it('creates a org manager', async () => {
    let user = await userService.create({ email: 'manager@test.org', name: 'org-manager' }, { checkAuthorisation: true })
    orgManagerObject = user
    const users = await userService.find({ query: { 'profile.name': 'org-manager' }, checkAuthorisation: true, user: orgManagerObject })
    expect(users.data.length > 0).beTrue()
    await devicesService.update(managerDevice.registrationId, managerDevice, { user: orgManagerObject })
    user = await userService.get(orgManagerObject._id)
    // Update user with registered device
    orgManagerObject = user
  })
  // Let enough time to process
    .timeout(15000)

  it('creates the org', async () => {
    orgObject = await orgService.create({ name: 'test-org' }, { user: orgManagerObject, checkAuthorisation: true })
    // This should create a service for organisation storage
    storageService = app.getService('storage', orgObject)
    expect(storageService).toExist()
    // This should create services for organisation events
    eventService = app.getService('events', orgObject)
    expect(eventService).toExist()
    archivedEventService = app.getService('archived-events', orgObject)
    expect(archivedEventService).toExist()
    // This should create a service for organisation event templates
    eventTemplateService = app.getService('event-templates', orgObject)
    expect(eventTemplateService).toExist()
    // This should create services for organisation event templates
    eventLogService = app.getService('event-logs', orgObject)
    expect(eventLogService).toExist()
    archivedEventLogService = app.getService('archived-event-logs', orgObject)
    expect(archivedEventLogService).toExist()
  })
  // Let enough time to process
    .timeout(15000)

  it('creates a org user', async () => {
    let user = await userService.create({ email: 'user@test.org', name: 'org-user' }, { checkAuthorisation: true })
    orgUserObject = user
    let users = await userService.find({ query: { 'profile.name': 'org-user' }, checkAuthorisation: true, user: orgUserObject })
    expect(users.data.length > 0).beTrue()
    const authorisation = await authorisationService.create({
      scope: 'organisations',
      permissions: 'member',
      subjects: orgUserObject._id.toString(),
      subjectsService: 'users',
      resource: orgObject._id.toString(),
      resourcesService: 'organisations'
    }, {
      user: orgManagerObject,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    users = await userService.find({ query: { 'profile.name': orgUserObject.name }, checkAuthorisation: true, user: orgManagerObject })
    expect(users.data.length > 0).beTrue()
    // Update user with authorisations
    orgUserObject = users.data[0]
    expect(orgUserObject.organisations[0].permissions).to.deep.equal('member')
    await devicesService.update(memberDevice.registrationId, memberDevice, { user: orgUserObject })
    user = await userService.get(orgUserObject._id)
    // Update user with registered device
    orgUserObject = user
  })
  // Let enough time to process
    .timeout(15000)

  it('org manager can create event template', async () => {
    await eventTemplateService.create({ title: 'template' }, { user: orgManagerObject, checkAuthorisation: true })
    const templates = await eventTemplateService.find({ query: { title: 'template' }, user: orgManagerObject, checkAuthorisation: true })
    expect(templates.data.length > 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('members can access event templates service', async () => {
    const templates = await eventTemplateService.find({ query: {}, user: orgUserObject, checkAuthorisation: true })
    expect(templates.data.length > 0).beTrue()
  })

  it('members cannot create event template', async () => {
    try {
      await eventTemplateService.create({ title: 'member-template' }, { user: orgUserObject, checkAuthorisation: true })
    } catch (error) {
      expect(error).toExist()
    }
  })

  it('org member can create event', () => {
    const operation = eventService.create({
      title: 'member event',
      template: 'template1',
      participants: [{ _id: orgManagerObject._id, service: 'members' }]
    },
    {
      notification: 'event created',
      user: orgUserObject,
      checkAuthorisation: true
    })
      .then(event => {
        eventObject = event
        return eventService.find({ query: { title: 'member event' }, user: orgUserObject, checkAuthorisation: true })
      })
      .then(events => {
        expect(events.data.length > 0).beTrue()
        eventObject = events.data[0]
        // Check for creator to be registered as coordinator
        expect(eventObject.coordinators.length > 0).beTrue()
        expect(eventObject.coordinators[0]._id.toString()).to.equal(orgUserObject._id.toString())
      })
    const event = new Promise((resolve, reject) => {
      sns.once('messageSent', (endpointArn, messageId) => {
        expect(orgManagerObject.devices[0].arn).to.equal(endpointArn)
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
    .timeout(15000)

  it('org member can update event', () => {
    const operation = eventService.patch(eventObject._id, {
      title: 'updated member event'
    }, {
      notification: 'event updated',
      user: orgUserObject,
      checkAuthorisation: true
    })
      .then(event => {
        eventObject = event
        return eventService.find({ query: { title: 'updated member event' }, user: orgUserObject, checkAuthorisation: true })
      })
      .then(events => {
        expect(events.data.length > 0).beTrue()
      })
    const event = new Promise((resolve, reject) => {
      sns.once('messageSent', (endpointArn, messageId) => {
        expect(orgManagerObject.devices[0].arn).to.equal(endpointArn)
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
    .timeout(15000)

  it('org member can delete an event', async () => {
    await eventService.remove(eventObject._id, {
      notification: 'event updated',
      user: orgUserObject,
      checkAuthorisation: true
    })
    const events = await eventService.find({ query: { title: 'updated member event' }, user: orgUserObject, checkAuthorisation: true })
    expect(events.data.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(10000)

  it('org manager can create event', () => {
    const operation = eventService.create({
      title: 'event',
      template: 'template2',
      participants: [{ _id: orgUserObject._id, service: 'members' }]
    },
    {
      notification: 'event created',
      user: orgManagerObject,
      checkAuthorisation: true
    })
      .then(event => {
        eventObject = event
        return eventService.find({ query: { title: 'event' }, user: orgManagerObject, checkAuthorisation: true })
      })
      .then(events => {
        expect(events.data.length > 0).beTrue()
        eventObject = events.data[0]
        // Check for creator to be registered as coordinator
        expect(eventObject.coordinators.length > 0).beTrue()
        expect(eventObject.coordinators[0]._id.toString()).to.equal(orgManagerObject._id.toString())
      })
    const event = new Promise((resolve, reject) => {
      sns.once('messageSent', (endpointArn, messageId) => {
        expect(orgUserObject.devices[0].arn).to.equal(endpointArn)
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
    .timeout(15000)

  it('non-members cannot access events', async () => {
    try {
      await eventService.find({ query: {}, user: userObject, checkAuthorisation: true })
    } catch (error) {
      expect(error).toExist()
    }
  })

  it('make test user member', async () => {
    const authorisation = await authorisationService.create({
      scope: 'organisations',
      permissions: 'member',
      subjects: userObject._id.toString(),
      subjectsService: 'users',
      resource: orgObject._id.toString(),
      resourcesService: 'organisations'
    }, {
      user: orgManagerObject,
      checkAuthorisation: true
    })
    expect(authorisation).toExist()
    const users = await userService.find({ query: { 'profile.name': userObject.name }, checkAuthorisation: true, user: orgManagerObject })
    expect(users.data.length > 0).beTrue()
    // Update user with authorisations
    userObject = users.data[0]
    expect(userObject.organisations[0].permissions).to.deep.equal('member')
  })
  // Let enough time to process
    .timeout(5000)

  it('members cannot access events when they are not participants', async () => {
    const events = await eventService.find({ query: {}, user: userObject, checkAuthorisation: true })
    expect(events.data.length === 0).beTrue()
  })

  it('event coordinators can update events', () => {
    const operation = eventService.patch(eventObject._id, {
      title: 'updated event'
    }, {
      notification: 'event updated',
      user: orgManagerObject,
      checkAuthorisation: true
    })
      .then(event => {
        eventObject = event
        return eventService.find({ query: { title: 'updated event' }, user: orgManagerObject, checkAuthorisation: true })
      })
      .then(events => {
        expect(events.data.length > 0).beTrue()
      })
    const event = new Promise((resolve, reject) => {
      sns.once('messageSent', (endpointArn, messageId) => {
        expect(orgUserObject.devices[0].arn).to.equal(endpointArn)
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
    .timeout(15000)

  it('event coordinators can add attachments to events', async () => {
    const content = Buffer.from('some buffered data')
    storageObject = await storageService.create({
      id: 'buffer.txt',
      contentType: 'text/plain',
      buffer: content,
      resource: eventObject._id.toString(),
      resourcesService: 'events'
    })
    expect(storageObject.size).to.equal(content.length)
    const events = await eventService.find({ query: { title: 'updated event' }, user: orgManagerObject, checkAuthorisation: true })
    expect(events.data.length > 0).beTrue()
    eventObject = events.data[0]
    expect(eventObject.attachments).toExist()
    expect(eventObject.attachments.length > 0).beTrue()
    expect(eventObject.attachments[0]._id).to.equal(storageObject._id)
    const data = await storageService.get('buffer.txt')
    expect(data.size === 18).beTrue()
  })
    .timeout(15000)

  it('members can access events when they are participants', async () => {
    const events = await eventService.find({ query: {}, user: orgUserObject, checkAuthorisation: true })
    expect(events.data.length === 1).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('participants can create event logs', async () => {
    await eventLogService.create({ event: eventObject._id }, { user: orgUserObject, checkAuthorisation: true })
    const logs = await eventLogService.find({ query: { lastInEvent: true }, user: orgUserObject, checkAuthorisation: true })
    expect(logs.data.length === 1).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('coordinators can create event logs', () => {
    const operation = eventLogService.create({
      event: eventObject._id,
      participant: orgUserObject._id,
      stakeholder: 'coordinator',
      properties: { interaction: { value: 'go' } }
    }, { user: orgManagerObject, checkAuthorisation: true })
      .then(log => {
        return eventLogService.find({ query: { lastInEvent: true }, user: orgManagerObject, checkAuthorisation: true })
      })
      .then(logs => {
        expect(logs.data.length === 1).beTrue()
      })
    const event = new Promise((resolve, reject) => {
      sns.once('messageSent', (endpointArn, messageId) => {
        expect(orgUserObject.devices[0].arn).to.equal(endpointArn)
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
    .timeout(5000)

  it('events and logs are replicated in archive', async () => {
    const events = await archivedEventService.find({ query: {}, user: orgManagerObject, checkAuthorisation: true })
    expect(events.data.length).to.equal(2)
    const logs = await archivedEventLogService.find({ query: {}, user: orgManagerObject, checkAuthorisation: true })
    expect(logs.data.length).to.equal(2)
  })

  it('participants can be counted on archived event logs', async () => {
    // Count by event
    let result = await archivedEventLogService.find({
      query: { $aggregate: true, event: eventObject._id },
      user: orgManagerObject,
      checkAuthorisation: true
    })
    expect(result.length).to.equal(1)
    expect(result[0]._id.toString()).to.equal(eventObject._id.toString())
    expect(result[0].count).to.equal(2)
    // Count by event template
    result = await archivedEventLogService.find({
      query: { $aggregate: 'template', event: eventObject._id },
      user: orgManagerObject,
      checkAuthorisation: true
    })
    expect(result.length).to.equal(1)
    expect(result[0]._id).to.equal('template2')
    expect(result[0].count).to.equal(2)
  })
  // Let enough time to process
    .timeout(10000)

  it('event coordinators can remove events', () => {
    const operation = eventService.remove(eventObject._id, {
      notification: 'event removed',
      user: orgManagerObject,
      checkAuthorisation: true
    })
      .then(event => {
        eventObject = event
        return eventService.find({ query: { title: 'updated event' }, user: orgManagerObject, checkAuthorisation: true })
      })
      .then(events => {
        expect(events.data.length === 0).beTrue()
        return storageService.get('buffer.txt')
      })
      .catch(error => {
        expect(error).toExist()
      })
    const event = new Promise((resolve, reject) => {
      sns.once('messageSent', (endpointArn, messageId) => {
        expect(orgUserObject.devices[0].arn).to.equal(endpointArn)
        resolve()
      })
    })
    return Promise.all([operation, event])
  })
  // Let enough time to process
    .timeout(10000)

  it('removes test user', async () => {
    await userService.remove(userObject._id, { user: userObject, checkAuthorisation: true })
    const users = await userService.find({ query: { name: userObject.name }, user: userObject, checkAuthorisation: true })
    expect(users.data.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('removes org user', async () => {
    await userService.remove(orgUserObject._id, { user: orgUserObject, checkAuthorisation: true })
    const users = await userService.find({ query: { name: orgUserObject.name }, user: orgUserObject, checkAuthorisation: true })
    expect(users.data.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('removes org', async () => {
    await orgService.remove(orgObject._id, { user: orgManagerObject, checkAuthorisation: true })
    const orgs = await orgService.find({ query: { name: 'test-org' }, user: orgManagerObject, checkAuthorisation: true })
    expect(orgs.data.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  it('removes org manager', async () => {
    await userService.remove(orgManagerObject._id, { user: orgManagerObject, checkAuthorisation: true })
    const users = await userService.find({ query: { name: orgManagerObject.name }, user: orgManagerObject, checkAuthorisation: true })
    expect(users.data.length === 0).beTrue()
  })
  // Let enough time to process
    .timeout(5000)

  // Cleanup
  after(async () => {
    await userService.Model.drop()
    await orgService.Model.drop()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
