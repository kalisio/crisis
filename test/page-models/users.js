import { Selector } from 'testcafe'
import BasePage from './core/base-page'
import Screens from './core/screens'
import Layout from './core/layout'
import Account from './core/account'
import OrganisationSettings from './core/organisation-settings'

export default class Users extends BasePage {
  constructor () {
    super()
    this.screens = new Screens()
    this.layout = new Layout()
    this.account = new Account()
    this.organisationSettings = new OrganisationSettings()
  }

  async registerUsers (test, users) {
    for (let i in users) {
      await this.screens.goToRegisterScreen(test)
      await this.screens.register(test, users[i])
      await this.layout.closeSignupAlert(test)
      await this.layout.closeWelcomeDialog(test)
      await this.layout.clickLeftOpener(test)
      await this.layout.clickLeftPaneAction(test, pages.Layout.LOGOUT)
      await this.screens.goToLoginScreen(test)
    }
  }

  async unregisterUsers (test, users, verified = false) {
    for (let i in users) {
      await this.screens.login(test, users[i])
      if (!verified) await this.layout.closeSignupAlert(test)
      await this.layout.closeWelcomeDialog(test)
      await this.layout.clickOverflowMenu(test, OrganisationSettings.OVERFLOW_MENU_ENTRY)
      await this.layout.clickTabBar(test, OrganisationSettings.DANGER_ZONE_TAB)
      await this.this.organisationSettings.delete(test, users[i].name)
      await this.layout.clickLeftOpener(test)
      await this.layout.clickLeftPaneAction(test, pages.Account.MANAGE_ACCOUNT)
      await this.layout.clickTopPaneAction(test, pages.Account.DANGER_ZONE)
      await this.account.delete(test, users[i].name)
      await this.screens.goToLoginScreen(test)
    }
  }
}
