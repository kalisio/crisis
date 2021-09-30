import _ from 'lodash'
import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import * as members from './members'
import * as tags from './tags'

const suite = 'tags'

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
  const red = {
    value: 'red'
  }
  const orange = {
    value: 'orange'
  }
  const yellow = {
    value: 'yellow'
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
    page = await runner.start()
  })

  beforeEach(async () => {
    runner.clearErrors()
  })

  afterEach(async () => {
    expect(runner.hasError()).to.false
  })

  it('owner car tag members', async () => {
    const owner = org.owner
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    await core.login(page, owner)
    await core.closeSignupAlert(page)
    expect(await tags.countTags(page, org)).to.equal(0)
    await members.editTags(page, org, owner, [red])
    await members.editTags(page, org, manager, [orange])
    await members.editTags(page, org, member, [yellow])
    expect(await tags.countTags(page, org)).to.equal(3)
    expect(await tags.tagExists(page, org, red)).to.true
    expect(await tags.tagExists(page, org, orange)).to.true
    expect(await tags.tagExists(page, org, yellow)).to.true
    await tags.listMembers(page, org, red)
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
    await members.editTags(page, org, owner, [red])
    await members.editTags(page, org, manager, [red])
    await members.editTags(page, org, member, [red, orange], [yellow], 3000)
    expect(await tags.countTags(page, org)).to.equal(2)
    await tags.listMembers(page, org, red)
    expect(await members.countMembers(page, org)).to.equal(3)
  })
  .timeout(60000)

  it('manager can edit tags', async () => {
    await tags.editTagValue(page, org, red, 'dark red')
    red.name = 'dark red'
    await tags.editTagIcon(page, org, red, { name: 'fa-angry', color: 'red'})
    await tags.listMembers(page, org, red)
    expect(await members.countMembers(page, org)).to.equal(3)
    await core.logout(page)
    await core.goToLoginScreen(page)
  })
  .timeout(60000)

  it('member cannot tag members', async () => {
    const owner = org.owner
    const manager = _.find(org.members, { name: 'Manager' })
    const member = _.find(org.members, { name: 'Member' })
    await core.login(page, member)
    expect(await members.memberActionExists(page, org, owner, 'edit-item-tags')).to.false
    expect(await members.memberActionExists(page, org, manager, 'edit-item-tags')).to.false
    expect(await members.memberActionExists(page, org, member, 'edit-item-tags')).to.false
    expect(await tags.countTags(page, org)).to.equal(2)
    expect(await tags.canEditTag(page, org, red)).to.false
    expect(await tags.canEditTag(page, org, orange)).to.false
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