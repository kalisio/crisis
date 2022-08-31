import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client'
import * as plans from './plans'

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
    }],
    groups: [{
      name: 'Group',
      description: 'A group'
    }],
    planTemplates: [{
      name: 'Manager plan template',
      description: 'Plan template description',
      coordinators: 'Manager'/* ,
      permission: 'manager' */
    }],
    plans: [{
      name: 'Manager plan 1',
      participants: [{
        name: 'Tag'
      }, {
        name: 'Owner'
      }]
    },
    {
      name: 'Manager plan 2',
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

  it('org manager can create plan templates', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.login(page, member)
    await core.closeSignupAlert(page)
    const planTemplate = _.find(org.planTemplates, { name: 'Manager plan template' })
    await plans.createPlanTemplate(page, org, planTemplate)
    expect(await plans.countPlanTemplates(page, org)).to.equal(1)
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
  })

  it('org manager can create plan from template', async () => {
    const managerTemplate = _.find(org.planTemplates, { name: 'Manager plan template' })
    const managerPlanOne = _.find(org.plans, { name: 'Manager plan 1' })
    await plans.createPlan(page, org, managerTemplate, managerPlanOne)
    const managerPlanTwo = _.find(org.plans, { name: 'Manager plan 2' })
    await plans.createPlan(page, org, managerTemplate, managerPlanTwo)
    expect(await plans.countPlans(page, org)).to.equal(2)
    expect(await plans.planExists(page, org, managerPlanOne, 'name')).beTrue()
    expect(await plans.planExists(page, org, managerPlanTwo, 'name')).beTrue()
  })

  // Continuer les tests : suppression d'un plan par différents types de rôles, archivage...
  /* it('org manager can remove his plans', async () => {
    await core.clickAction(page, 'plans')
    const memberPlan = _.find(org.plans, { name: 'Manager plan 1' })
    await events.removePlan(page, org, memberEvent)
    expect(await events.countPlans(page, org)).to.equal(1)
  }) */

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
