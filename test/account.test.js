import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import { deleteOrganisation } from './organisations'

const suite = 'layout'

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

  it ('create-account', async () => {
    await core.goToRegisterScreen(page)
    await core.register(page, user.name, user.email, user.password)
    await core.closeSignupAlert(page)
    await core.closeWelcomeDialog(page)
  })

  it('check-account-deletion-forbidden', async () => {
    await core.deleteAccount(page, user.name)
    // TODO catch error messages
  })

  it('delete-organisation', async () => {
    await deleteOrganisation(page, user.name)
    expect(await core.countCards(page) === 0).to.true
  })

  it('delete-account', async () => {
    await core.deleteAccount(page, user.name)
  })

  after(async () => {
    await runner.stop()
  })
})