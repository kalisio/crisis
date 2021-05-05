import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './core/base-collection'
import Layout from './core//layout'

export default class EventTemplates extends BaseCollection {
  constructor () {
    super('eventTemplatesGrid', 'QCard')
    this.layout = new Layout()
  }
  
  static get ADD_EVENT_TEMPLATE_ENTRY () {
    return 'create-event-template'
  }

  async create (test, data) {
    await this.layout.clickFab(test, EventTemplates.ADD_EVENT_TEMPLATE_ENTRY)
    await test
      .typeText(VueSelector('k-text-field'), data.name, { replace: true })
      .typeText(VueSelector('k-textarea-field'), data.description, { replace: true })
      .click(Selector('.q-dialog #apply-button'))
      .wait(2000)
  }
  
  async edit (test, name, data) {
    await this.clickAction(test, name, 'edit-event-template')
    await test
      .typeText(VueSelector('k-text-field'), data.name, { replace: true })
      .typeText(VueSelector('k-textarea-field'), data.description, { replace: true })
      .click(Selector('.q-dialog #apply-button'))
      .wait(2000)
  }
  
  async copy (test, name, data) {
    await this.clickAction(test, name, 'copy-event-template')
    await test
      .typeText(VueSelector('k-text-field'), data.name, { replace: true })
      .click(Selector('.q-dialog #apply-button'))
      .wait(2000)
  }
  
  async delete (test, name) {
    await this.clickAction(test, name, 'remove-event-template')
    await test
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(2000)
  }
}
