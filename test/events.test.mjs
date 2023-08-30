import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client.js'
import * as events from './events.mjs'

const suite = 'events'

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
    }, {
      name: 'Member',
      email: 'member@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'member',
      tags: [{ value: 'Tag' }],
      groups: [{ name: 'Group', permissions: 'member' }]
    }],
    groups: [{
      name: 'Group',
      description: 'A group'
    }],
    eventTemplates: [{
      name: 'Member template',
      permission: 'member',
      expiryDuration: 90
    }, {
      name: 'Manager template',
      description: 'Template description',
      permission: 'manager',
      expiryDuration: 90
    }],
    events: [{
      name: 'Member event',
      participants: [{
        name: 'Group'
      }]
    }, {
      name: 'Manager event',
      participants: [{
        name: 'Group'
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
      appName: 'aktnmap'
    })
    client = api.createClient()
    runner = new core.Runner(suite, {
      appName: 'aktnmap',
      geolocation: { latitude: 43.10, longitude: 1.71 },
      browser: {
        slowMo: 1,
        args: ['--lang=fr'],
        devtools: false
      },
      localStorage: {
        'akt\'n\'map-welcome': false
      }
    })
    // Prepare structure for current run
    await client.createOrganisation(org)
    await client.createMembers(org)
    await client.createGroups(org)
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
    const memberTemplate = _.find(org.eventTemplates, { name: 'Member template' })
    await events.createEventTemplate(page, org, memberTemplate)
    const managerTemplate = _.find(org.eventTemplates, { name: 'Manager template' })
    await events.createEventTemplate(page, org, managerTemplate)
    expect(await events.countEventTemplates(page, org)).to.equal(2)
    expect(await events.eventTemplateExists(page, org, memberTemplate, 'name')).beTrue()
    expect(await events.eventTemplateExists(page, org, managerTemplate, 'name')).beTrue()
  })

  it('org manager can create events from templates', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const managerTemplate = _.find(org.eventTemplates, { name: 'Manager template' })
    const managerEvent = _.find(org.events, { name: 'Manager event' })
    await events.createEvent(page, org, managerTemplate, managerEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
    expect(await events.eventExists(page, org, managerTemplate, 'description')).beTrue()
    expect(await events.eventExists(page, org, managerEvent, 'name')).beTrue()
  })

  it('org member cannot edit event templates', async () => {
    const template = _.find(org.eventTemplates, { name: 'Member template' })
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    // No edition on template
    expect(await events.eventTemplateExists(page, org, template, 'name')).beTrue()
    expect(await events.eventTemplateActionExists(page, org, template, 'edit-item-header')).beFalse()
    expect(await events.eventTemplateActionExists(page, org, template, 'edit-item-description')).beFalse()
    expect(await events.eventTemplateActionExists(page, org, template, 'remove-item-header')).beFalse()
  })

  it('org member cannot create event from templates without permissions', async () => {
    const template = _.find(org.eventTemplates, { name: 'Member template' })
    await events.goToEventsActivity(page, org)
    // We should have a single action and no fab if a single template is found
    // await core.clickAction(page, 'fab')
    expect(await core.elementExists(page, `#create-${_.kebabCase(template.name)}`)).beTrue()
  })

  it('org member can create events from templates', async () => {
    const memberTemplate = _.find(org.eventTemplates, { name: 'Member template' })
    const memberEvent = _.find(org.events, { name: 'Member event' })
    await events.createEvent(page, org, memberTemplate, memberEvent)
    expect(await events.countEvents(page, org)).to.equal(2)
  })

  it('org member can manage event logs', async () => {
    const memberEvent = _.find(org.events, { name: 'Member event' })
    // Participant follow-up
    await events.goToEventLogs(page, org, memberEvent)
    const nbLogs = await events.countEventLogs(page, org, memberEvent)
    const memberLogExists = await events.eventLogExists(page, org, memberEvent, 'Member')
    await events.closeEventLogs(page)
    // We check after closing the modal so that if the test fail we are in a "neutral" state
    expect(nbLogs).to.equal(1)
    expect(memberLogExists).beTrue()
  })

  it('org member can edit his events', async () => {
    const memberEvent = _.find(org.events, { name: 'Member event' })
    const managerEvent = _.find(org.events, { name: 'Manager event' })
    // Edition allowed on event if coordinator
    expect(await events.eventExists(page, org, memberEvent, 'name')).beTrue()
    await core.expandCard(page, events.eventComponent, memberEvent.name)
    expect(await events.eventActionExists(page, org, memberEvent, 'edit-item-header')).beTrue()
    expect(await events.eventActionExists(page, org, memberEvent, 'edit-item-description')).beTrue()
    expect(await events.eventActionExists(page, org, memberEvent, 'remove-item-header')).beTrue()
    // Edition disalloed on event if not coordinator
    expect(await events.eventExists(page, org, managerEvent, 'name')).beTrue()
    await core.expandCard(page, events.eventComponent, managerEvent.name)
    expect(await events.eventActionExists(page, org, managerEvent, 'edit-item-header')).beFalse()
    expect(await events.eventActionExists(page, org, managerEvent, 'edit-item-description')).beFalse()
    expect(await events.eventActionExists(page, org, managerEvent, 'remove-item-header')).beFalse()
    // Edition
    await events.editEventName(page, org, memberEvent, 'New Member event')
    memberEvent.name = 'New Member event'
    expect(await events.eventExists(page, org, memberEvent, 'name')).beTrue()
    await events.editEventDescription(page, org, memberEvent, 'Member event description')
    memberEvent.description = 'Member event description'
    expect(await events.eventExists(page, org, memberEvent, 'description')).beTrue()
  })

  it('org member can remove his events', async () => {
    const memberEvent = _.find(org.events, { name: 'New Member event' })
    await events.removeEvent(page, org, memberEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
  })

  it('org manager can edit event templates', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const template = _.find(org.eventTemplates, { name: 'Member template' })
    await events.editEventTemplateName(page, org, template, 'New Member template')
    template.name = 'New Member template'
    expect(await events.eventTemplateExists(page, org, template, 'name')).beTrue()
    await events.editEventTemplateDescription(page, org, template, 'Member template description')
    template.description = 'Member template description'
    expect(await events.eventTemplateExists(page, org, template, 'description')).beTrue()
  })

  it('org manager can remove event templates', async () => {
    let template = _.find(org.eventTemplates, { name: 'New Member template' })
    await events.removeEventTemplate(page, org, template)
    template = _.find(org.eventTemplates, { name: 'Manager template' })
    expect(await events.countEventTemplates(page, org)).to.equal(1)
    await events.removeEventTemplate(page, org, template)
    expect(await events.countEventTemplates(page, org)).to.equal(0)
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
