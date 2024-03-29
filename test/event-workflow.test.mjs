import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client.js'
import * as events from './events.mjs'

const suite = 'event-workflow'

const AWAITING_PARTICIPANT = 'Le coordonnateur est en attente de votre action'
const AWAITING_COORDINATOR = 'En attente du coordonnateur'
const NOT_AWAITING_COORDINATION = 'Aucun participant en attente de coordination'
const AWAITING_COORDINATION = 'participants en attente de coordination'

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
      groups: [{ name: 'Group', permissions: 'member' }]
    }, {
      name: 'Member',
      email: 'member@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'member',
      groups: [{ name: 'Group', permissions: 'member' }]
    }],
    groups: [{
      name: 'Group',
      description: 'A group'
    }],
    eventTemplates: [{
      name: 'Workflow template',
      permission: 'manager',
      expiryDuration: 90,
      workflow: [{
        title: 'Step 1',
        stakeholder: 'participant',
        description: 'Availability',
        interactions: ['yes', 'no'],
        end: ['no']
      }, {
        title: 'Step 2',
        stakeholder: 'coordinator',
        description: 'Engagement',
        interactions: ['yes', 'no'],
        end: ['no']
      }]
    }],
    events: [{
      name: 'Workflow event',
      description: 'Workflow description',
      participants: [{
        name: 'Group'
      }]
    }],
    eventLogs: [{
      name: 'Manager step 1',
      value: 'no',
      comment: 'on leave'
    }, {
      name: 'Member step 1',
      value: 'yes',
      comment: 'in 5 minutes'
    }, {
      name: 'Member step 2',
      value: 'yes',
      comment: 'truck #1'
    }]
  }

  before(async function () {
    chailint(chai, util)

    // Let enough time to process
    this.timeout(90000)
    api = new core.Api({
      appName: 'crisis'
    })
    client = api.createClient()
    runner = new core.Runner(suite, {
      appName: 'crisis',
      geolocation: { latitude: 43.10, longitude: 1.71 },
      notifications: true,
      browser: {
        slowMo: 1,
        args: ['--lang=fr'],
        devtools: false
      },
      localStorage: {
        'kalisio crisis-welcome': false,
        'kalisio crisis-install': false
      }
    })
    // Prepare structure for current run
    await client.createOrganisation(org)
    await client.createMembers(org)
    await client.createGroups(org)
    await client.groupMembers(org)
    page = await runner.start()
  })

  beforeEach(() => {
    runner.clearErrors()
  })

  afterEach(() => {
    expect(runner.hasError()).beFalse()
  })

  it('org manager can create event templates without a workflow', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.login(page, member)
    await core.closeWelcomeDialog(page)
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    await events.createEventTemplate(page, org, workflowTemplate)
    expect(await events.countEventTemplates(page, org)).to.equal(1)
    expect(await events.eventTemplateExists(page, org, workflowTemplate, 'name')).beTrue()
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'add-item-workflow')).beTrue()
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'edit-item-workflow')).beFalse()
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'remove-item-workflow')).beFalse()
  })

  it('org manager can add workflow to templates', async () => {
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    await events.createEventTemplateWorkflow(page, org, workflowTemplate)
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'add-item-workflow')).beFalse()
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'edit-item-workflow')).beTrue()
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'remove-item-workflow')).beTrue()
  })

  it('org manager can create events with a workflow from templates', async () => {
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    await events.createEvent(page, org, workflowTemplate, workflowEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
    expect(await events.eventExists(page, org, workflowEvent, 'name')).beTrue()
    expect(await events.eventExists(page, org, workflowEvent, 'description')).beTrue()
    // Waiting for first step
    const workflowStep = workflowTemplate.workflow[0]
    expect(await events.eventExists(page, org, workflowStep, 'title')).beTrue()
    expect(await events.eventExists(page, org, AWAITING_PARTICIPANT)).beTrue()
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).beTrue()
  })

  it('notifications are received for workflow event', async () => {
    // Check push notifications, it usually requires some time to be received
    await page.waitForTimeout(10000)
    expect(runner.hasInfo('New notification received: Workflow event')).to.equal(1)
  })

  it('org manager can manage his workflow steps', async () => {
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    let workflowStep = _.find(org.eventLogs, { name: 'Manager step 1' })
    await events.logEventStep(page, org, workflowEvent, workflowStep)
    // Not waiting for first step anymore
    expect(await events.eventExists(page, org, AWAITING_PARTICIPANT)).beFalse()
    expect(await events.eventExists(page, org, workflowStep, 'value')).beTrue()
    expect(await events.eventExists(page, org, workflowStep, 'comment')).beTrue()
    // Not waiting for coordinator on second step
    workflowStep = workflowTemplate.workflow[1]
    expect(await events.eventExists(page, org, AWAITING_COORDINATOR)).beFalse()
    expect(await events.eventExists(page, org, workflowStep, 'title')).beFalse()
    // Waiting for member coordination on second step
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).beTrue()
  })

  it('org member can manage his workflow steps', async () => {
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    await core.closeWelcomeDialog(page)
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    // Waiting for first step
    let workflowStep = workflowTemplate.workflow[0]
    expect(await events.eventExists(page, org, AWAITING_COORDINATION)).beFalse()
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).beFalse()
    expect(await events.eventExists(page, org, AWAITING_PARTICIPANT)).beTrue()
    expect(await events.eventExists(page, org, workflowStep, 'title')).beTrue()
    workflowStep = _.find(org.eventLogs, { name: 'Member step 1' })
    await events.logEventStep(page, org, workflowEvent, workflowStep)
    // Not waiting for first step anymore
    expect(await events.eventExists(page, org, AWAITING_PARTICIPANT)).beFalse()
    expect(await events.eventExists(page, org, workflowStep, 'value')).beTrue()
    expect(await events.eventExists(page, org, workflowStep, 'comment')).beTrue()
    // Waiting for coordination on second step
    workflowStep = workflowTemplate.workflow[1]
    expect(await events.eventExists(page, org, AWAITING_COORDINATOR)).beTrue()
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).beFalse()
    expect(await events.eventExists(page, org, AWAITING_COORDINATION)).beFalse()
    expect(await events.eventExists(page, org, workflowStep, 'title')).beTrue()
  })

  it('org manager can list participants workflow steps', async () => {
    let member = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    await core.closeWelcomeDialog(page)
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    // Waiting for coordination on second step
    expect(await events.eventExists(page, org, AWAITING_COORDINATION)).beTrue()
    let workflowStep = _.find(org.eventLogs, { name: 'Manager step 1' })
    await events.goToEventLogs(page, org, workflowEvent)
    expect(await events.eventLogExists(page, org, workflowEvent, member.name)).beTrue()
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'value')).beTrue()
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'comment')).beTrue()
    workflowStep = _.find(org.eventLogs, { name: 'Member step 1' })
    member = _.find(org.members, { name: 'Member' })
    expect(await events.eventLogExists(page, org, workflowEvent, member.name)).beTrue()
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'value')).beTrue()
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'comment')).beTrue()
  })

  it('org manager can manage participants workflow steps', async () => {
    const member = _.find(org.members, { name: 'Member' })
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    const workflowStep = _.find(org.eventLogs, { name: 'Member step 2' })
    await events.logParticipantEventStep(page, org, workflowEvent, member, workflowStep)
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'value')).beTrue()
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'comment')).beTrue()
    await events.closeEventLogs(page)
    // No more coordination to be performed
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).beTrue()
  })

  it('org manager can view event map', async () => {
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    await events.goToEventMap(page, org, workflowEvent)
    // No more coordination to be performed
    /* await core.clickRightOpener(page)
    await map.clickLayerCategory(page, 'participants')
    /* TODO
    const member = _.find(org.members, { name: 'Manager' })
    let workflowStep = _.find(org.eventLogs, { name: 'Manager step 1' })
    expect(await events.eventParticipantExists(page, org, workflowEvent, member.name)).beTrue()
    workflowStep = _.find(org.eventLogs, { name: 'Member step 1' })
    member = _.find(org.members, { name: 'Member' })
    expect(await events.eventParticipantExists(page, org, workflowEvent, member.name)).beTrue()
    */
    await events.closeEventMap(page)
  })

  it('org manager can edit event template with workflow', async () => {
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    workflowTemplate.workflow.forEach(step => {
      step.name = 'New ' + step.name
      step.interactions = ['New yes', ' New no']
      step.lastInteractionsLength = 2
      step.end = ['New no']
    })
    await events.editEventTemplateWorkflow(page, org, workflowTemplate)
    // TODO: check the updated workflow
  })

  it('org manager can remove workflow from templates', async () => {
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    await events.removeEventTemplateWorkflow(page, org, workflowTemplate)
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'add-item-workflow')).beTrue()
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'edit-item-workflow')).beFalse()
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'remove-item-workflow')).beFalse()
  })

  it('org manager can remove events and event templates', async () => {
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    await events.removeEvent(page, org, workflowEvent)
    expect(await events.countEvents(page, org)).to.equal(0)
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    await events.removeEventTemplate(page, org, workflowTemplate)
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
