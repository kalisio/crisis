import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client'
import * as members from './members'
import * as tags from './tags'

const suite = 'tags'

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
    }]
  }
  const apple = {
    value: 'apple'
  }
  const banana = {
    value: 'banana'
  }
  const strawberry = {
    value: 'strawberry'
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
    page = await runner.start()
  })

  beforeEach(async () => {
    runner.clearErrors()
  })

  afterEach(async () => {
    expect(runner.hasError()).beFalse()
  })

  it('owner can tag members', async () => {
    const owner = org.owner
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    await core.login(page, owner)
    await core.closeSignupAlert(page)
    expect(await tags.countTags(page, org)).to.equal(0)
    await members.editTags(page, org, owner, [apple])
    await members.editTags(page, org, manager, [banana])
    await members.editTags(page, org, member, [strawberry])
    expect(await tags.countTags(page, org)).to.equal(3)
    expect(await tags.tagExists(page, org, apple)).beTrue()
    expect(await tags.tagExists(page, org, banana)).beTrue()
    expect(await tags.tagExists(page, org, strawberry)).beTrue()
    await tags.listMembers(page, org, apple)
    expect(await members.countMembers(page, org)).to.equal(1)
    await core.logout(page)
    await core.goToLoginScreen(page)
  })
    .timeout(60000)

  it('manager can tag members', async () => {
    const owner = org.owner
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    await core.login(page, manager)
    expect(await tags.countTags(page, org)).to.equal(3)
    await members.editTags(page, org, owner, [apple])
    await members.editTags(page, org, manager, [apple])
    await members.editTags(page, org, member, [apple, banana], [strawberry], 3000)
    expect(await tags.countTags(page, org)).to.equal(2)
    await tags.listMembers(page, org, apple)
    expect(await runner.captureAndMatch('members-with-apple-tag')).beTrue()
    expect(await members.countMembers(page, org)).to.equal(3)
  })
    .timeout(60000)

  it('manager can edit tag', async () => {
    await tags.editTag(page, org, apple, 'green apple', { name: 'fa-apple', color: 'green' })
    apple.value = 'green apple'
    await tags.editTagDescription(page, org, apple, 'A green apple tag')
    expect(await runner.captureAndMatch('green-apple-tag')).beTrue()
    await tags.listMembers(page, org, apple)
    expect(await runner.captureAndMatch('members-with-green-icon-apple-tag')).beTrue()
    expect(await members.countMembers(page, org)).to.equal(3)
    await tags.editTag(page, org, apple, 'apple')
    await tags.listMembers(page, org, apple)
    expect(await runner.captureAndMatch('members-with-apple-tag')).beTrue()
  })
    .timeout(60000)

  it('manager cannot edit tag with existing value', async () => {
    await tags.editTag(page, org, apple, 'banana', null)
    expect(await core.isToastVisible(page)).beTrue()
    await core.click(page, '.q-dialog #cancel-button', 500)
    runner.clearErrors()
    await core.logout(page)
    await core.goToLoginScreen(page)
  })

  it('member cannot tag members', async () => {
    const owner = org.owner
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    await core.login(page, member)
    expect(await members.memberActionExists(page, org, owner, 'edit-item-tags')).beFalse()
    expect(await members.memberActionExists(page, org, manager, 'edit-item-tags')).beFalse()
    expect(await members.memberActionExists(page, org, member, 'edit-item-tags')).beFalse()
  })

  it('member cannot edit tag', async () => {
    expect(await tags.countTags(page, org)).to.equal(2)
    expect(await tags.canEditTag(page, org, apple)).beFalse()
    expect(await tags.canEditTag(page, org, banana)).beFalse()
    await core.logout(page)
    await core.goToLoginScreen(page)
  })

  after(async () => {
    await runner.stop()
    // Then members
    await client.removeMembers(org)
    // Then organisation/owner
    await client.removeOrganisation(org)
  })
})
