import _ from 'lodash'
import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from './kdk/index.mjs'
import * as members from './members.mjs'
import * as tags from './tags.mjs'
import * as utilsClient from './utils.client.mjs'

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
    }],
    tags: [{
      value: 'Tag 1',
      description: 'Tag 1 description'
    }, {
      value: 'Tag 2',
      description: 'Tag 2 description'
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
        args: ['--window-size=1280,1024']
      },
      localStorage: {
        'crisis-welcome': false,
        'crisis-install': false
      },
      lang: 'fr'
    })
    // Prepare structure for current run
    await utilsClient.createOrganisation(org, client)
    await utilsClient.createMembers(org, client)
    page = await runner.start()
  })

  it('owner can create a tag', async () => {
    await core.login(page, org.owner)
    expect(await tags.canCreateTag(page, org)).beTrue()
    const tag = _.find(org.tags, { value: 'Tag 1' })
    await tags.createTag(page, org, tag)
    expect(await tags.countTags(page, org)).to.equal(1)
    expect(await tags.tagExists(page, org, tag)).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can tag members', async () => {
    const tag = _.find(org.tags, { value: 'Tag 1' })
    let member = _.find(org.members, { name: 'Manager' })
    await members.addTag(page, org, tag, member)
    member = _.find(org.members, { name: 'Member' })
    await members.addTag(page, org, tag, member)
    await tags.goToTagMembersActivity(page, org, tag)
    expect(await members.countMembers(page, org)).to.equal(2)
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can remove members from a tag', async () => {
    const tag = _.find(org.tags, { value: 'Tag 1' })
    const member = _.find(org.members, { name: 'Manager' })
    await members.removeTag(page, org, tag, member)
    await tags.goToTagMembersActivity(page, org, tag)
    expect(await members.countMembers(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can edit a tag', async () => {
    const tag = _.find(org.tags, { value: 'Tag 1' })
    await tags.editTag(page, org, tag, 'New Tag 1')
    tag.value = 'New Tag 1'
    expect(await tags.tagExists(page, org, tag)).beTrue()
    await tags.editTagDescription(page, org, tag, 'New Tag 1 description')
    tag.description = 'New Tag 1 description'
    expect(await tags.tagExists(page, org, tag, 'description')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('member cannot edit tag', async () => {
    const tag = _.find(org.tags, { value: 'New Tag 1' })
    const member = _.find(org.members, { name: 'Member' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, member)
    expect(await tags.tagActionExists(page, org, tag, 'edit-item-header')).beFalse()
    expect(await tags.tagActionExists(page, org, tag, 'edit-item-description')).beFalse()
    expect(await tags.tagActionExists(page, org, tag, 'remove-item-header')).beFalse()
  })
  // Let enough time to process
    .timeout(50000)

  it('member cannot create a tag', async () => {
    expect(await tags.canCreateTag(page, org)).beFalse()
  })
  // Let enough time to process
    .timeout(50000)

  it('member cannot tag members', async () => {
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    expect(await members.memberActionExists(page, org, org.owner, 'add-tag')).beFalse()
    expect(await members.memberActionExists(page, org, manager, 'add-tag')).beFalse()
    expect(await members.memberActionExists(page, org, member, 'add-tag')).beFalse()
  })
  // Let enough time to process
    .timeout(50000)

  it('manager can create a tag', async () => {
    const manager = _.find(org.members, { name: 'Manager' })
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, manager)
    expect(await tags.canCreateTag(page, org)).beTrue()
    const tag = _.find(org.tags, { value: 'Tag 2' })
    await tags.createTag(page, org, tag)
    expect(await tags.countTags(page, org)).to.equal(2)
    expect(await tags.tagExists(page, org, tag)).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('manager can tag members', async () => {
    const tag = _.find(org.tags, { value: 'Tag 2' })
    let member = org.owner
    await members.addTag(page, org, tag, member)
    member = _.find(org.members, { name: 'Member' })
    await members.addTag(page, org, tag, member)
    await tags.goToTagMembersActivity(page, org, tag)
    expect(await members.countMembers(page, org)).to.equal(2)
  })
  // Let enough time to process
    .timeout(50000)

  it('manager can remove members from a tag', async () => {
    const tag = _.find(org.tags, { value: 'Tag 2' })
    const member = _.find(org.members, { name: 'Member' })
    await members.removeTag(page, org, tag, member)
    await tags.goToTagMembersActivity(page, org, tag)
    expect(await members.countMembers(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  it('manager can edit a tag', async () => {
    const tag = _.find(org.tags, { value: 'Tag 2' })
    await tags.editTag(page, org, tag, 'New Tag 2')
    tag.value = 'New Tag 2'
    expect(await tags.tagExists(page, org, tag)).beTrue()
    await tags.editTagDescription(page, org, tag, 'New Tag 2 description')
    tag.description = 'New Tag 2 description'
    expect(await tags.tagExists(page, org, tag, 'description')).beTrue()
  })
  // Let enough time to process
    .timeout(50000)

  it('manager can remove a tag', async () => {
    const tag = _.find(org.tags, { value: 'New Tag 2' })
    await tags.removeTag(page, org, tag)
    expect(await tags.countTags(page, org)).to.equal(1)
  })
  // Let enough time to process
    .timeout(50000)

  it('owner can remove a tag', async () => {
    await core.logout(page)
    await core.goToLoginScreen(page)
    await core.login(page, org.owner)
    const tag = _.find(org.tags, { value: 'New Tag 1' })
    await tags.removeTag(page, org, tag)
    expect(await tags.countTags(page, org)).to.equal(0)
  })
  // Let enough time to process
    .timeout(50000)

  after(async () => {
    await runner.stop()
    // First remove tags in case removal test failed
    await utilsClient.removeTags(org, client)
    // Then members
    await utilsClient.removeMembers(org, client)
    // Then organisation/owner
    await utilsClient.removeOrganisation(org, client)
  })
})
