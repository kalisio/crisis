import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client.js'
import * as members from './members.mjs'
import * as organisations from './organisations.mjs'

const suite = 'members'

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
      permissions: 'manager'
    }, {
      name: 'Member',
      email: 'member@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'member'
    }, {
      name: 'Guest',
      email: 'guest@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'owner'
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
      browser: {
        slowMo: 1,
        args: ['--lang=fr']
      },
      localStorage: {
        'kalisio crisis-welcome': false
      }
    })
    // Prepare structure for current run
    await client.createOrganisation(org)
    // Create members outside organisation
    await client.createUser(_.find(org.members, { name: 'Member' }))
    await client.createUser(_.find(org.members, { name: 'Manager' }))
    page = await runner.start()
  })

  beforeEach(() => {
    runner.clearErrors()
  })

  afterEach(() => {
    expect(runner.hasError()).beFalse()
  })

  it('org owner can add members', async () => {
    await core.login(page, org.owner)
    // Add manager
    const manager = _.find(org.members, { name: 'Manager' })
    await members.addMember(page, org, manager)
    expect(await members.countMembers(page, org)).to.equal(2)
    expect(await members.memberExists(page, org, manager)).beTrue()
    // Add member
    const member = _.find(org.members, { name: 'Member' })
    await members.addMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(3)
    expect(await members.memberExists(page, org, member)).beTrue()
  })

  it('org owner can invite member', async () => {
    const guest = _.find(org.members, { name: 'Guest' })
    await members.inviteMember(page, org, guest)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.memberExists(page, org, guest)).beTrue()
  })

  it('org owner can filter members', async () => {
    // Owners
    let filter = { owner: true, manager: false, member: false, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(2)
    expect(await members.memberExists(page, org, org.owner)).beTrue()
    // Managers
    filter = { owner: false, manager: true, member: false, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(1)
    expect(await members.memberExists(page, org, _.find(org.members, { name: 'Manager' }))).beTrue()
    // Members
    filter = { owner: false, manager: false, member: true, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(1)
    expect(await members.memberExists(page, org, _.find(org.members, { name: 'Member' }))).beTrue()
    // Guest
    filter = { owner: false, manager: false, member: false, guest: true }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(1)
    expect(await members.memberExists(page, org, _.find(org.members, { name: 'Guest' }))).beTrue()
    // None
    filter = { owner: false, manager: false, member: false, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(4)
  })

  it('member cannot manage org', async () => {
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    const guest = _.find(org.members, { name: 'Guest' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    expect(await organisations.countOrganisations(page)).to.equal(1)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.canAddMember(page, org)).beFalse()
    expect(await members.canEditMember(page, org, member)).beFalse()
    expect(await members.canEditMember(page, org, manager)).beFalse()
    expect(await members.canEditMember(page, org, guest)).beFalse()
    expect(await members.canReinviteGuest(page, org, guest)).beFalse()
    expect(await members.canEditMember(page, org, org.owner)).beFalse()
  })

  it('manager can manage org', async () => {
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    const guest = _.find(org.members, { name: 'Guest' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, manager)
    expect(await organisations.countOrganisations(page)).to.equal(1)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.canAddMember(page, org)).beTrue()
    expect(await members.canEditMember(page, org, manager)).beTrue()
    expect(await members.canEditMember(page, org, member)).beTrue()
    expect(await members.canEditMember(page, org, guest)).beFalse()
    expect(await members.canReinviteGuest(page, org, guest)).beTrue()
    expect(await members.canEditMember(page, org, org.owner)).beTrue()
    await members.removeMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(3)
  })

  it('manager cannot remove owner', async () => {
    const owner = org.owner
    await members.removeMember(page, org, owner)
    expect(await core.isToastVisible(page)).beTrue()
    runner.clearErrors()
  })

  it('owner can remove manager', async () => {
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, org.owner)
    const manager = _.find(org.members, { name: 'Manager' })
    await members.removeMember(page, org, manager)
    expect(await members.countMembers(page, org)).to.equal(2)
  })

  after(async () => {
    await runner.stop()
    // First remove members in case removal test failed
    await client.removeMembers(org)
    // Then organisation/owner
    await client.removeOrganisation(org)
  })
})
