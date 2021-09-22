import _ from 'lodash'
import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import * as members from './members'

const suite = 'members'

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
    // Organisation members will be manually added by test
    //await client.createMembers(org)
    // Create members outside organisation
    await client.createUser(_.find(org.members, { name: 'Manager' }))
    page = await runner.start()
  })

  beforeEach(async () => {
    runner.clearErrors()
  })

  afterEach(async () => {
    expect(runner.hasError()).to.false
  })

  it('org owner can invite members', async () => {
    let member = _.find(org.members, { name: 'Manager' })
    await core.login(page, org.owner)
    await core.closeSignupAlert(page)
    // Member having an account
    await members.addMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(2)
    expect(await members.memberExists (page, org, member)).to.be.true
    // Member without an account
    member = _.find(org.members, { name: 'Member' })
    await members.inviteMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(3)
    expect(await members.memberExists (page, org, member)).to.be.true
  })

  it('org owner can reissue invitation', async () => {
    const member = _.find(org.members, { name: 'Group owner 2' })
    await members.reissueMemberInvitation(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.memberExists (page, org, member)).to.be.true
  })

  it('group owner can remove members', async () => {
    const member = _.find(org.members, { name: '' })
    await groups.removeMember(page, group)
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