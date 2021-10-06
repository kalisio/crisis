import _ from 'lodash'
import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import * as groups from './groups'
import * as members from './members'

const suite = 'groups'

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
    api = new core.Api({
      appName: 'aktnmap'
    })
    client = api.createClient()
    runner = new core.Runner(suite, {
      appName: 'aktnmap',
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

  beforeEach(() => {
    runner.clearErrors()
  })

  afterEach(() => {
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

  it('org member cannot edit his group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    // No edition on group
    expect(await groups.groupActionExists(page, org, group, 'edit-item-header')).to.be.false
    expect(await groups.groupActionExists(page, org, group, 'edit-item-description')).to.be.false
    expect(await groups.groupActionExists(page, org, group, 'remove-item-header')).to.be.false
    // Neither on members
    await members.goToMembersActivity(page, org)
    expect(await members.memberActionExists(page, org, org.owner, 'join-group')).to.be.false
    await core.clickItemAction(page, members.memberComponent, org.owner.name, `${_.kebabCase(group.name)}-button`)
    expect(await core.elementExists(page, '#leave-group')).to.be.false
  })

  it('org owner can remove members from his group', async () => {
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, org.owner)
    await core.closeSignupAlert(page)
    const group = _.find(org.groups, { name: 'Group 1' })
    let member = _.find(org.members, { name: 'Manager' })
    await members.leaveGroup(page, org, group, member)
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(2)
  })

  it('org owner can edit his group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    await groups.editGroupName(page, org, group, 'New Group 1')
    group.name = 'New Group 1'
    expect(await groups.groupExists(page, org, group, 'name')).to.be.true
    await groups.editGroupDescription(page, org, group, 'Group 1 description')
    group.description = 'Group 1 description'
    expect(await groups.groupExists(page, org, group, 'description')).to.be.true
  })

  it('last owner cannot be removed from group', async () => {
    const group = _.find(org.groups, { name: 'New Group 1' })
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

  it('group manager can edit his group', async () => {
    const group = _.find(org.groups, { name: 'Group 2' })
    await groups.editGroupName(page, org, group, 'New Group 2')
    group.name = 'New Group 2'
    expect(await groups.groupExists(page, org, group, 'name')).to.be.true
    await groups.editGroupDescription(page, org, group, 'Group 2 description')
    group.description = 'Group 2 description'
    expect(await groups.groupExists(page, org, group, 'description')).to.be.true
  })

  it('org manager can remove his group', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const group = _.find(org.groups, { name: 'New Group 2' })
    await groups.removeGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(0)
  })

  it('org owner can remove his group', async () => {
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, org.owner)
    await core.closeSignupAlert(page)
    const group = _.find(org.groups, { name: 'New Group 1' })
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