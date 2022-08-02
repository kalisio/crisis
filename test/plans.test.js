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
    const member = _.find(org.members, { name: 'Owner' })
    await core.login(page, member)
    //Ci-dessous : problème pour créer un modèle de plan
    const planTemplate = _.find(org.planTemplates, { name: 'Manager plan template' })
    await plans.createPlanTemplate(page, org, planTemplate)
    //await page.waitForTimeout(30000)
    expect(await plans.countPlanTemplates(page, org)).to.equal(1)
    expect(await plans.planTemplateExists(page, org, planTemplate, 'name')).beTrue()
  })

  /* it('org manager can create plan from template', async () => {
    const managerTemplate = _.find(org.planTemplates, { name: 'Manager plan template' })
    const managerPlanOne = _.find(org.events, { name: 'Manager event 1' })
    await events.createPlan(page, org, managerTemplate, managerPlanOne)
    const managerPlanTwo = _.find(org.events, { name: 'Manager event 2' })
    await events.createEvent(page, org, managerTemplate, managerPlanTwo)
    expect(await events.countEvents(page, org)).to.equal(2)
    //Corriger l'erreur
    //expect(await events.eventExists(page, org, managerTemplate, 'description')).beTrue()
    expect(await events.eventExists(page, org, managerEventOne, 'name')).beTrue()
    expect(await events.eventExists(page, org, managerEventTwo, 'name')).beTrue()
  }) */

  // Ci-dessous je conserve le fil de ce qui me sert de modèle pour le scénario de test (events.test.js)
  /* it('org manager can remove his events', async () => {
    await core.clickAction(page, 'events')
    const memberEvent = _.find(org.events, { name: 'Manager event 1' })
    await events.removeEvent(page, org, memberEvent)
    expect(await events.countEvents(page, org)).to.equal(1)
  }) */
  
  /* it('logbook shows 2 events', async () => {
    expect(await logbooks.countLogbookEvents(page, org)).to.equal(2)
  })

  it('logbook shows 1 active event', async () => {
    await logbooks.goToLogbook(page, org)
    await page.waitForTimeout(2000)
    expect(await logbooks.countLogbookOpenedItems(page, org)).to.equal(1)
  })

  it('logbook shows 1 closed event', async () => {
    await page.waitForTimeout(2000)
    expect(await logbooks.countLogbookClosedItems(page, org)).to.equal(1)
    //expect(await logbooks.countLogbookEventsTest(page, org, 'closed')).to.equal(1)
  }) */

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
