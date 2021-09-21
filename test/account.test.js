import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import { countOrganisations, organisationExists, createOrganisation, deleteOrganisation, editOrganisationBilling } from './organisations'
import { countMembers, memberExists, removeMember } from './members'

const suite = 'account'

describe(suite, () => {
  let runner
  let page
  let user = {
    name: 'My name',
    email: 'my.name@kalisio.xyz',
    password: 'Pass;word1'
  }
  let org = {
    name: user.name
  }

  before(async () => {
    runner = new core.Runner(suite, {
      browser: {
        slowMo: 1,
        args: ['--lang=fr']
      }
    })
    page = await runner.start()
  })

  beforeEach(async () => {
    runner.clearErrors()
  })

  it('create-account', async () => {
    await core.goToRegisterScreen(page)
    await core.register(page, user.name, user.email, user.password)
    //await core.login(page, user.email, user.password)
    await core.closeSignupAlert(page)
    await core.closeWelcomeDialog(page)
    expect(runner.hasError()).to.false
  })

   it('check-user-has-one-organisation', async () => {
    expect(await organisationExists(page, user.name)).to.true
    expect(await countOrganisations(page) === 1).to.true
    expect(runner.hasError()).to.false
  })

  it('check-organisation-contains-user-only', async() => {
    expect(await countMembers(page, org.name) === 1).to.true
    expect(await memberExists(page, org.name, user.name)).to.true
    expect(runner.hasError()).to.false
  })

  it('check-member-removal-is-forbidden', async() => {
    await removeMember(page, org.name, user.name)
    expect(runner.hasError()).to.true
  })

  it('check-organisation-creation-is-forbidden', async () => {
    await createOrganisation(page, 'My new org', 'My new organisation')    
    await core.clickAction(page, 'cancel-button')    
    expect(runner.hasError()).to.true    
  })

  it.skip('check-account-deletion-is-forbidden', async () => {
    await core.deleteAccount(page, user.name)
    expect(runner.hasError()).to.true
  })

  it('update-profile', async () => {
    await core.updateAccountProfile(page, 'My new name', runner.getDataPath('avatar.png'))
    user.name = 'My new name'
    await core.clickLeftOpener(page)
    expect(await runner.captureAndMatch('profile')).to.true
    expect(runner.hasError()).to.false
  })

  it('edit-organisation-billing', async () => {
    await editOrganisationBilling(page, org.name)
    await core.clickAction(page, 'close-button')
    await page.waitForTimeout(1000)
    expect(runner.hasError()).to.false
  })

  it('delete-organisation', async () => {
    await deleteOrganisation(page, org.name)
    expect(await countOrganisations(page) === 0).to.true
    expect(runner.hasError()).to.false
  })

  it('delete-account', async () => {
    await core.deleteAccount(page, user.name)
    expect(runner.hasError()).to.false
  })

  after(async () => {
    await runner.stop()
  })
})