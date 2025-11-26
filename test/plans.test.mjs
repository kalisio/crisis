import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from './kdk/index.mjs'
import * as plans from './plans.mjs'
import * as events from './events.mjs'
import * as utilsClient from './utils.client.mjs'

const suite = 'plans'

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
      groups: [{ name: 'Group', permissions: 'manager' }]
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
    tags: [{
      value: 'Tag',
      description: 'Tag description'
    }],
    planTemplates: [{
      name: 'Plan owner',
      description: 'Plan owner decription',
      permission: 'owner',
      objective: {
        name: 'Objective',
        description: 'Objective description'
      }
    }, {
      name: 'Plan manager',
      description: 'Plan manager decription',
      coordinators: [{
        name: 'Manager'
      }],
      permission: 'manager'
    }, {
      name: 'Plan members',
      description: 'Plan members decription',
      coordinators: [{
        name: 'Member'
      }],
      permission: 'member'
    }],
    plans: [
      { name: 'Plan 1' },
      { name: 'Plan 2' },
      { name: 'Plan 3' },
      { name: 'Plan 4' }
    ],
    eventTemplate: {
      name: 'Event',
      description: 'Event description',
      permission: 'member',
      expiryDuration: '90'
    }
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

  it('owner can create plan templates', async () => {
    const member = org.owner
    let planTemplate = _.find(org.planTemplates, { name: 'Plan owner' })
    await core.login(page, member)
    await plans.createPlanTemplate(page, org, planTemplate)
    expect(await plans.countPlanTemplates(page, org)).to.equal(1)
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
    planTemplate = _.find(org.planTemplates, { name: 'Plan members' })
    await plans.createPlanTemplate(page, org, planTemplate)
    expect(await plans.countPlanTemplates(page, org)).to.equal(2)
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can add objective to plan template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'Plan owner' })
    const objective = planTemplate.objective
    await plans.createPlanObjective(page, org, planTemplate, objective, 'planTemplate')
    expect(await plans.countPlanObjectives(page, org, planTemplate, 'planTemplate')).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can edit plan template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'Plan owner' })
    await plans.editPlanTemplate(page, org, planTemplate, 'New plan owner')
    planTemplate.name = 'New plan owner'
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
    await plans.editPlanTemplateDescription(page, org, planTemplate, 'New plan owner decription')
    planTemplate.description = 'New plan owner decription'
    expect(await plans.planTemplateExists(page, org, planTemplate, 'description')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can create plan from template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan owner' })
    const plan = _.find(org.plans, { name: 'Plan 1' })
    await plans.createPlan(page, org, planTemplate, plan)
    expect(await plans.countPlans(page, org)).to.equal(1)
    expect(await plans.planExists(page, org, plan, 'name')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can edit plan', async () => {
    const plan = _.find(org.plans, { name: 'Plan 1' })
    await plans.editPlan(page, org, plan, 'New plan 1')
    plan.name = 'New plan 1'
    expect(await plans.planExists(page, org, plan, 'name')).beTrue()
    await plans.editPlanDescription(page, org, plan, 'New plan 1 decription')
    plan.description = 'New plan 1 decription'
    expect(await plans.planExists(page, org, plan, 'description')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can create events from plan', async () => {
    let eventTemplate = org.eventTemplate
    const plan = _.find(org.plans, { name: 'New plan 1' })
    await events.createEventTemplate(page, org, eventTemplate)
    await plans.goToPlanEvents(page, org, plan)
    eventTemplate.participants = [{
      name: 'Member'
    }]
    await events.createEvent(page, org, eventTemplate, eventTemplate)
    expect(await events.countEvents(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can close an event', async () => {
    const eventTemplate = org.eventTemplate
    const plan = _.find(org.plans, { name: 'New plan 1' })
    await plans.closePlanEvent(page, org, plan, eventTemplate)
    expect(await plans.planArchivedEventExists(page, org, plan, eventTemplate, 'name')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can close a plan', async () => {
    const plan = _.find(org.plans, { name: 'New plan 1' })
    await plans.closePlan(page, org, plan)
    expect(await plans.countPlans(page, org)).to.equal(0)
    await plans.planArchivedExists(page, org, plan)
  })
  // Let enough time to process
    .timeout(50000)

  it('manager can create plan templates', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const planTemplate = _.find(org.planTemplates, { name: 'Plan manager' })
    await plans.createPlanTemplate(page, org, planTemplate)
    expect(await plans.countPlanTemplates(page, org)).to.equal(3)
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('manager can edit plan template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'Plan manager' })
    await plans.editPlanTemplate(page, org, planTemplate, 'New plan manager')
    planTemplate.name = 'New plan manager'
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
    await plans.editPlanTemplateDescription(page, org, planTemplate, 'New plan manager decription')
    planTemplate.description = 'New plan manager decription'
    expect(await plans.planTemplateExists(page, org, planTemplate, 'description')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('manager can create plan from template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan manager' })
    const plan = _.find(org.plans, { name: 'Plan 2' })
    await plans.createPlan(page, org, planTemplate, plan)
    expect(await plans.countPlans(page, org)).to.equal(1)
    expect(await plans.planExists(page, org, plan, 'name')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('manager cannot create plan from template if is not the coordinator', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan owner' })
    expect(await plans.canCreatePlan(page, org, planTemplate)).beFalse()
    expect(await plans.countPlans(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  it('member cannot create plan templates', async () => {
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    expect(await plans.canCreatePlanTemplate(page, org)).beFalse()
  })
  // Let enough time to process
    .timeout(50000)

  it('member cannot edit plan templates', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan owner' })
    expect(await plans.planTemplateActionExists(page, org, planTemplate, 'edit-item-header')).beFalse()
    expect(await plans.planTemplateActionExists(page, org, planTemplate, 'edit-item-description')).beFalse()
    expect(await plans.planTemplateActionExists(page, org, planTemplate, 'remove-item-header')).beFalse()
  })
  // Let enough time to process
    .timeout(50000)

  it('member can create plan from template if is the coordinator', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan owner' })
    const plan = _.find(org.plans, { name: 'Plan 4' })
    await plans.createPlan(page, org, planTemplate, plan)
    expect(await plans.countPlans(page, org)).to.equal(1)
    expect(await plans.planExists(page, org, plan, 'name')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('member cannot create plan from template if is not the coordinator', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan manager' })
    expect(await plans.canCreatePlan(page, org, planTemplate)).beFalse()
    expect(await plans.countPlans(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  after(async function () {
    await runner.stop()
    // First remove members
    await utilsClient.removeMembers(org, client)
    // Then organisation/owner
    await utilsClient.removeOrganisation(org, client)
  })
})
