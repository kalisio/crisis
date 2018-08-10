import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import ApplicationLayout from './layout'
import _ from 'lodash'

export default class Organisations extends ApplicationLayout {
  constructor () {
    super()
    // Organisation panel
    this.panel = VueSelector('k-organisations-panel')
    this.newLink = this.panel.find('#new-organisation')
    this.createModal = VueSelector('k-organisations-panel k-modal-editor')
  }
  async selectOrganisation (test, orgName) {
    await this.openSideNav(test)
    await test
      .click(this.panel.find('#' + _.kebabCase(orgName)))
      .wait(5000)
  }
  async selectOrganisationSettingsTab (test, orgName, tab) {
    await this.selectOrganisation(test, orgName)
    await this.clickOverflowMenu(test, '#settings')
    await this.clickTabBar(test, tab)
    await test.wait(5000)
  }
  async createOrganisation (test, org) {
    await this.openSideNav(test)
    await test
      .click(this.newLink)
      .wait(2000)
    await test
      .typeText(this.createModal.find('#name-field'), org.name, { replace: true })
      .typeText(this.createModal.find('#description-field'), org.description, { replace: true })
      .click(this.createModal.find('#apply-button'))
      .wait(5000)
  }
  async getBillingState (test) {
    const billingPane = await VueSelector('organisation-billing').getVue()
    return billingPane.state
  }
  async canEditCustomer (test) {
    const customerBlock = await VueSelector('organisation-billing k-block').getVue()
    if (customerBlock.props.disabled) return !customerBlock.props.disabled
    return true
  }
  async updateOrganisationCustomer (test, orgName, purchaser) {
    await this.selectOrganisationSettingsTab (test, orgName, '#billing')
    await test
      .click(VueSelector('organisation-billing k-block q-btn'))
      .wait(500)
    await test
      .click(this.customerEditor.find('#email-field'))
      .click(Selector('.q-popover .q-item').nth(purchaser))
      .typeText(await this.customerEditor.find('#vat-number-field'), 'My vat number', { replace: true })
      .click(await this.customEditor.find("#apply-button"))
      .wait(5000)
  }
  async deleteOrganisation (test, orgName) {
    await this.selectOrganisationSettingsTab (test, orgName, '#danger-zone')
    await test
      .click(VueSelector('k-organisation-dz k-block q-btn'))
      .wait(500)
    await test
      .typeText(Selector('.modal input[type=text]'), orgName)
      .click(Selector('.modal-buttons button').nth(0))
      .wait(5000)
  }
}
