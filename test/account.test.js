import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import { countOrganisations, organisationExists, createOrganisation, deleteOrganisation } from './organisations'

const suite = 'account'

describe(suite, () => {
  let runner
  let page
  let user = {
    name: 'Account Tester',
    email: 'account.test@kalisio.xyz',
    password: 'Pass;word1'
  }

  before(async () => {
    runner = new core.Runner(suite, {
      browser: {
        slowMo: 1
      }
    })
    page = await runner.start()
  })

  it('create-account', async () => {
    await core.goToRegisterScreen(page)
    await core.register(page, user.name, user.email, user.password)
    await core.closeSignupAlert(page)
    await core.closeWelcomeDialog(page)
  })

  it('check-user-has-one-organisation', async () => {
    expect(await organisationExists(page, user.name)).to.true
    expect(await countOrganisations(page) === 1).to.true
  })

  it('check-organisation-creation-is-forbidden', async () => {
    await createOrganisation(page, 'Dummy', 'Dummy organisation')
    expect(runner.hasError()).to.true
    runner.clearErrors()
    await core.clickAction(page, 'cancel-button')
  })

  it('check-account-deletion-is-forbidden', async () => {
    await core.deleteAccount(page, user.name)
    expect(runner.hasError()).to.true
    runner.clearErrors()
  })

  it('delete-organisation', async () => {
    await deleteOrganisation(page, user.name)
    expect(await countOrganisations(page) === 0).to.true
  })

  it('delete-account', async () => {
    await core.deleteAccount(page, user.name)
  })

  it('check-console', () => {
    expect(runner.hasError()).to.false
  })

  after(async () => {
    await runner.stop()
  })
})