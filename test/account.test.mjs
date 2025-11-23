import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from './kdk/index.mjs'
import { countOrganisations, organisationExists, createOrganisation, deleteOrganisation } from './organisations.mjs'
import { countMembers, memberExists } from './members.mjs'

const suite = 'account'

describe(`suite:${suite}`, () => {
  let runner, page, api, client
  const user = {
    name: 'My name',
    email: 'my.name@kalisio.xyz',
    password: 'Pass;word1'
  }
  const org = {
    name: user.name,
    description: 'My org'
  }

  before(async () => {
    chailint(chai, util)

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
    page = await runner.start()
  })

  beforeEach(() => {
    runner.clearErrors()
  })

  afterEach(() => {
    expect(runner.hasError()).beFalse()
  })

  it('create account', async () => {
    await core.waitForTimeout(10000)
    await core.goToRegisterScreen(page)
    await core.register(page, user)
  })

  it('check that the user has no organization', async () => {
    expect(await organisationExists(page, org)).beFalse()
    expect(await countOrganisations(page) === 0).beTrue()
  })

  it('create organization', async () => {
    await createOrganisation(page, org)
    expect(await organisationExists(page, org)).beTrue()
    expect(await countOrganisations(page) === 1).beTrue()
  })

  it('check organisation contains user only', async () => {
    expect(await countMembers(page, org) === 1).beTrue()
    expect(await memberExists(page, org, user)).beTrue()
  })

  it('check member removal is forbidden', async () => {
    expect(await core.isElementVisible(page, '#remove-member')).beFalse()
  })

  it('check account deletion is forbidden', async () => {
    await core.deleteAccount(page, user.name)
    expect(runner.hasError()).beTrue()
    runner.clearErrors()
  })

  it('update profile', async () => {
    await core.updateAccountProfile(page, 'My new name', runner.getDataPath('avatar.png'))
    user.name = 'My new name'
    // await core.openPane(page, 'left')
    // await core.waitForTimeout(5000)
    // expect(await runner.captureAndMatch('profile')).beTrue()
  })

  it('delete organisation', async () => {
    await deleteOrganisation(page, org)
    expect(await countOrganisations(page) === 0).beTrue()
  })

  it('delete account', async () => {
    await core.deleteAccount(page, user.name)
  })

  after(async () => {
    await runner.stop()
    await client.removeUser(user)
  })
})
