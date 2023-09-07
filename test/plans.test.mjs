import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client.js'
import * as plans from './plans.mjs'
import * as events from './events.mjs'

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
      { name: 'Plan 1'},
      { name: 'Plan 2'},
      { name: 'Plan 3'},
      { name: 'Plan 4'}
    ],
    eventTemplate: {
      name: 'Event',
      description: 'Event description',
      permission: 'member',
      expiryDuration: '90'
    },
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

  it('owner can add objective to plan template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'Plan owner' })
    const objective = planTemplate.objective
    await plans.createPlanObjective(page, org, planTemplate, objective, 'planTemplate')
    expect(await plans.countPlanObjectives(page, org, planTemplate, 'planTemplate')).to.equal(1)
  })

  it('owner can edit plan template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'Plan owner' })
    await plans.editPlanTemplate(page, org, planTemplate, 'New plan owner')
    planTemplate.name = 'New plan owner'
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
    await plans.editPlanTemplateDescription(page, org, planTemplate, 'New plan owner decription')
    planTemplate.description = 'New plan owner decription'
    expect(await plans.planTemplateExists(page, org, planTemplate, 'description')).beTrue()
  })

  it('owner can create plan from template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan owner' })
    const plan = _.find(org.plans, { name: 'Plan 1' })
    await plans.createPlan(page, org, planTemplate, plan)
    expect(await plans.countPlans(page, org)).to.equal(1)
    expect(await plans.planExists(page, org, plan, 'name')).beTrue()
  })

  it('owner can edit plan', async () => {
    const plan = _.find(org.plans, { name: 'Plan 1' })
    await plans.editPlan(page, org, plan, 'New plan 1')
    plan.name = 'New plan 1'
    expect(await plans.planExists(page, org, plan, 'name')).beTrue()
    await plans.editPlanDescription(page, org, plan, 'New plan 1 decription')
    plan.description = 'New plan 1 decription'
    expect(await plans.planExists(page, org, plan, 'description')).beTrue()
  })

  it('owner can create events from plan', async () => {
    const eventTemplate = org.eventTemplate
    const plan = _.find(org.plans, { name: 'New plan 1' })
    await events.createEventTemplate(page, org, eventTemplate)
    await plans.goToPlanEvents(page, org, plan)
    await events.createEvent(page, org, eventTemplate, eventTemplate)
    expect(await events.countEvents(page, org)).to.equal(1)
  })

  it('notifications are not received for plan event without participants', async () => {
    // Check push notifications, it usually requires some time to be received
    await page.waitForTimeout(10000)
    expect(runner.hasInfo('New notification received: Event')).to.equal(0)
  })

  it('owner can close an event', async () => {
    const eventTemplate = org.eventTemplate
    const plan = _.find(org.plans, { name: 'New plan 1' })
    await plans.closePlanEvent(page, org, plan, eventTemplate)
    expect(await plans.planArchivedEventExists(page, org, plan, eventTemplate, 'name')).beTrue()
  })

  it('notifications are not received for plan event removal without participants', async () => {
    // Check push notifications, it usually requires some time to be received
    await page.waitForTimeout(10000)
    expect(runner.hasInfo('New notification received: Event')).to.equal(0)
  })

  it('owner can close a plan', async () => {
    const plan = _.find(org.plans, { name: 'New plan 1' })
    await plans.closePlan(page, org, plan)
    expect(await plans.countPlans(page, org)).to.equal(0)
    await plans.planArchivedExists(page, org, plan)
  })

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

  it('manager can edit plan template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'Plan manager' })
    await plans.editPlanTemplate(page, org, planTemplate, 'New plan manager')
    planTemplate.name = 'New plan manager'
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
    await plans.editPlanTemplateDescription(page, org, planTemplate, 'New plan manager decription')
    planTemplate.description = 'New plan manager decription'
    expect(await plans.planTemplateExists(page, org, planTemplate, 'description')).beTrue()
  })

  it('manager can create plan from template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan manager' })
    const plan = _.find(org.plans, { name: 'Plan 2' })
    await plans.createPlan(page, org, planTemplate, plan)
    expect(await plans.countPlans(page, org)).to.equal(1)
    expect(await plans.planExists(page, org, plan, 'name')).beTrue()
  })

  it('manager cannot create plan from template if is not the coordinator', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan owner' })
    expect(await plans.canCreatePlan(page, org, planTemplate)).beFalse()
    expect(await plans.countPlans(page, org)).to.equal(1)
  })

  it('member cannot create plan templates', async () => {
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    expect(await plans.canCreatePlanTemplate(page, org)).beFalse()
  })

  it('member cannot edit plan templates', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan owner' })
    expect(await plans.planTemplateActionExists(page, org, planTemplate, 'edit-item-header')).beFalse()
    expect(await plans.planTemplateActionExists(page, org, planTemplate, 'edit-item-description')).beFalse()
    expect(await plans.planTemplateActionExists(page, org, planTemplate, 'remove-item-header')).beFalse()
  })

  it('member can create plan from template if is the coordinator', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan owner' })
    const plan = _.find(org.plans, { name: 'Plan 4' })
    await plans.createPlan(page, org, planTemplate, plan)
    expect(await plans.countPlans(page, org)).to.equal(1)
    expect(await plans.planExists(page, org, plan, 'name')).beTrue()
  })

  it('member cannot create plan from template if is not the coordinator', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'New plan manager' })
    expect(await plans.canCreatePlan(page, org, planTemplate)).beFalse()
    expect(await plans.countPlans(page, org)).to.equal(1)
  })

  after(async function () {
    await runner.stop()
    // First remove members
    await client.removeMembers(org)
    // Then organisation/owner
    await client.removeOrganisation(org)
  })
})
