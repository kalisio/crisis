import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client.js'
import * as events from './events.mjs'
import * as logbooks from './logbooks.mjs'

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
      browser: {
        slowMo: 1,
        args: ['--lang=fr'],
        devtools: false
      },
      localStorage: {
        'kalisio crisis-welcome': false
      }
    })
    // Prepare structure for current run
    await client.createOrganisation(org)
    await client.createMembers(org)
    await client.createGroups(org)
    await client.createTags(org)
    await client.tagMembers(org)
    await client.groupMembers(org)
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

  it('org manager can create events from templates', async () => {
    const managerTemplate = _.find(org.eventTemplates, { name: 'Manager template' })
    const managerEventOne = _.find(org.events, { name: 'Manager event 1' })
    await events.createEvent(page, org, managerTemplate, managerEventOne)
    const managerEventTwo = _.find(org.events, { name: 'Manager event 2' })
    await events.createEvent(page, org, managerTemplate, managerEventTwo)
    expect(await events.countEvents(page, org)).to.equal(2)
    // Corriger l'erreur
    // expect(await events.eventExists(page, org, managerTemplate, 'description')).beTrue()
    expect(await events.eventExists(page, org, managerEventOne, 'name')).beTrue()
    expect(await events.eventExists(page, org, managerEventTwo, 'name')).beTrue()
  })

  it('org manager can remove his events', async () => {
    await core.clickAction(page, 'events')
    const memberEvent = _.find(org.events, { name: 'Manager event 1' })
    await events.removeEvent(page, org, memberEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
  })

  it('logbook shows 2 events', async () => {
    await logbooks.goToLogbook(page, org)
    await page.waitForTimeout(10000)
    expect(await logbooks.countLogbookEvents(page, org)).to.equal(2)
  })

  it('logbook shows 1 active event', async () => {
    await logbooks.goToLogbook(page, org)
    await page.waitForTimeout(2000)
    expect(await logbooks.countLogbookOpenedEvents(page, org)).to.equal(1)
  })

  it('logbook shows 1 closed event', async () => {
    await page.waitForTimeout(2000)
    expect(await logbooks.countLogbookClosedEvents(page, org)).to.equal(1)
  })

  after(async function () {
    // Let enough time to process
    this.timeout(60000)
    await runner.stop()
    // First remove groups in case removal test failed
    await client.removeGroups(org)
    // Then members
    await client.removeMembers(org)
    // Then organisation/owner
    await client.removeOrganisation(org)
  })
})
