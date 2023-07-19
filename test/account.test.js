import chai, { util, expect } from 'chai'
import chailint from 'chai-lint'
import { core } from '@kalisio/kdk/test.client'
import { countOrganisations, organisationExists, createOrganisation, deleteOrganisation, editOrganisationBilling } from './organisations'
import { countMembers, memberExists, removeMember } from './members'

const suite = 'account'

describe(`suite:${suite}`, () => {
  let runner, page, api, client
  const user = {
    name: 'My name',
    email: 'my.name@kalisio.xyz',
    password: 'Pass;word1'
  }
  const org = {
    name: user.name
  }
  const newOrg = {
    name: 'My new org',
    description: 'A new org'
  }

  before(async () => {
    chailint(chai, util)

    api = new core.Api({
      appName: 'aktnmap'
    })
    client = api.createClient()
    runner = new core.Runner(suite, {
      appName: 'aktnmap',
      browser: {
        slowMo: 1,
        args: ['--lang=fr']
      }
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
    await core.goToRegisterScreen(page)
    await core.register(page, user)
    // await core.login(page, user)
    await core.closeSignupAlert(page)
    await core.closeWelcomeDialog(page)
  })

  it('check user has one organisation', async () => {
    expect(await organisationExists(page, org)).beTrue()
    expect(await countOrganisations(page) === 1).beTrue()
  })

  it('check organisation contains user only', async () => {
    expect(await countMembers(page, org) === 1).beTrue()
    expect(await memberExists(page, org, user)).beTrue()
  })

  it('check member removal is forbidden', async () => {
    await removeMember(page, org, user)
    expect(runner.hasError()).beTrue()
    runner.clearErrors()
  })

  it('check organisation creation is forbidden', async () => {
    await createOrganisation(page, newOrg)
    await core.clickAction(page, 'cancel-button')
    expect(runner.hasError()).beTrue()
    runner.clearErrors()
  })

  it.skip('check account deletion is forbidden', async () => {
    await core.deleteAccount(page, user.name)
    expect(runner.hasError()).beTrue()
    runner.clearErrors()
  })

  it('update profile', async () => {
    await core.updateAccountProfile(page, 'My new name', runner.getDataPath('avatar.png'))
    user.name = 'My new name'
    await core.clickLeftOpener(page)
    expect(await runner.captureAndMatch('profile')).beTrue()
  })

  it('edit organisation billing', async () => {
    await editOrganisationBilling(page, org)
    await core.clickAction(page, 'close-button')
    await page.waitForTimeout(1000)
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
