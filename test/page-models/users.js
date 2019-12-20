import { Selector } from 'testcafe'
import Application from './application'

export default class Users extends Application {
  constructor (authentication, account, organisations) {
    super()
    this.auth = authentication
    this.account = account
    this.org = organisations
  }
  async registerUsers (test, users) {
    for (let i in users) {
      await test.click(Selector('#register-link'))
      await this.app.register(test, users[i])
      await this.app.logout(test)
      await test.click(Selector('#login-link'))
      await test.wait(2000)
    }
  }
  async unregisterUsers (test, users) {
    for (let i in users) {
      await this.app.login(test, users[i])
      await this.org.deleteOrganisation(test, users[i].name)
      await this.account.removeAccount(test, users[i].name)
      await test.click('#login-link')
      await test.wait(2000)
    }
  }
}
