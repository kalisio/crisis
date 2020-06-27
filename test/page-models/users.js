import { Selector } from 'testcafe'
import BasePage from './core/base-page'
import Screens from './core/screens'
import Layout from './core/layout'
import SideNav from './core/side-nav'
import Account from './core/account'
import OrganisationSettings from './core/organisation-settings'

export default class Users extends BasePage {
  constructor () {
    super()
    this.screens = new Screens()
    this.layout = new Layout()
    this.account = new Account()
    this.sideNav = new SideNav()
    this.organisationSettings = new OrganisationSettings()
  }

  async registerUsers (test, users) {
    for (let i in users) {
      await this.screens.goToRegisterScreen(test)
      await this.screens.register(test, users[i])
      await this.layout.closeSignupAlert(test)
      await this.layout.clickLeading(test)
      await this.sideNav.logout(test)
      await this.screens.goToLoginScreen(test)
    }
  }

  async unregisterUsers (test, users) {
    for (let i in users) {
      await this.screens.login(test, users[i])
      await this.layout.closeSignupAlert(test)
      await this.layout.clickOverflowMenu(test, OrganisationSettings.OVERFLOW_MENU_ENTRY)
      await this.layout.clickTabBar(test, OrganisationSettings.DANGER_ZONE_TAB)
      await this.organisationSettings.delete(test, users[i].name)
      await this.layout.clickLeading(test)
      await this.sideNav.clickIdentity(test)
      await this.layout.clickTabBar(test, Account.DANGER_ZONE_TAB)
      await this.account.delete(test, users[i].name)
      await this.screens.goToLoginScreen(test)
    }
  }
}
