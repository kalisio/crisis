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
      name: 'Owner',
      email: 'owner@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'owner',
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
    planTemplates: [{
      name: 'Manager plan template',
      description: 'Plan template - creation right for manager',
      coordinators: [{
        name: 'Manager'
      }],
      permission: 'manager'
    }, {
      name: 'Owner plan template 1',
      description: 'Plan template 1 - creation right for owner',
      coordinators: [{
        name: 'Owner'
      }],
      permission: 'owner'
    }, {
      name: 'Owner plan template 2',
      description: 'Plan template 2 - creation right for owner',
      coordinators: [{
        name: 'Manager'
      }],
      permission: 'owner'
    }],
    planObjectives: [{
      name: 'Objective 1',
      description: 'Objective 1 description'
    }, {
      name: 'Objective 2',
      description: 'Objective 2 description'
    }],
    plans: [{
      name: 'Owner plan',
      participants: [{
        name: 'Tag'
      }, {
        name: 'Owner'
      }]
    },
    {
      name: 'Manager plan',
      participants: [{
        name: 'Tag'
      }, {
        name: 'Manager'
      }]
    }],
    eventTemplates: [{
      name: 'Member template',
      description: 'Template description',
      permission: 'member'
    }, {
      name: 'Manager template 1',
      description: 'Template 1 description',
      coordinators: [{
        name: 'Manager'
      }],
      permission: 'manager'
    }, {
      name: 'Manager template 2',
      description: 'Template 2 description',
      coordinators: [{
        name: 'Manager'
      }],
      permission: 'manager'
    }, {
      name: 'Owner template',
      description: 'Template description',
      coordinators: [{
        name: 'Owner'
      }],
      permission: 'owner'
    }],
    events: [{
      name: 'Member event',
      participants: [{
        name: 'Group'
      }]
    }, {
      name: 'Manager event',
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

  it('org owner can create plan templates', async () => {
    const member = _.find(org.members, { name: 'Owner' })
    await core.login(page, member)
    await core.closeSignupAlert(page)
    const planTemplate1 = _.find(org.planTemplates, { name: 'Owner plan template 1' })
    await plans.createPlanTemplate(page, org, planTemplate1)
    const planTemplate2 = _.find(org.planTemplates, { name: 'Owner plan template 2' })
    await plans.createPlanTemplate(page, org, planTemplate2)
    expect(await plans.countPlanTemplates(page, org)).to.equal(2)
    expect(await plans.planTemplateExists(page, org, planTemplate1, 'name')).beTrue()
    expect(await plans.planTemplateExists(page, org, planTemplate2, 'name')).beTrue()
  })
  /*
  // Problème ici : j'accède bien au formulaire du template que je veux, mais impossible d'écrire dans les champs
  it('org owner can add objective to plan template', async () => {
    const planTemplate = _.find(org.planTemplates, { name: 'Owner plan template 2' })
    const planObjective = _.find(org.planObjectives, { name: 'Objective 1' })
    await plans.goToPlanTemplateObjectives(page, org, planTemplate.name)
    await plans.createPlanTemplateObjective(page, org, planTemplate.name, planObjective, 10000)
    expect(await plans.countPlanObjectives(page, org, planTemplate)).to.equal(1)
  }) */

  it('org owner can create plan from template', async () => {
    const ownerTemplate = _.find(org.planTemplates, { name: 'Owner plan template 1' })
    const ownerPlan = _.find(org.plans, { name: 'Owner plan' })
    await plans.createPlan(page, org, ownerTemplate, ownerPlan)
    expect(await plans.countPlans(page, org)).to.equal(1)
    expect(await plans.planExists(page, org, ownerPlan, 'name')).beTrue()
    await core.logout(page)
    await core.goToLoginScreen(page)
  })

  it('org manager can create plan templates', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.login(page, member)
    const planTemplate = _.find(org.planTemplates, { name: 'Manager plan template' })
    await plans.createPlanTemplate(page, org, planTemplate)
    expect(await plans.countPlanTemplates(page, org)).to.equal(3)
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
  })

  it('org manager can create plan from template', async () => {
    const managerTemplate = _.find(org.planTemplates, { name: 'Manager plan template' })
    const managerPlan = _.find(org.plans, { name: 'Manager plan' })
    await plans.createPlan(page, org, managerTemplate, managerPlan)
    expect(await plans.countPlans(page, org)).to.equal(2)
    expect(await plans.planExists(page, org, managerPlan, 'name')).beTrue()
  })

  it('org manager can create event templates', async () => {
    const managerTemplateOne = _.find(org.eventTemplates, { name: 'Manager template 1' })
    await events.createEventTemplate(page, org, managerTemplateOne)
    const managerTemplateTwo = _.find(org.eventTemplates, { name: 'Manager template 2' })
    await events.createEventTemplate(page, org, managerTemplateTwo)
    expect(await events.countEventTemplates(page, org)).to.equal(2)
    expect(await events.eventTemplateExists(page, org, managerTemplateOne, 'name')).beTrue()
    expect(await events.eventTemplateExists(page, org, managerTemplateTwo, 'name')).beTrue()
  })

  it('org manager can create events from templates', async () => {
    await plans.goToPlansActivity(page, org, 3000)
    const planName = 'Manager plan'
    await plans.goToPlanEvents(page, org, planName, 5000)
    const managerTemplate = _.find(org.eventTemplates, { name: 'Manager template 1' })
    const managerEvent = _.find(org.events, { name: 'Manager event' })
    await events.createEvent(page, org, managerTemplate, managerEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
    expect(await events.eventExists(page, org, managerTemplate, 'description')).beTrue()
    expect(await events.eventExists(page, org, managerEvent, 'name')).beTrue()
  })

  it('event exists', async () => {
    const memberEvent = _.find(org.events, { name: 'Manager event' })
    memberEvent.name = 'Manager event'
    const planName = 'Manager plan'
    expect(await plans.planEventExists(page, org, planName, memberEvent, 'name')).beTrue()
  })

  it('org manager can close an event', async () => {
    const eventName = 'Manager event'
    await page.waitForTimeout(3000)
    await plans.expandPlanEvent(page, org, eventName, 5000)
    await plans.closePlanEvent(page, org, eventName, 20000)
  })

  after(async function () {
    // Let enough time to process
    this.timeout(60000)
    await runner.stop()
    // First remove groups in case removal test failed
    /* await client.removeGroups(org)
    // Then members
    await client.removeMembers(org)
    // Then organisation/owner
    await client.removeOrganisation(org) */
  })
})
