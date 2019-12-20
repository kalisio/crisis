import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import Application from './application'
import _ from 'lodash'

export default class Organisations extends Application {
  constructor () {
    super()
    // Organisation panel
    this.panel = VueSelector('k-organisations-panel')
    this.newLink = this.panel.find('#new-organisation')
    this.createModal = VueSelector('k-organisations-panel k-modal-editor')
    this.customerEditor = VueSelector('organisation-billing k-customer-editor')
    this.cardFieldNumber = Selector('organisation-billing k-customer-editor .Cardfield-number')
    this.cardFieldExpiry = VueSelector('organisation-billing k-customer-editor .Cardfield-expiry')
    this.cardFieldCVC = VueSelector('organisation-billing k-customer-editor .Cardfield-cvc')
  }
  async selectOrganisation (test, orgName) {
    await this.openSideNav(test)
    await test
      .click(this.panel.find('#' + _.kebabCase(orgName)))
      .wait(250)
  }
  async selectOrganisationSettingsTab (test, orgName, tab) {
    await this.selectOrganisation(test, orgName)
    await this.clickOverflowMenu(test, '#settings')
    await this.clickTabBar(test, tab)
    await test.wait(1000)
  }
  async createOrganisation (test, org) {
    await this.openSideNav(test)
    await test
      .click(this.newLink)
      .wait(250)
    await test
      .typeText(this.createModal.find('#name-field'), org.name, { replace: true })
      .typeText(this.createModal.find('#description-field'), org.description, { replace: true })
      .click(this.createModal.find('#apply-button'))
      .wait(2000)
  }
  async getOrganisationBillingState (test) {
    const billingPane = await VueSelector('organisation-billing').getVue()
    return billingPane.state
  }
  async canEditOrganisationCustomer (test) {
    const customerBlock = await VueSelector('organisation-billing k-block').getVue()
    if (customerBlock.props.disabled) return !customerBlock.props.disabled
    return true
  }
  async checkOrganisationCustomer (test, pattern) {
    const customerBlock = await VueSelector('organisation-billing k-block').getVue()
    await test.expect(customerBlock.props.text).contains(pattern)
    return true
  }
  async updateOrganisationCustomer (test, orgName, customer) {
    await this.selectOrganisationSettingsTab(test, orgName, '#billing')
    await test
      .click(VueSelector('organisation-billing k-block q-btn'))
      .wait(250)
    await test
      .click(this.customerEditor.find('#email-field'))
      .click(Selector('.q-popover .q-item').nth(customer.index))
      .typeText(this.customerEditor.find('#description-field'), customer.description, { replace: true })
      .typeText(this.customerEditor.find('#vatNumber-field'), customer.vatNumber, { replace: true })
    if (customer.card) {
      await test
        .switchToIframe(Selector('.modal iframe'))
        .typeText(Selector('input[type=tel]').nth(0), customer.card.number, { replace: true })
        .typeText(Selector('input[type=tel]').nth(1), customer.card.expiry, { replace: true })
        .typeText(Selector('input[type=tel]').nth(2), customer.card.cvc, { replace: true })
        .typeText(Selector('input[type=tel]').nth(3), customer.card.postalCode, { replace: true })
        .switchToMainWindow()
        .wait(2000)
    }
    await test
      .click(this.customerEditor.find('#update-button'))
      .wait(5000)
  }
  async clearOrganisationCustomerCard (test, orgName) {
    await this.selectOrganisationSettingsTab(test, orgName, '#billing')
    await test
      .click(VueSelector('organisation-billing k-block q-btn'))
      .wait(250)
      .click(this.customerEditor.find('#clear-card-button'))
      .wait(250)
      .click(this.customerEditor.find('#update-button'))
      .wait(5000)
  }
  async canSelectOrganisationPlan (test, plan) {
    const planAction = await VueSelector('organisation-billing k-plan-chooser').find('#' + plan + '-action').getVue()
    return !planAction.props.disable
  }
  async selectOrganisationPlan (test, orgName, plan) {
    await this.selectOrganisationSettingsTab(test, orgName, '#billing')
    await test
      .click(VueSelector('organisation-billing k-plan-chooser').find('#' + plan + '-action'))
      .click(Selector('.modal-buttons button').nth(0))
      .wait(5000)
  }
  async deleteOrganisation (test, orgName) {
    await this.selectOrganisationSettingsTab(test, orgName, '#danger-zone')
    await test
      .click(VueSelector('k-organisation-dz k-block q-btn'))
      .wait(250)
    await test
      .typeText(Selector('.modal input[type=text]'), orgName)
      .click(Selector('.modal-buttons button').nth(0))
      .wait(2000)
  }
}
