import _ from 'lodash'
import { expect } from 'chai'
import { core, map } from '@kalisio/kdk/test.client'
import * as events from './events'

const suite = 'event-workflow'

const AWAITING_PARTICIPANT = 'Le coordonnateur est en attente de votre action'
const AWAITING_COORDINATOR = 'En attente du coordonnateur'
const NOT_AWAITING_COORDINATION = 'Aucun participant en attente de coordination'
const AWAITING_COORDINATION = 'participants en attente de coordination'

describe(`suite:${suite}`, () => {
  let runner, page, api, client
  let org = {
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
      description: 'A group',
    }],
    eventTemplates: [{
      name: 'Workflow template',
      permission: 'manager',
      workflow:[{
        title: 'Step 1',
        stakeholder: 'participant',
        description: 'Availability',
        interaction: [{
          value: 'yes', icon: { name: 'fas fa-user', color: 'teal' }
        }, {
          value: 'no', icon: { name: 'fas fa-user', color: 'red' }
        }],
        end: ['no']
      }, {
        title: 'Step 2',
        stakeholder: 'coordinator',
        description: 'Engagement',
        interaction: [{
          value: 'yes', icon: { name: 'fas fa-bell', color: 'teal' }
        }, {
          value: 'no', icon: { name: 'fas fa-bell', color: 'blue-grey' }
        }],
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
      value: 'no', comment: 'on leave'
    }, {
      name: 'Member step 1',
      value: 'yes', comment: 'in 5 minutes'
    }, {
      name: 'Member step 2',
      value: 'yes', comment: 'truck #1'
    }]
  }

  before(async function () {
    // Let enough time to process
    this.timeout(90000)
    api = new core.Api({
      appName: 'aktnmap'
    })
    client = api.createClient()
    runner = new core.Runner(suite, {
      appName: 'aktnmap',
      geolocation: { latitude: 43.10, longitude:1.71 },
      browser: {
        slowMo: 1,
        args: ['--lang=fr'],
        devtools: true
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
    expect(runner.hasError()).to.false
  })

  it('org manager can create event templates without a workflow', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.login(page, member)
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    await events.createEventTemplate(page, org, workflowTemplate)
    expect(await events.countEventTemplates(page, org)).to.equal(1)
    expect(await events.eventTemplateExists(page, org, workflowTemplate, 'name')).to.be.true
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'add-item-workflow')).to.be.true
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'edit-item-workflow')).to.be.false
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'remove-item-workflow')).to.be.false
  })

  it('org manager can add workflow to templates', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    await events.createEventTemplateWorkflow(page, org, workflowTemplate)
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'add-item-workflow')).to.be.false
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'edit-item-workflow')).to.be.true
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'remove-item-workflow')).to.be.true
  })

  it('org manager can create events with a workflow from templates', async () => {
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    await events.createEvent(page, org, workflowTemplate, workflowEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
    expect(await events.eventExists(page, org, workflowEvent, 'name')).to.be.true
    expect(await events.eventExists(page, org, workflowEvent, 'description')).to.be.true
    // Waiting for first step
    const workflowStep = workflowTemplate.workflow[0]
    expect(await events.eventExists(page, org, workflowStep, 'title')).to.be.true
    expect(await events.eventExists(page, org, AWAITING_PARTICIPANT)).to.be.true
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).to.be.true
  })

  it('org manager can manage his workflow steps', async () => {
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    let workflowStep = _.find(org.eventLogs, { name: 'Manager step 1' })
    await events.logEventStep(page, org, workflowEvent, workflowStep)
    // Not waiting for first step anymore
    expect(await events.eventExists(page, org, AWAITING_PARTICIPANT)).to.be.false
    expect(await events.eventExists(page, org, workflowStep, 'value')).to.be.true
    expect(await events.eventExists(page, org, workflowStep, 'comment')).to.be.true
    // Not waiting for coordinator on second step
    workflowStep = workflowTemplate.workflow[1]
    expect(await events.eventExists(page, org, AWAITING_COORDINATOR)).to.be.false
    expect(await events.eventExists(page, org, workflowStep, 'title')).to.be.false
    // Waiting for member coordination on second step
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).to.be.true
  })

  it('org member can manage his workflow steps', async () => {
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    // Waiting for first step
    let workflowStep = workflowTemplate.workflow[0]
    expect(await events.eventExists(page, org, AWAITING_COORDINATION)).to.be.false
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).to.be.false
    expect(await events.eventExists(page, org, AWAITING_PARTICIPANT)).to.be.true
    expect(await events.eventExists(page, org, workflowStep, 'title')).to.be.true
    workflowStep = _.find(org.eventLogs, { name: 'Member step 1' })
    await events.logEventStep(page, org, workflowEvent, workflowStep)
    // Not waiting for first step anymore
    expect(await events.eventExists(page, org, AWAITING_PARTICIPANT)).to.be.false
    expect(await events.eventExists(page, org, workflowStep, 'value')).to.be.true
    expect(await events.eventExists(page, org, workflowStep, 'comment')).to.be.true
    // Waiting for coordination on second step
    workflowStep = workflowTemplate.workflow[1]
    expect(await events.eventExists(page, org, AWAITING_COORDINATOR)).to.be.true
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).to.be.false
    expect(await events.eventExists(page, org, AWAITING_COORDINATION)).to.be.false
    expect(await events.eventExists(page, org, workflowStep, 'title')).to.be.true
  })

  it('org manager can list participants workflow steps', async () => {
    let member = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    // Waiting for coordination on second step
    expect(await events.eventExists(page, org, AWAITING_COORDINATION)).to.be.true
    let workflowStep = _.find(org.eventLogs, { name: 'Manager step 1' })
    await events.goToEventLogs (page, org, workflowEvent)
    expect(await events.eventLogExists(page, org, workflowEvent, member.name)).to.be.true
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'value')).to.be.true
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'comment')).to.be.true
    workflowStep = _.find(org.eventLogs, { name: 'Member step 1' })
    member = _.find(org.members, { name: 'Member' })
    expect(await events.eventLogExists(page, org, workflowEvent, member.name)).to.be.true
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'value')).to.be.true
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'comment')).to.be.true
  })

  it('org manager can manage participants workflow steps', async () => {
    const member = _.find(org.members, { name: 'Member' })
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    const workflowStep = _.find(org.eventLogs, { name: 'Member step 2' })
    await events.logParticipantEventStep(page, org, workflowEvent, member, workflowStep)
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'value')).to.be.true
    expect(await events.eventLogExists(page, org, workflowEvent, workflowStep, 'comment')).to.be.true
    await events.closeEventLogs (page)
    // No more coordination to be performed
    expect(await events.eventExists(page, org, NOT_AWAITING_COORDINATION)).to.be.true
  })

  it('org manager can view event map', async () => {
    const workflowEvent = _.find(org.events, { name: 'Workflow event' })
    await events.goToEventMap(page, org, workflowEvent)
    // No more coordination to be performed
    await core.clickRightOpener(page)
    await map.clickLayerCategory(page, 'participants')
    /* TODO
    const member = _.find(org.members, { name: 'Manager' })
    let workflowStep = _.find(org.eventLogs, { name: 'Manager step 1' })
    expect(await events.eventParticipantExists(page, org, workflowEvent, member.name)).to.be.true
    workflowStep = _.find(org.eventLogs, { name: 'Member step 1' })
    member = _.find(org.members, { name: 'Member' })
    expect(await events.eventParticipantExists(page, org, workflowEvent, member.name)).to.be.true
    */
  })

  it('org manager can edit event template with workflow', async () => {
    await events.closeEventMap (page)
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    // TODO: make edition more complete
    workflowTemplate.workflow.forEach(step => {
      step.name = 'New ' + step.name
    })
    await events.editEventTemplateWorkflow(page, org, workflowTemplate)
    // TODO: check the updated workflow
  })

  it('org manager can remove workflow from templates', async () => {
    const workflowTemplate = _.find(org.eventTemplates, { name: 'Workflow template' })
    await events.removeEventTemplateWorkflow(page, org, workflowTemplate)
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'add-item-workflow')).to.be.true
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'edit-item-workflow')).to.be.false
    expect(await events.eventTemplateActionExists(page, org, workflowTemplate, 'remove-item-workflow')).to.be.false
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
