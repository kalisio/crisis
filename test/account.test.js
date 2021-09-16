import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import { deleteOrganisation } from './organisations'

const suite = 'layout'

const runnerOptions = {
  browser: {
    slowMo: 1
  }
}

describe(suite, () => {
  let runner
  let page
  let user

  before(async () => {
    runner = new core.Runner(suite, runnerOptions)
    page = await runner.start()
    await core.goToRegisterScreen(page)
    user = {
      name: 'Account Tester',
      email: 'account.test@kalisio.xyz',
      password: 'Pass;word1'
    }
    await core.register(page, user.name, user.email, user.password)
    //await core.login(page, user.email, user.password)
    await core.closeSignupAlert(page)
    await core.closeWelcomeDialog(page)
  })

  it('delete-organisation', async () => {
    //expect(await core.countCards(page) === 1).to.true
    await deleteOrganisation(page, user.name)
    expect(await core.countCards(page) === 0).to.true
  })

  after(async () => {
    await core.deleteAccount(page, user.name)
    await runner.stop()
  })
})