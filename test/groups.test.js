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
      name: 'Owner',
      email: 'owner@kalisio.xyz',
      password: 'Pass;word1'
    },
    members: [{
      name: 'Manager',
      email: 'manager@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'manager'
    }, {
      name: 'Member',
      email: 'member@kalisio.xyz',
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
    await core.login(page, org.owner)
    await core.closeSignupAlert(page)
    await groups.createGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(1)
    expect(await groups.groupExists(page, org, group)).to.be.true
  })

  it('org owner can add members to his group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    let member = _.find(org.members, { name: 'Manager' })
    await members.joinGroup(page, org, group, member, 'manager')
    member = _.find(org.members, { name: 'Member' })
    await members.joinGroup(page, org, group, member, 'member')
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(3)
  })

  it('org owner can remove members from his group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    let member = _.find(org.members, { name: 'Manager' })
    await members.leaveGroup(page, org, group, member)
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(2)
  })

  it('last owner cannot be removed from group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    await members.leaveGroup(page, org, group, org.owner)
    expect(await core.isToastVisible(page)).to.be.true
    // This one generates an expected error message
    runner.clearErrors()
  })

  it('org manager can create a group', async () => {
    await core.logout(page)
    const member = _.find(org.members, { name: 'Manager' })
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const group = _.find(org.groups, { name: 'Group 2' })
    await groups.createGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(1)
    expect(await groups.groupExists(page, org, group)).to.be.true
  })

  it('org manager can add members to his group', async () => {
    const group = _.find(org.groups, { name: 'Group 2' })
    const member = _.find(org.members, { name: 'Member' })
    await members.joinGroup(page, org, group, member, 'manager')
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(2)
  })

  it('group manager can add members to his group', async () => {
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const group = _.find(org.groups, { name: 'Group 2' })
    await members.joinGroup(page, org, group, org.owner, 'member')
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(3)
  })

  it('group manager can remove members from his group', async () => {
    const group = _.find(org.groups, { name: 'Group 2' })
    await members.leaveGroup(page, org, group, org.owner)
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(2)
  })

  it('org manager can remove his group', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const group = _.find(org.groups, { name: 'Group 2' })
    await groups.removeGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(0)
  })

  it('org owner can remove his group', async () => {
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, org.owner)
    await core.closeSignupAlert(page)
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