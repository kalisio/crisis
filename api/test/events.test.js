// import _ from 'lodash'
// import chai, { util, expect } from 'chai'
// import chailint from 'chai-lint'
// import request from 'superagent'
// import { Blob } from 'buffer'
// import fuzzySearch from 'feathers-mongodb-fuzzy-search'
// import core, { kdk, hooks as coreHooks, permissions as corePermissions } from '@kalisio/kdk/core.api.js'
// import * as permissions from '../../common/permissions.mjs'
// import { createOrganisationServices, removeOrganisationServices } from '../src/services/index.js'
// import webhooks from '../src/app.webhooks.js'

// describe('events', () => {
//   let app, server, port, baseUrl, accessToken,
//     userService, userObject, orgManagerObject, orgObject, orgUserObject, orgService, authorisationService,
//     storageService, storageObject, eventService, eventObject, eventTemplateService, eventLogService,
//     archivedEventService, archivedEventLogService

//   before(() => {
//     chailint(chai, util)

//     // Register all default hooks for authorisation
//     // Default rules for all users
//     corePermissions.defineAbilities.registerHook(corePermissions.defineUserAbilities)
//     // Then rules for organisations
//     corePermissions.defineAbilities.registerHook(permissions.defineOrganisationAbilities)
//     // Then rules for groups
//     corePermissions.defineAbilities.registerHook(permissions.defineGroupAbilities)
//     // Then rules for events
//     corePermissions.defineAbilities.registerHook(permissions.defineUserAbilities)

//     app = kdk()
//     // Register authorisation/log hook
//     app.hooks({
//       before: { all: [coreHooks.authorise], find: [fuzzySearch({ fields: ['name'] })] },
//       error: { all: coreHooks.log }
//     })
//     // Add hooks for contextual services
//     app.on('service', service => {
//       if (service.name === 'groups') {
//         service.hooks({
//           after: {
//             create: [coreHooks.createGroupAuthorisations],
//             remove: [coreHooks.removeGroupAuthorisations]
//           }
//         })
//       }
//     })

//     port = app.get('port')
//     baseUrl = `http://localhost:${app.get('port')}${app.get('apiPath')}`

//     return app.db.connect()
//   })

//   it('registers the global services', async () => {
//     await app.configure(core)
//     userService = app.getService('users')
//     expect(userService).toExist()
//     orgService = app.getService('organisations')
//     expect(orgService).toExist()
//     // Register services hook for organisations
//     orgService.registerOrganisationServicesHook({
//       createOrganisationServices, removeOrganisationServices
//     })
//     orgService.hooks({
//       after: {
//         create: [coreHooks.createOrganisationServices, coreHooks.createOrganisationAuthorisations],
//         remove: [coreHooks.removeOrganisationAuthorisations, coreHooks.removeOrganisationServices]
//       }
//     })
//     authorisationService = app.getService('authorisations')
//     expect(authorisationService).toExist()
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('launch the server for webhooks', async () => {
//     // Register webhooks
//     await app.configure(webhooks)
//     // Now app is configured launch the server
//     server = await app.listen(port)
//     await new Promise(resolve => server.once('listening', () => resolve()))
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('creates a test user', async () => {
//     const user = await userService.create({ email: 'test@test.org', name: 'test-user' }, { checkAuthorisation: true })
//     userObject = user
//     const users = await userService.find({ query: { 'profile.name': 'test-user' }, checkAuthorisation: true, user: userObject })
//     expect(users.data.length > 0).beTrue()
//   })
//   // Let enough time to process
//     .timeout(15000)

//   it('creates a org manager', async () => {
//     const user = await userService.create({ email: 'manager@test.org', name: 'org-manager' }, { checkAuthorisation: true })
//     orgManagerObject = user
//     const users = await userService.find({ query: { 'profile.name': 'org-manager' }, checkAuthorisation: true, user: orgManagerObject })
//     expect(users.data.length > 0).beTrue()
//   })
//   // Let enough time to process
//     .timeout(15000)

//   it('creates the org', async () => {
//     orgObject = await orgService.create({ name: 'test-org' }, { user: orgManagerObject, checkAuthorisation: true })
//     // This should create a service for organisation storage
//     storageService = app.getService('storage', orgObject)
//     expect(storageService).toExist()
//     // This should create services for organisation events
//     eventService = app.getService('events', orgObject)
//     expect(eventService).toExist()
//     archivedEventService = app.getService('archived-events', orgObject)
//     expect(archivedEventService).toExist()
//     // This should create a service for organisation event templates
//     eventTemplateService = app.getService('event-templates', orgObject)
//     expect(eventTemplateService).toExist()
//     // This should create services for organisation event templates
//     eventLogService = app.getService('event-logs', orgObject)
//     expect(eventLogService).toExist()
//     archivedEventLogService = app.getService('archived-event-logs', orgObject)
//     expect(archivedEventLogService).toExist()
//   })
//   // Let enough time to process
//     .timeout(15000)

//   it('creates a org user', async () => {
//     const user = await userService.create({ email: 'user@test.org', name: 'org-user', password: 'Pass;word1' }, { checkAuthorisation: true })
//     orgUserObject = user
//     let users = await userService.find({ query: { 'profile.name': 'org-user' }, checkAuthorisation: true, user: orgUserObject })
//     expect(users.data.length > 0).beTrue()
//     const authorisation = await authorisationService.create({
//       scope: 'organisations',
//       permissions: 'member',
//       subjects: orgUserObject._id.toString(),
//       subjectsService: 'users',
//       resource: orgObject._id.toString(),
//       resourcesService: 'organisations'
//     }, {
//       user: orgManagerObject,
//       checkAuthorisation: true
//     })
//     expect(authorisation).toExist()
//     users = await userService.find({ query: { 'profile.name': _.get(orgUserObject, 'profile.name') }, checkAuthorisation: true, user: orgManagerObject })
//     expect(users.data.length > 0).beTrue()
//     // Update user with authorisations
//     orgUserObject = users.data[0]
//     expect(orgUserObject.organisations[0].permissions).to.deep.equal('member')
//   })
//   // Let enough time to process
//     .timeout(15000)

//   it('org manager can create event template', async () => {
//     await eventTemplateService.create({
//       name: 'template',
//       description: 'manager template',
//       participants: [{ _id: orgManagerObject._id, service: 'members' }]
//     }, { user: orgManagerObject, checkAuthorisation: true })
//     const templates = await eventTemplateService.find({ query: { name: 'template' }, user: orgManagerObject, checkAuthorisation: true })
//     expect(templates.data.length).to.equal(1)
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('members can access event templates service', async () => {
//     const templates = await eventTemplateService.find({ query: {}, user: orgUserObject, checkAuthorisation: true })
//     expect(templates.data.length).to.equal(1)
//   })

//   it('members cannot create event template', async () => {
//     try {
//       await eventTemplateService.create({
//         name: 'member-template',
//         description: 'member template'
//       }, { user: orgUserObject, checkAuthorisation: true })
//     } catch (error) {
//       expect(error).toExist()
//     }
//   })

//   it('authenticates a user to get access token for webhook', async () => {
//     const response = await request
//       .post(`${baseUrl}/authentication`)
//       .send({ email: 'user@test.org', password: 'Pass;word1', strategy: 'local' })
//     accessToken = response.body.accessToken
//     expect(accessToken).toExist()
//   })
//   // Let enough time to process
//     .timeout(10000)

//   it('unauthorized service cannot be accessed through webhooks', (done) => {
//     request
//       .post(`${baseUrl}/webhooks/events`)
//       .set('Authorization', 'Bearer ' + accessToken)
//       .set('Content-Type', 'application/json')
//       .send({ service: 'authorisations' })
//       .catch(data => {
//         const error = data.response.body
//         expect(error).toExist()
//         expect(error.name).to.equal('Forbidden')
//         done()
//       })
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('unauthorized operation cannot be accessed through webhooks', (done) => {
//     request
//       .post(`${baseUrl}/webhooks/events`)
//       .set('Authorization', 'Bearer ' + accessToken)
//       .set('Content-Type', 'application/json')
//       .send({
//         context: orgObject._id.toString(),
//         id: 'xxx',
//         service: 'events',
//         operation: 'update'
//       })
//       .catch(data => {
//         const error = data.response.body
//         expect(error).toExist()
//         expect(error.name).to.equal('Forbidden')
//         done()
//       })
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('authorized user can create events from webhook', () => {
//     const operation = request
//       .post(`${baseUrl}/webhooks/events`)
//       .set('Authorization', 'Bearer ' + accessToken)
//       .set('Content-Type', 'application/json')
//       .send({
//         context: orgObject._id.toString(),
//         data: { template: 'template', name: 'webhook event' }
//       })
//       .then(response => {
//         const result = response.body
//         expect(result._id).toExist()
//         expect(result.name).to.equal('webhook event')
//         expect(result.description).to.equal('manager template')
//         expect(result.participants).toExist()
//         return eventService.remove(result._id)
//       })
//       .catch(error => {
//         console.log(error)
//       })
//     return operation
//   })
//   // Let enough time to process
//     .timeout(10000)

//   it('org member can create event', () => {
//     const operation = eventService.create({
//       name: 'member event',
//       template: 'template',
//       participants: [{ _id: orgManagerObject._id, service: 'members' }]
//     },
//     {
//       notification: { body: 'event created' },
//       user: orgUserObject,
//       checkAuthorisation: true
//     })
//       .then(event => {
//         eventObject = event
//         return eventService.find({ query: { name: 'member event' }, user: orgUserObject, checkAuthorisation: true })
//       })
//       .then(events => {
//         expect(events.data.length > 0).beTrue()
//         eventObject = events.data[0]
//         // Check for creator to be registered as coordinator
//         expect(eventObject.coordinators.length > 0).beTrue()
//         expect(eventObject.coordinators[0]._id.toString()).to.equal(orgUserObject._id.toString())
//       })
//     return operation
//   })
//   // Let enough time to process
//     .timeout(15000)

//   it('org member can update event', () => {
//     const operation = eventService.patch(eventObject._id, {
//       name: 'updated member event'
//     }, {
//       notification: { body: 'event updated' },
//       user: orgUserObject,
//       checkAuthorisation: true
//     })
//       .then(event => {
//         eventObject = event
//         return eventService.find({ query: { name: 'updated member event' }, user: orgUserObject, checkAuthorisation: true })
//       })
//       .then(events => {
//         expect(events.data.length > 0).beTrue()
//       })
//     return operation
//   })
//   // Let enough time to process
//     .timeout(15000)

//   it('org member can delete an event', async () => {
//     await eventService.remove(eventObject._id, {
//       notification: { body: 'event updated' },
//       user: orgUserObject,
//       checkAuthorisation: true
//     })
//     const events = await eventService.find({ query: { name: 'updated member event' }, user: orgUserObject, checkAuthorisation: true })
//     expect(events.data.length === 0).beTrue()
//   })
//   // Let enough time to process
//     .timeout(10000)

//   it('org manager can create event', () => {
//     const operation = eventService.create({
//       name: 'event',
//       template: 'template',
//       participants: [{ _id: orgUserObject._id, service: 'members' }]
//     },
//     {
//       notification: { body: 'event created' },
//       user: orgManagerObject,
//       checkAuthorisation: true
//     })
//       .then(event => {
//         eventObject = event
//         return eventService.find({ query: { name: 'event' }, user: orgManagerObject, checkAuthorisation: true })
//       })
//       .then(events => {
//         expect(events.data.length > 0).beTrue()
//         eventObject = events.data[0]
//         // Check for creator to be registered as coordinator
//         expect(eventObject.coordinators.length > 0).beTrue()
//         expect(eventObject.coordinators[0]._id.toString()).to.equal(orgManagerObject._id.toString())
//       })
//     return operation
//   })
//   // Let enough time to process
//     .timeout(15000)

//   it('non-members cannot access events', async () => {
//     try {
//       await eventService.find({ query: {}, user: userObject, checkAuthorisation: true })
//     } catch (error) {
//       expect(error).toExist()
//     }
//   })

//   it('make test user member', async () => {
//     const authorisation = await authorisationService.create({
//       scope: 'organisations',
//       permissions: 'member',
//       subjects: userObject._id.toString(),
//       subjectsService: 'users',
//       resource: orgObject._id.toString(),
//       resourcesService: 'organisations'
//     }, {
//       user: orgManagerObject,
//       checkAuthorisation: true
//     })
//     expect(authorisation).toExist()
//     const users = await userService.find({ query: { 'profile.name': _.get(userObject, 'profile.name') }, checkAuthorisation: true, user: orgManagerObject })
//     expect(users.data.length > 0).beTrue()
//     // Update user with authorisations
//     userObject = users.data[0]
//     expect(userObject.organisations[0].permissions).to.deep.equal('member')
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('members cannot access events when they are not participants', async () => {
//     const events = await eventService.find({ query: {}, user: userObject, checkAuthorisation: true })
//     expect(events.data.length === 0).beTrue()
//   })

//   it('event coordinators can update events', () => {
//     const operation = eventService.patch(eventObject._id, {
//       name: 'updated event'
//     }, {
//       notification: { body: 'event updated' },
//       user: orgManagerObject,
//       checkAuthorisation: true
//     })
//       .then(event => {
//         eventObject = event
//         return eventService.find({ query: { name: 'updated event' }, user: orgManagerObject, checkAuthorisation: true })
//       })
//       .then(events => {
//         expect(events.data.length > 0).beTrue()
//       })
//     return operation
//   })
//   // Let enough time to process
//     .timeout(15000)

//   it('event coordinators can upload/download data to/from event storage', async () => {
//     const fileId = `${eventObject._id}/buffer.txt`
//     const content = 'some buffered data'
//     const blob = new Blob([content], { type: 'text/plain' })
//     storageObject = await storageService.putObject({
//       id: fileId,
//       type: blob.type,
//       buffer: await blob.arrayBuffer()
//     })
//     expect(storageObject._id).to.equal(fileId)
//     let response = await storageService.get(fileId)
//     expect(response.buffer).toExist()
//     expect(response.type).to.equal(blob.type)
//     const buffer = storageService.atob(response.buffer)
//     expect(buffer.toString()).to.equal(content)
//     response = await storageService.remove(fileId)
//     expect(response._id).to.equal(fileId)
//     expect(response.$metadata.httpStatusCode).to.equal(204)
//   })
//     .timeout(15000)

//   it('members can access events when they are participants', async () => {
//     const events = await eventService.find({ query: {}, user: orgUserObject, checkAuthorisation: true })
//     expect(events.data.length === 1).beTrue()
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('participants can create event logs', async () => {
//     await eventLogService.create({ event: eventObject._id }, { user: orgUserObject, checkAuthorisation: true })
//     const logs = await eventLogService.find({ query: { lastInEvent: true }, user: orgUserObject, checkAuthorisation: true })
//     expect(logs.data.length === 1).beTrue()
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('coordinators can create event logs', () => {
//     const operation = eventLogService.create({
//       event: eventObject._id,
//       participant: orgUserObject._id,
//       stakeholder: 'coordinator',
//       properties: { interaction: { value: 'go' } }
//     }, { user: orgManagerObject, checkAuthorisation: true })
//       .then(log => {
//         return eventLogService.find({ query: { lastInEvent: true }, user: orgManagerObject, checkAuthorisation: true })
//       })
//       .then(logs => {
//         expect(logs.data.length === 1).beTrue()
//       })
//     return operation
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('events and logs are replicated in archive', async () => {
//     const events = await archivedEventService.find({ query: {}, user: orgManagerObject, checkAuthorisation: true })
//     expect(events.data.length).to.equal(3)
//     const logs = await archivedEventLogService.find({ query: {}, user: orgManagerObject, checkAuthorisation: true })
//     expect(logs.data.length).to.equal(2)
//   })

//   it('participants can be counted on archived event logs', async () => {
//     // Count by event
//     let result = await archivedEventLogService.find({
//       query: { $aggregate: true, event: eventObject._id },
//       user: orgManagerObject,
//       checkAuthorisation: true
//     })
//     expect(result.length).to.equal(1)
//     expect(result[0]._id.toString()).to.equal(eventObject._id.toString())
//     expect(result[0].count).to.equal(2)
//     // Count by event template
//     result = await archivedEventLogService.find({
//       query: { $aggregate: 'template', event: eventObject._id },
//       user: orgManagerObject,
//       checkAuthorisation: true
//     })
//     expect(result.length).to.equal(1)
//     expect(result[0]._id).to.equal('template')
//     expect(result[0].count).to.equal(2)
//   })
//   // Let enough time to process
//     .timeout(10000)

//   it('event coordinators can remove events', () => {
//     const operation = eventService.remove(eventObject._id, {
//       notification: { body: 'event removed' },
//       user: orgManagerObject,
//       checkAuthorisation: true
//     })
//       .then(event => {
//         eventObject = event
//         return eventService.find({ query: { name: 'updated event' }, user: orgManagerObject, checkAuthorisation: true })
//       })
//       .then(events => {
//         expect(events.data.length === 0).beTrue()
//         return storageService.get('buffer.txt')
//       })
//       .catch(error => {
//         expect(error).toExist()
//       })
//     return operation
//   })
//   // Let enough time to process
//     .timeout(10000)

//   it('removes test user', async () => {
//     await userService.remove(userObject._id, { user: userObject, checkAuthorisation: true })
//     const users = await userService.find({ query: { 'profile.name': _.get(userObject, 'profile.name') }, user: userObject, checkAuthorisation: true })
//     expect(users.data.length === 0).beTrue()
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('removes org user', async () => {
//     await userService.remove(orgUserObject._id, { user: orgUserObject, checkAuthorisation: true })
//     const users = await userService.find({ query: { 'profile.name': _.get(orgUserObject, 'profile.name') }, user: orgUserObject, checkAuthorisation: true })
//     expect(users.data.length === 0).beTrue()
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('removes org', async () => {
//     await orgService.remove(orgObject._id, { user: orgManagerObject, checkAuthorisation: true })
//     const orgs = await orgService.find({ query: { name: 'test-org' }, user: orgManagerObject, checkAuthorisation: true })
//     expect(orgs.data.length === 0).beTrue()

//     eventService = app.getService(`${orgObject._id.toString()}/events`)
//     expect(eventService).beNull()
//     archivedEventService = app.getService(`${orgObject._id.toString()}/archived-events`)
//     expect(archivedEventService).beNull()
//     eventTemplateService = app.getService(`${orgObject._id.toString()}/event-templates`)
//     expect(eventTemplateService).beNull()
//     eventLogService = app.getService(`${orgObject._id.toString()}/event-logs`)
//     expect(eventLogService).beNull()
//     archivedEventLogService = app.getService(`${orgObject._id.toString()}/archived-event-logs`)
//     expect(archivedEventLogService).beNull()
//   })
//   // Let enough time to process
//     .timeout(5000)

//   it('removes org manager', async () => {
//     await userService.remove(orgManagerObject._id, { user: orgManagerObject, checkAuthorisation: true })
//     const users = await userService.find({ query: { 'profile.name': _.get(orgManagerObject, 'profile.name') }, user: orgManagerObject, checkAuthorisation: true })
//     expect(users.data.length === 0).beTrue()
//   })
//   // Let enough time to process
//     .timeout(5000)

//   // Cleanup
//   after(async () => {
//     await userService.Model.drop()
//     await orgService.Model.drop()
//     await app.db.instance.dropDatabase()
//     await app.db.disconnect()
//   })
// })
