import _ from 'lodash'
import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import * as members from './members'
import * as tags from './tags'

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
    }],
    guest: {
      name: 'Guest',
      email: 'guest@kalisio.xyz',
      permissions: 'manager'
    }
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

  beforeEach(async () => {
    runner.clearErrors()
  })

  afterEach(async () => {
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
    
  it.skip('org owner can invite member', async () => {
    const guest = org.guest
    await members.inviteMember(page, org, guest)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.memberExists (page, org, guest)).to.be.true
  })

  it.skip('org owner can filter members', async () => {
    // Owners
    let filter = { owner: true, manager: false, member: false, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(1)
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
    expect(await members.memberExists (page, org, _.find(org.members, { name: 'Manager' }))).to.be.true
    // All
    filter = { owner: true, manager: true, member: true, guest: true }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(4)
    // None
    filter = { owner: false, manager: false, member: false, guest: false }
    await members.filterMembers(page, org, filter)
    expect(await members.countMembers(page, org)).to.equal(4)
  })

  it.skip('org owner can reissue invitation', async () => {
    const member = _.find(org.members, { name: 'Group owner 2' })
    await members.reissueMemberInvitation(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.memberExists (page, org, member)).to.be.true
  })

  it('owner car tag members', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await members.addTag(page, org, member, 'tag')
    expect(await tags.countTags(page, org)).to.equal(1)
  })

  it('owner car remove tags', async () => {
    const member = _.find(org.members, { name: 'Manager' })
    await members.removeTag(page, org, member, 'tag')
    expect(await tags.countTags(page, org)).to.equal(0)
  })

  it('owner can remove members', async () => {
    const manager = _.find(org.members, { name: 'Manager' })
    await members.removeMember(page, org, manager)
    const member = _.find(org.members, { name: 'Member' })
    await members.removeMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(1)
  })

  after(async () => {
    await runner.stop()
    // First remove members in case removal test failed
    await client.removeMembers(org)
    // Then organisation/owner
    await client.removeOrganisation(org)
  })
})