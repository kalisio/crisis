import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './core/base-page'

export default class Billing extends BasePage {
  constructor () {
    super()
    // Billing
    this.customerBlock = Selector('#customer-block')
    this.customerEditor = VueSelector('organisation-billing k-customer-editor')
    this.cardFieldNumber = Selector('organisation-billing k-customer-editor .Cardfield-number')
    this.cardFieldExpiry = VueSelector('organisation-billing k-customer-editor .Cardfield-expiry')
    this.cardFieldCVC = VueSelector('organisation-billing k-customer-editor .Cardfield-cvc')
  }

  static get ENTRY () {
    return 'organisation-billing'
  }

  async checkCustomerBlockDisabled (test) {
    await test.expect(this.customerBlock.find('button').hasAttribute('disabled')).ok()
  }

  async checkCustomerBlockEnabled (test) {
    await test.expect(this.customerBlock.find('button').hasAttribute('disabled')).notOk()
  }

  async updateCustomer (test, customer) {
    await test
      .click(this.customerBlock.find('button'))
      .wait(250)
      .click(Selector('.q-dialog').find('#email-field'))
      .click(Selector('.q-menu .q-item').nth(customer.index))
      .typeText(Selector('.q-dialog').find('#description-field'), customer.description, { replace: true })
      .typeText(Selector('.q-dialog').find('#vatNumber-field'), customer.vatNumber, { replace: true })
    if (customer.card) {
      await test
        .switchToIframe(Selector('.q-dialog iframe'))
        .typeText(Selector('.CardField-number input'), customer.card.number, { replace: true })
        .typeText(Selector('.CardField-expiry input'), customer.card.expiry, { replace: true })
        .typeText(Selector('.CardField-cvc input'), customer.card.cvc, { replace: true })
        .typeText(Selector('.CardField-postalCode input'), customer.card.postalCode, { replace: true })
        .switchToMainWindow()
        .wait(2000)
    }
    await test
      .click(Selector('.q-dialog').find('#update-button'))
      .wait(2000)
  }

  async clearCustomerCard (test) {
    await test
      .click(this.customerBlock.find('button'))
      .wait(250)
      .click(Selector('.q-dialog .q-card button[type=button]').nth(1))
      .click(Selector('.q-dialog').find('#update-button'))
      .wait(2000)
  }

  async checkCustomerCard (test, mustHaveCard) {
    await test
      .click(this.customerBlock.find('button'))
      .wait(250)
    const cardSelector = Selector('.q-dialog').withText('XXXX-')
    if (mustHaveCard) await test.expect(cardSelector.visible).ok()
    else await test.expect(cardSelector.exists).notOk()
  }

  async checkPlanDisabled (test, name) {
    await test.expect(Selector('#' + name + '-card').find('button').hasAttribute('disabled')).ok()
  }

  async checkPlanEnabled (test, name) {
    await test.expect(Selector('#' + name + '-card').find('button').hasAttribute('disabled')).notOk()
  }

  async selectPlan (test, name) {
    await test
      .click(Selector('#' + name + '-card').find('button'))
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(5000)
  }
}
