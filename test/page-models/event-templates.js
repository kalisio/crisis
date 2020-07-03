import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './core/base-page'

export default class EventTemplates extends BasePage {
  constructor () {
    super()
    this.eventTemplates = Selector('.q-page .q-card')
  }
  
  static get OVERFLOW_MENU_ENTRY () {
    return '#event-templates'
  }

  static get TAB_BAR_ENTRY () {
    return '#event-templates'
  }

  async clickCardToolBar (test, name, action) {
    await test
      .click(this.eventTemplates.withText(name).find(action))
  }

  async clickCardOverflowMenu (test, name, entry) {
    await test
      .click(this.eventTemplates.withText(name).find('#card-overflow-menu'))
      .click(Selector('.q-menu').find(entry))
  }

  async checkCount (test, count) {
    const eventTemplatesCount = this.eventTemplates.count
    await test.expect(eventTemplatesCount).eql(count, 'Invalid events count')
  }

  async create (test, data) {
    await test
      .typeText(VueSelector('k-text-field'), data.name, { replace: true })
      .typeText(VueSelector('k-textarea-field'), data.description, { replace: true })
      .click(Selector('.q-dialog .q-card').find('#apply-button'))
      .wait(2000)
  }
  
  async edit (test, name, data) {
    await this.clickCardToolBar(test, name, '#edit-event-template')
    await test
      .typeText(VueSelector('k-text-field'), data.name, { replace: true })
      .typeText(VueSelector('k-textarea-field'), data.description, { replace: true })
      .click(Selector('.q-dialog .q-card').find('#apply-button'))
      .wait(2000)
  }
  
  async copy (test, name, data) {
    await this.clickCardToolBar(test, name, '#copy-event-template')
    await test
      .typeText(VueSelector('k-text-field'), data.name, { replace: true })
      .click(Selector('.q-dialog .q-card').find('#apply-button'))
      .wait(2000)
  }
  
  async delete (test, name) {
    await this.clickCardOverflowMenu(test, name, '#remove-event-template')
    await test
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(2000)
  }
}
