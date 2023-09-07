import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client.js'
import * as groups from './groups.mjs'
import * as members from './members.mjs'

const suite = 'groups'

describe(`suite:${suite}`, () => {
  let runner, page, api, client
  const org = {
    owner: {
      name: 'Owner',
      email: 'owner@kalisio.xyz',
      password: 'Pass;word1'
    },
    members: [{
      name: 'Member',
      email: 'member@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'member'
    }, {
      name: 'Manager',
      email: 'manager@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'manager'
    }],
    groups: [{
      name: 'Group 1',
      description: 'Group number 1'
    }, {
      name: 'Group 2',
      description: 'Group number 2'
    }]
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
      notifications: true,
      browser: {
        slowMo: 5,
        args: ['--lang=fr']
      },
      localStorage: {
        'kalisio crisis-welcome': false,
        'kalisio crisis-install': false
      }
    })
    // Prepare structure for current run
    await client.createOrganisation(org)
    await client.createMembers(org)
    // Groups will be manually created by test
    // await client.createGroups(org)
    page = await runner.start()
  })

  beforeEach(() => {
    runner.clearErrors()
  })

  afterEach(() => {
    expect(runner.hasError()).beFalse()
  })

  it('org owner can create a group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    await core.login(page, org.owner)
    await groups.createGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(1)
    expect(await groups.groupExists(page, org, group)).beTrue()
  })

  it('org owner can add members to a group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    let member = _.find(org.members, { name: 'Manager' })
    await members.joinGroup(page, org, group, member, 'member')
    member = _.find(org.members, { name: 'Member' })
    await members.joinGroup(page, org, group, member, 'member')
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(2)
  })

  it('org member cannot edit his group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    // No edition on group
    expect(await groups.groupActionExists(page, org, group, 'edit-item-header')).beFalse()
    expect(await groups.groupActionExists(page, org, group, 'edit-item-description')).beFalse()
    expect(await groups.groupActionExists(page, org, group, 'remove-item-header')).beFalse()
    // Neither on members
    await members.goToMembersActivity(page, org)
    expect(await members.memberActionExists(page, org, org.owner, 'join-group')).beFalse()
    await core.clickItemAction(page, members.memberComponent, org.owner.name, `${_.kebabCase(group.name)}-button`)
    expect(await core.elementExists(page, '#leave-group')).beFalse()
  })

  it('org owner can remove members from a group', async () => {
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, org.owner)
    const group = _.find(org.groups, { name: 'Group 1' })
    const member = _.find(org.members, { name: 'Manager' })
    await members.leaveGroup(page, org, group, member)
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(1)
  })

  it('org owner can edit a group', async () => {
    const group = _.find(org.groups, { name: 'Group 1' })
    await groups.editGroupName(page, org, group, 'New Group 1')
    group.name = 'New Group 1'
    expect(await groups.groupExists(page, org, group, 'name')).beTrue()
    await groups.editGroupDescription(page, org, group, 'Group 1 description')
    group.description = 'Group 1 description'
    expect(await groups.groupExists(page, org, group, 'description')).beTrue()
  })

  // Now managers can manage all groups it can be left empty
  it('last member can be removed from a group', async () => {
    const group = _.find(org.groups, { name: 'New Group 1' })
    const member = _.find(org.members, { name: 'Member' })
    await members.leaveGroup(page, org, group, member)
    // This one generates an expected error message
    // expect(await core.isToastVisible(page)).beTrue()
    // runner.clearErrors()
  })

  it('org manager can create a group', async () => {
    await core.logout(page)
    const member = _.find(org.members, { name: 'Manager' })
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const group = _.find(org.groups, { name: 'Group 2' })
    await groups.createGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(2)
    expect(await groups.groupExists(page, org, group)).beTrue()
  })

  it('org manager can add members to a group', async () => {
    const group = _.find(org.groups, { name: 'Group 2' })
    const member = _.find(org.members, { name: 'Member' })
    await members.joinGroup(page, org, group, member, 'manager')
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(1)
  })

  it('group manager can add members to his group', async () => {
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const group = _.find(org.groups, { name: 'Group 2' })
    await members.joinGroup(page, org, group, org.owner, 'member')
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(2)
  })

  it('group manager can remove members from his group', async () => {
    const group = _.find(org.groups, { name: 'Group 2' })
    await members.leaveGroup(page, org, group, org.owner)
    await groups.goToGroupMembersActivity(page, org, group)
    expect(await members.countMembers(page, org)).to.equal(1)
  })

  it('group manager cannot edit his group', async () => {
    const group = _.find(org.groups, { name: 'Group 2' })
    // No edition on group
    expect(await groups.groupActionExists(page, org, group, 'edit-item-header')).beFalse()
    expect(await groups.groupActionExists(page, org, group, 'edit-item-description')).beFalse()
    expect(await groups.groupActionExists(page, org, group, 'remove-item-header')).beFalse()
  })

  it('org manager can edit a group', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    const group = _.find(org.groups, { name: 'Group 2' })
    await groups.editGroupName(page, org, group, 'New Group 2')
    group.name = 'New Group 2'
    expect(await groups.groupExists(page, org, group, 'name')).beTrue()
    await groups.editGroupDescription(page, org, group, 'Group 2 description')
    group.description = 'Group 2 description'
    expect(await groups.groupExists(page, org, group, 'description')).beTrue()
  })

  it('org manager can remove a group', async () => {
    const group = _.find(org.groups, { name: 'New Group 2' })
    await groups.removeGroup(page, org, group)
    expect(await groups.countGroups(page, org)).to.equal(1)
  })

  it('org owner can remove a group', async () => {
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, org.owner)
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
