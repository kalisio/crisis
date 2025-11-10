import _ from 'lodash'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'
import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { createServer } from '../src/server.js'
import { createGmailClient } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('crisis:organisations', () => {
  let server, expressServer, client, app, userService, authorisationService, organisationsService, accountService,
  authenticationService, storageService, mailerService, pushService, databasesService, gmailClient, gmailUser,
	ownerUser, organisation, organisationMembersService, organisationGroupsService, organisationTagsService,
	organisationStorageService, organisationCatalogService, organisationFeaturesService, organisationAlertsService,
	organisationEventsService, organisationEventTemplatesService, organisationEventLogsService, organisationArchivedEventsService,
	organisationArchivedEventLogsService, organisationPlanTemplatesService, organisationPlansService, organisationArchivedPlansService,
	memberUser, managerUser, memberPassword

  before(() => {
    chailint(chai, util)
  })

  it('is ES module compatible', () => {
    expect(typeof createServer).to.equal('function')
  })

  it('initialize the server/client', async () => {
    server = createServer()
    expressServer = await server.run()
		app = server.app
    client = feathers()
    const socket = io(server.app.get('domain'), {
      transports: ['websocket'],
      path: app.get('apiPath') + 'ws'
    })
    client.configure(feathers.socketio(socket))
    client.configure(feathers.authentication({ path: server.app.get('apiPath') + '/authentication' }))
  })
  // Let enough time to process
    .timeout(10000)

  it('registers the services', async () => {
    // user service
    userService = app.getService('users')
    expect(userService).toExist()
    // authorisations service
    authorisationService = app.getService('authorisations')
    expect(authorisationService).toExist()
    // authentication service
    authenticationService = app.getService('authentication')
    expect(authenticationService).toExist()
    // organisations service
    organisationsService = app.getService('organisations')
    expect(organisationsService).toExist()
    // account service
    accountService = app.getService('account')
    expect(accountService).toExist()
    // storage service
    storageService = app.getService('storage')
    expect(storageService).toExist()
    // mailer service
    mailerService = app.getService('mailer')
    expect(mailerService).toExist()
    // push service
    pushService = app.getService('push')
    expect(pushService).toExist()
    // databases service
    databasesService = app.getService('databases')
    expect(databasesService).toExist()
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

	it('creates owner user', async () => {
    const user = await userService.create({
      email: gmailUser,
      password: 'Pass;word1',
      name: 'owner-user'
    }, { checkAuthorisation: true })
    ownerUser = user
		expect(ownerUser.email).to.equal(gmailUser)
    expect(ownerUser.profile.name).to.equal('owner-user')
		expect(ownerUser.profile.description).to.equal(gmailUser)
    expect(ownerUser.sponsor).to.be.undefined
    expect(ownerUser.isVerified).to.equal(false)
		expect(ownerUser.verifyExpires).toExist()
		expect(ownerUser.verifyToken).toExist()
		expect(ownerUser.verifyShortToken).toExist()
		expect(ownerUser.verifyChanges).toExist()
		expect(ownerUser.subscriptions).to.be.undefined
		expect(ownerUser.groups).to.be.undefined
		expect(ownerUser.organisations).to.be.undefined
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        gmailClient.checkEmail(ownerUser, mailerService.options.auth.user, 'Confirm your signup', (err, message) => {
          if (err) reject(err)
          else {
            expect(message).to.exist
            resolve()
          }
        })
      }, 10000)
    })
  })
  // Let enough time to process
    .timeout(30000)

	it('creates a awesome organisation', async () => {
		await organisationsService.create({ name: 'awesome-organisation' }, { user: ownerUser, checkAuthorisation: true })
    const organisations = await organisationsService.find({ query: { name: 'awesome-organisation' }, user: ownerUser, checkAuthorisation: true })
    expect(organisations.data.length).to.equal(1)
    organisation = organisations.data[0]
		const users = await userService.find({ query: { email: gmailUser }})
		expect(users.data.length).to.equal(1)
		ownerUser = users.data[0]
		expect(ownerUser.email).to.equal(gmailUser)
    expect(ownerUser.profile.name).to.equal('owner-user')
		expect(ownerUser.profile.description).to.equal(gmailUser)
		expect(ownerUser.organisations.length).to.equal(1)
		expect(ownerUser.organisations[0].name).to.equal('awesome-organisation')
		expect(ownerUser.organisations[0].permissions).to.equal('owner')
    expect(organisation.name).to.equal('awesome-organisation')
		const context = organisation._id
		organisationMembersService = app.getService(`${context}/members`)
    expect(organisationMembersService).toExist()
		organisationGroupsService = app.getService(`${context}/groups`)
    expect(organisationGroupsService).toExist()
		organisationTagsService = app.getService(`${context}/tags`)
    expect(organisationTagsService).toExist()
		organisationStorageService = app.getService(`${context}/storage`)
    expect(organisationStorageService).toExist()
		organisationCatalogService = app.getService(`${context}/catalog`)
    expect(organisationCatalogService).toExist()
		organisationFeaturesService = app.getService(`${context}/features`)
    expect(organisationFeaturesService).toExist()
		organisationAlertsService = app.getService(`${context}/alerts`)
    expect(organisationAlertsService).toExist()
		organisationEventsService = app.getService(`${context}/events`)
    expect(organisationEventsService).toExist()
		organisationEventTemplatesService = app.getService(`${context}/event-templates`)
    expect(organisationEventTemplatesService).toExist()
		organisationEventLogsService = app.getService(`${context}/event-logs`)
    expect(organisationEventLogsService).toExist()
		organisationArchivedEventsService = app.getService(`${context}/archived-events`)
    expect(organisationArchivedEventsService).toExist()
		organisationArchivedEventLogsService = app.getService(`${context}/archived-event-logs`)
    expect(organisationArchivedEventLogsService).toExist()
		organisationPlanTemplatesService = app.getService(`${context}/plan-templates`)
    expect(organisationPlanTemplatesService).toExist()
		organisationPlansService = app.getService(`${context}/plans`)
    expect(organisationPlansService).toExist()
		organisationArchivedPlansService = app.getService(`${context}/archived-plans`)
    expect(organisationArchivedPlansService).toExist()
		const members = await organisationMembersService.find()
		expect(members.data.length).to.equal(1)
  })
  // Let enough time to process
    .timeout(30000)

	it('creates member user', async () => {
    const sponsor = { id: ownerUser._id, organisationId: organisation._id, roleGranted: 'member' }
    const user = await userService.create({
      email: gmailUser.replace('com', 'net'),
      name: 'member-user',
      sponsor
    }, { checkAuthorisation: true })
		memberUser = user
		const members = await organisationMembersService.find()
		expect(members.data.length).to.equal(2)
		expect(memberUser.email).to.equal(gmailUser.replace('com', 'net'))
    expect(memberUser.profile.name).to.equal('member-user')
		expect(memberUser.profile.description).to.equal(gmailUser.replace('com', 'net'))
		expect(memberUser.organisations.length).to.equal(1)
		expect(memberUser.organisations[0].name).to.equal('awesome-organisation')
		expect(memberUser.organisations[0].permissions).to.equal('member')
    expect(memberUser.sponsor).to.deep.equal(sponsor)
  	expect(memberUser.isVerified).to.equal(false)
		expect(memberUser.verifyExpires).toExist()
		expect(memberUser.verifyToken).toExist()
		expect(memberUser.verifyShortToken).toExist()
		expect(memberUser.verifyChanges).toExist()
		expect(memberUser.subscriptions).to.be.undefined
		expect(memberUser.groups).to.be.undefined
		expect(memberUser.expireAt).toExist()
  })
  // Let enough time to process
    .timeout(30000)

	it('creates manager user', async () => {
		const sponsor = { id: ownerUser._id, organisationId: organisation._id, roleGranted: 'manager' }
		const user = await userService.create({
      email: gmailUser.replace('com', 'xyz'),
      name: 'manager-user',
      sponsor
    }, { checkAuthorisation: true })
		managerUser = user
		const members = await organisationMembersService.find()
		expect(members.data.length).to.equal(3)
		expect(managerUser.email).to.equal(gmailUser.replace('com', 'xyz'))
    expect(managerUser.profile.name).to.equal('manager-user')
		expect(managerUser.profile.description).to.equal(gmailUser.replace('com', 'xyz'))
		expect(managerUser.organisations.length).to.equal(1)
		expect(managerUser.organisations[0].name).to.equal('awesome-organisation')
		expect(managerUser.organisations[0].permissions).to.equal('manager')
    expect(managerUser.sponsor).to.deep.equal(sponsor)
  	expect(managerUser.isVerified).to.equal(false)
		expect(managerUser.verifyExpires).toExist()
		expect(managerUser.verifyToken).toExist()
		expect(managerUser.verifyShortToken).toExist()
		expect(managerUser.verifyChanges).toExist()
		expect(managerUser.subscriptions).to.be.undefined
		expect(managerUser.groups).to.be.undefined
		expect(memberUser.expireAt).toExist()
  })
  // Let enough time to process
    .timeout(30000)

	it('connects owner user', async () => {
		const response = await client.authenticate({
			strategy: 'local',
			email: gmailUser,
			password: 'Pass;word1'
		})
		expect(response.user._id.toString()).to.equal(ownerUser._id.toString())
	})
	// Let enough time to process
		.timeout(10000)

	it('creates a group as owner', async () => {
		await client.service(server.app.get('apiPath') + '/' + organisation._id.toString() + '/groups').create({ name: 'awesome-group' })
		const groups = await organisationGroupsService.find({ query: { name: 'awesome-group' } })
		expect(groups.data.length).to.equal(1)
		expect(groups.data[0].name).to.equal('awesome-group')
		// No authorisations created automatically for empty group
		// const auths = await authorisationService.find({ query: { scope: 'groups', resource: groups.data[0]._id } })
		// expect(auths.data.length).to.equal(0)
	})
	// Let enough time to process
		.timeout(5000)

	// it('connects member client', async () => {
	// 	await client.logout()
	// 	setTimeout(() => {
  //     gmailClient.checkEmail(ownerUser, mailerService.options.auth.user, 'Welcome', (err, message) => {
  //       if (err) done(err)
  //       else {
  //         message = Buffer.from(message.body.data, 'base64').toString()
  //         const passwordEntry = 'password: '
  //         const passwordIndex = message.indexOf(passwordEntry) + passwordEntry.length
  //         memberPassword = message.substring(passwordIndex, passwordIndex + 8)
  //         done()
  //       }
  //     })
  //   }, 10000)
	// 	const response = await client.authenticate({
	// 		strategy: 'local',
	// 		email: gmailUser.replace('com', 'net'),
	// 		password: memberPassword
	// 	})
	// 	expect(response.user._id.toString()).to.equal(memberUser._id.toString())
	// })
	// // Let enough time to process
	// 	.timeout(20000)

  // Cleanup
  after(async () => {
    if (expressServer) await expressServer.close()
    fs.emptyDirSync(path.join(__dirname, 'logs'))
    await server.app.db.instance.dropDatabase()
    await server.app.db.disconnect()
  })
})
