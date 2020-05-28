import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import Application from './application'

export default class Account extends Application {
  constructor () {
    super()
    // Profile Zone
    this.profileEditor = VueSelector('k-account-activity k-editor')
    // this.avatarInput = VueSelector('k-account-activity k-attachment-field')
    // The file input added by drop zone is actually hidden and replaced by dropzone GUI
    this.fileInput = Selector('.dz-hidden-input') //, { visibilityCheck: false })
    // this.nameInput = VueSelector('k-account-activity k-text-field')
    // this.updateProfile = VueSelector('k-account-activity').find('#apply-button')
    // Security Zone
    this.changePasswordButton = VueSelector('k-account-security k-block q-btn').nth(0)
    this.changePasswordScreen = VueSelector('k-change-password')
    this.changeEmailButton = VueSelector('k-account-security k-block q-btn').nth(1)
    this.changeEmailScreen = VueSelector('k-send-change-identity')
  }
  async editProfile (test, profile) {
    await this.clickIdentity(test)
    await this.clickTabBar(test, '#profile')
    await test
      .click(this.profileEditor.find('#avatar-field'))
      .setFilesToUpload(this.fileInput, profile.avatar)
      .wait(1000)
    await test
      .typeText(VueSelector('k-text-field'), profile.name, { replace: true })
      .click(this.profileEditor.find('#apply-button'))
      .wait(5000)
  }
  async updatePassword (test, identity) {
    await this.clickIdentity(test)
    await this.clickTabBar(test, '#security')
    await test
      .click(Selector('.q-card button'))
      .wait(250)
    await test
      .typeText(VueSelector('k-password-field').nth(0), identity.password, { replace: true })
      .typeText(VueSelector('k-password-field').nth(1), identity.newPassword, { replace: true })
      .typeText(VueSelector('k-password-field').nth(2), identity.newPassword, { replace: true })
      .click(this.changePasswordScreen.find('#change-password'))
      .wait(5000)
  }
  async updateEmail (test, identity) {
    await this.clickIdentity(test)
    await this.clickTabBar(test, '#security')
    await test
      .click(Selector('.q-card').nth(1).find('button'))
      .wait(250)
    await test
      .typeText(VueSelector('k-password-field'), identity.password, { replace: true })
      .typeText(VueSelector('k-email-field'), identity.newEmail, { replace: true })
      .click(this.changeEmailScreen.find('#change-identity'))
      .wait(5000)
  }
  async removeAccount (test, name) {
    await this.clickIdentity(test)
    await this.clickTabBar(test, '#danger-zone')
    await test
      .click(Selector('.q-card button'))
      .wait(250)
    await test
      .typeText(Selector('.q-dialog-plugin input[type=text]'), name)
      .click(Selector('.q-dialog-plugin button').nth(1))
      .wait(10000)
  }
}
