import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from './kdk/index.mjs'
import * as events from './events.mjs'
import * as utilsClient from './utils.client.mjs'

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
    tags: [{
      value: 'Tag',
      description: 'Tag description'
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
  // Let enough time to process
    .timeout(50000)

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
  // Let enough time to process
    .timeout(50000)

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
  // Let enough time to process
    .timeout(50000)

  it('org member cannot create event from templates without permissions', async () => {
    const template = _.find(org.eventTemplates, { name: 'Member template' })
    await events.goToEventsActivity(page, org)
    // We should have a single action and no fab if a single template is found
    // await core.clickAction(page, 'fab')
    expect(await core.elementExists(page, `#create-${_.kebabCase(template.name)}`)).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('org member can create events from templates', async () => {
    const memberTemplate = _.find(org.eventTemplates, { name: 'Member template' })
    const memberEvent = _.find(org.events, { name: 'Member event' })
    await events.createEvent(page, org, memberTemplate, memberEvent)
    expect(await events.countEvents(page, org)).to.equal(2)
  })
  // Let enough time to process
    .timeout(50000)

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
  // Let enough time to process
    .timeout(50000)

  it('org member can edit his events', async () => {
    const memberEvent = _.find(org.events, { name: 'Member event' })
    const managerEvent = _.find(org.events, { name: 'Manager event' })
    // Edition allowed on event if coordinator
    expect(await events.eventExists(page, org, memberEvent, 'name')).beTrue()
    await core.expandCard(page, events.eventComponent, memberEvent.name)
    expect(await events.eventActionExists(page, org, memberEvent, 'edit-item-header')).beTrue()
    expect(await events.eventActionExists(page, org, memberEvent, 'edit-item-description')).beTrue()
    expect(await events.eventActionExists(page, org, memberEvent, 'remove-item-header')).beTrue()
    // Edition disallowed on event if not coordinator
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
  // Let enough time to process
    .timeout(50000)

  it('notifications are not received for member event editing', async () => {
    // Check push notifications, it usually requires some time to be received
    await core.waitForTimeout(10000)
    expect(runner.hasInfo('New notification received: New Member event')).to.equal(0)
  })
  // Let enough time to process
    .timeout(50000)

  it('org member can remove his events', async () => {
    const memberEvent = _.find(org.events, { name: 'New Member event' })
    await events.removeEvent(page, org, memberEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

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
  // Let enough time to process
    .timeout(50000)

  it('org manager can remove event templates', async () => {
    let template = _.find(org.eventTemplates, { name: 'New Member template' })
    await events.removeEventTemplate(page, org, template)
    template = _.find(org.eventTemplates, { name: 'Manager template' })
    expect(await events.countEventTemplates(page, org)).to.equal(1)
    await events.removeEventTemplate(page, org, template)
    expect(await events.countEventTemplates(page, org)).to.equal(0)
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
