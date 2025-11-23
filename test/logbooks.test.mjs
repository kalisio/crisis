import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from './kdk/index.mjs'
import * as events from './events.mjs'
import * as logbooks from './logbooks.mjs'
import * as utilsClient from './utils.client.mjs'

const suite = 'logbooks'

describe(`suite:${suite}`, () => {
  let runner, page, api, client
  const org = {
    owner: {
      name: 'Owner',
      email: 'owner@kalisio.xyz',
      password: 'Pass;word1'
    },
    members: [{
      name: 'Manager',
      email: 'manager@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'manager',
      tags: [{ value: 'Tag' }],
      groups: [{ name: 'Group', permissions: 'member' }]
    }],
    groups: [{
      name: 'Group',
      description: 'A group'
    }],
    tags: [{
      value: 'Tag',
      description: 'Tag description'
    }],
    eventTemplates: [{
      name: 'Manager template',
      description: 'Template description',
      permission: 'manager',
      expiryDuration: '90'
    }],
    events: [{
      name: 'Manager event 1',
      participants: [{
        name: 'Tag'
      }, {
        name: 'Owner'
      }]
    },
    {
      name: 'Manager event 2',
      participants: [{
        name: 'Tag'
      }, {
        name: 'Owner'
      }]
    }]
  }

  before(async function () {
    chailint(chai, util)

    // Let enough time to process
    this.timeout(60000)
    api = new core.Api({
      appName: 'crisis'
    })
    client = api.createClient()
    runner = new core.Runner(suite, {
      appName: 'crisis',
      geolocation: { latitude: 43.10, longitude: 1.71 },
      notifications: true,
      browser: {
        slowMo: 5,
        args: ['--window-size=1280,1024']
      },
      localStorage: {
        'crisis-welcome': false,
        'crisis-install': false
      },
      lang: 'fr'
    })
    // Prepare structure for current run
    await utilsClient.createOrganisation(org, client)
    await utilsClient.createMembers(org, client)
    await utilsClient.createGroups(org, client)
    await utilsClient.createTags(org, client)
    await utilsClient.tagMembers(org, client)
    await utilsClient.groupMembers(org, client)
    page = await runner.start()
  })

  beforeEach(() => {
    runner.clearErrors()
  })

  afterEach(() => {
    expect(runner.hasError()).beFalse()
  })

  it('org manager can create event templates', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.login(page, member)
    const managerTemplate = _.find(org.eventTemplates, { name: 'Manager template' })
    await events.createEventTemplate(page, org, managerTemplate)
    expect(await events.countEventTemplates(page, org)).to.equal(1)
    expect(await events.eventTemplateExists(page, org, managerTemplate, 'name')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('org manager can create events from templates', async () => {
    const managerTemplate = _.find(org.eventTemplates, { name: 'Manager template' })
    const managerEventOne = _.find(org.events, { name: 'Manager event 1' })
    await events.createEvent(page, org, managerTemplate, managerEventOne)
    const managerEventTwo = _.find(org.events, { name: 'Manager event 2' })
    await events.createEvent(page, org, managerTemplate, managerEventTwo)
    expect(await events.countEvents(page, org)).to.equal(2)
    // FIXME
    // expect(await events.eventExists(page, org, managerTemplate, 'description')).beTrue()
    expect(await events.eventExists(page, org, managerEventOne, 'name')).beTrue()
    expect(await events.eventExists(page, org, managerEventTwo, 'name')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('org manager can remove his events', async () => {
    await core.clickAction(page, 'events')
    const memberEvent = _.find(org.events, { name: 'Manager event 1' })
    await events.removeEvent(page, org, memberEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  it('logbook shows 2 events', async () => {
    await logbooks.goToLogbook(page, org)
    await core.waitForTimeout(10000)
    expect(await logbooks.countLogbookEvents(page, org)).to.equal(2)
  })
  // Let enough time to process
    .timeout(50000)

  it('logbook shows 1 active event', async () => {
    await logbooks.goToLogbook(page, org)
    await core.waitForTimeout(2000)
    expect(await logbooks.countLogbookOpenedEvents(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  it('logbook shows 1 closed event', async () => {
    await core.waitForTimeout(2000)
    expect(await logbooks.countLogbookClosedEvents(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  after(async function () {
    // Let enough time to process
    this.timeout(60000)
    await runner.stop()
    // First remove groups in case removal test failed
    await utilsClient.removeGroups(org, client)
    // Then members
    await utilsClient.removeMembers(org, client)
    // Then organisation/owner
    await utilsClient.removeOrganisation(org, client)
  })
})
