import _ from 'lodash'
import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import * as members from './members'
import * as organisations from './organisations'

const suite = 'members'

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
    }, {
      name: 'Guest',
      email: 'guest@kalisio.xyz',
      password: 'Pass;word1',
      permissions: 'owner'
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
    // Create members outside organisation
    await client.createUser(_.find(org.members, { name: 'Manager' }))
    await client.createUser(_.find(org.members, { name: 'Member' }))
    page = await runner.start()
  })

  beforeEach(() => {
    runner.clearErrors()
  })

  afterEach(() => {
    expect(runner.hasError()).to.false
  })

  it('org owner can add members', async () => {
    await core.login(page, org.owner)
    await core.closeSignupAlert(page)
    // Add manager
    const manager = _.find(org.members, { name: 'Manager' })
    await members.addMember(page, org, manager)
    expect(await members.countMembers(page, org)).to.equal(2)
    expect(await members.memberExists (page, org, manager)).to.be.true
    // Add member
    const member = _.find(org.members, { name: 'Member' })
    await members.addMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(3)
    expect(await members.memberExists (page, org, member)).to.be.true
  })
    
  it('org owner can invite member', async () => {
    const guest = _.find(org.members, { name: 'Guest' })
    await members.inviteMember(page, org, guest)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.memberExists (page, org, guest)).to.be.true
  })

  it('org owner can filter members', async () => {
    // Owners
    let filter = { owner: true, manager: false, member: false, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(2)
    expect(await members.memberExists (page, org, org.owner)).to.be.true
    // Managers
    filter = { owner: false, manager: true, member: false, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(1)
    expect(await members.memberExists (page, org, _.find(org.members, { name: 'Manager' }))).to.be.true
    // Members
    filter = { owner: false, manager: false, member: true, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(1)
    expect(await members.memberExists (page, org, _.find(org.members, { name: 'Member' }))).to.be.true
    // Guest
    filter = { owner: false, manager: false, member: false, guest: true }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(1)
    expect(await members.memberExists (page, org, _.find(org.members, { name: 'Guest' }))).to.be.true
    // None
    filter = { owner: false, manager: false, member: false, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(4)
    await core.logout(page)
    await core.goToLoginScreen(page)
  })

  it('member cannot manage org', async () => {
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    const guest = _.find(org.members, { name: 'Guest' })
    await core.login(page, member)
    await core.closeSignupAlert(page)
    expect(await organisations.countOrganisations(page)).to.equal(2)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.canAddMember(page, org)).to.be.false
    expect(await members.canEditMember(page, org, member)).to.be.false
    expect(await members.canEditMember(page, org, manager)).to.be.false
    expect(await members.canEditMember(page, org, guest)).to.be.false
    expect(await members.canReinviteGuest(page, org, guest)).to.be.false
    expect(await members.canEditMember(page, org, org.owner)).to.be.false
    await core.logout(page)
    await core.goToLoginScreen(page)
  })

  it('manager can manage org', async () => {
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    const guest = _.find(org.members, { name: 'Guest' })
    await core.login(page, manager)
    await core.closeSignupAlert(page)
    expect(await organisations.countOrganisations(page)).to.equal(2)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.canAddMember(page, org)).to.be.true
    expect(await members.canEditMember(page, org, manager)).to.be.true
    expect(await members.canEditMember(page, org, member)).to.be.true
    expect(await members.canEditMember(page, org, guest)).to.be.false
    expect(await members.canReinviteGuest(page, org, guest)).to.be.true
    expect(await members.canEditMember(page, org, org.owner)).to.be.true
    await members.removeMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(3)
  })

  it('manager cannot remove owner', async () => {
    const owner = org.owner
    await members.removeMember(page, org, owner)
    expect(await core.isToastVisible(page)).to.be.true
    runner.clearErrors()
    await core.logout(page)
    await core.goToLoginScreen(page)
  })

  it('owner can remove manager', async () => {
    await core.login(page, org.owner)
    await core.closeSignupAlert(page)
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