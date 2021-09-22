import _ from 'lodash'
import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import * as groups from './groups'
import * as members from './members'

const suite = 'groups'

describe(suite, () => {
  let runner, page, api, client
  let org = {
    owner: {
      name: 'Group owner 1',
      email: 'group-owner-1@kalisio.xyz',
      password: 'Pass;word1'
    },
    members: [{
      name: 'Group owner 2',
      email: 'group-owner-2@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'manager'
    },{
      name: 'Group manager 1',
      email: 'group-manager-1@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'manager'
    }, {
      name: 'Group manager 2',
      email: 'group-manager-2@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'manager'
    }, {
      name: 'Group member',
      email: 'group-member@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'member'
    }],
    groups: [{
      name: 'Group 1',
      description: 'Group number 1',
    }, {
      name: 'Group 2',
      description: 'Group number 2'
    }]
  }

  before(async function () {
    // Let enough time to process
    this.timeout(60000)
    api = new core.Api()
    client = api.createClient()
    runner = new core.Runner(suite, {
      browser: {
        slowMo: 1,
        args: ['--lang=fr']
      },
      localStorage: {
        'akt\'n\'map-welcome': false
      }
    })
    // Prepare structure for current run
    await client.createOrganisation(org)
    await client.createMembers(org)
    // Groups will be manually created by test
    //await client.createGroups(org)
    page = await runner.start()
  })

  beforeEach(async () => {
    runner.clearErrors()
  })

  afterEach(async () => {
    expect(runner.hasError()).to.false
  })

  it('org owner can create a group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    await core.login(page, org.owner.email, org.owner.password)
    await core.closeSignupAlert(page)
    await groups.createGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(1)
    expect(await groups.groupExists (page, org, group)).to.be.true
  })

  it('group owner can add members to his group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    let member = _.find(org.members, { name: 'Group manager 2' })
    await members.joinGroup(page, org, group, member)
    member = _.find(org.members, { name: 'Group member' })
    await members.joinGroup(page, org, group, member)
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(3)
  })

  it('group owner can remove his group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    await groups.removeGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(0)
    await core.logout(page)
  })

  after(async () => {
    await runner.stop()
    // First remove groups in case removal test failed
    await client.removeGroups(org)
    // Then members
    await client.removeMembers(org)
    // Then organisation/owner
    await client.removeOrganisation(org)
  })
})