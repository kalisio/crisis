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
    // Add member as manager
    let member = _.find(org.members, { name: 'Manager' })
    await members.addMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(2)
    expect(await members.memberExists (page, org, member)).to.be.true
  })
    
  it.skip('org owner can invite member', async () => {
    // Member without an account
    let member = _.find(org.members, { name: 'Member' })
    await members.inviteMember(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(3)
    expect(await members.memberExists (page, org, member)).to.be.true
  })

  it.skip('org owner can reissue invitation', async () => {
    const member = _.find(org.members, { name: 'Group owner 2' })
    await members.reissueMemberInvitation(page, org, member)
    expect(await members.countMembers(page, org)).to.equal(4)
    expect(await members.memberExists (page, org, member)).to.be.true
  })

  it('owner car tag members', async () => {
    let member = _.find(org.members, { name: 'Manager' })
    await members.addTag(page, org, member, 'manager')
    expect(await tags.countTags(page, org)).to.equal(1)
  })

  it.skip('group owner can remove members', async () => {
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