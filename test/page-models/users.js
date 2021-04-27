// Page models
import * as pages from '.'

const screens = new pages.Screens()
const layout = new pages.Layout()
const account = new pages.Account()
const organisations = new pages.Organisations()

export default class Users extends pages.BasePage {
  constructor () {
    super()
  }

  async registerUsers (test, users) {
    for (let i in users) {
      await screens.goToRegisterScreen(test)
      await screens.register(test, users[i])
      await layout.closeSignupAlert(test)
      await layout.closeWelcomeDialog(test)
      await layout.clickLeftOpener(test)
      await layout.clickLeftPaneAction(test, pages.Layout.LOGOUT)
      await screens.goToLoginScreen(test)
    }
  }

  async unregisterUsers (test, users, verified = false) {
    for (let i in users) {
      await screens.login(test, users[i])
      if (!verified) await layout.closeSignupAlert(test)
      await layout.closeWelcomeDialog(test)
      await layout.clickLeftOpener(test)
      await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY)
      await organisations.delete(test, users[i].name)
      await organisations.checkCount(test, 0)
      await layout.clickLeftOpener(test)
      await layout.clickLeftPaneAction(test, pages.Account.MANAGE_ACCOUNT)
      await layout.clickTopPaneAction(test, pages.Account.DANGER_ZONE)
      await account.delete(test, users[i].name)
      await screens.goToLoginScreen(test)
    }
  }
}
