import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BasePage from './core/base-page'
import _ from 'lodash'

export default class Events extends BasePage {
  constructor () {
    super()
    this.events = Selector('.q-page .q-card')
  }

  static get TOOL_BAR_ENTRY () {
    return '#events'
  }

  static get TAB_BAR_ENTRY () {
    return '#events'
  }

  async clickCardToolBar (test, name, action) {
    await test
      .click(this.events.withText(name).find(action))
  }

  async clickCardOverflowMenu (test, name, entry) {
    await test
      .click(this.events.withText(name).find('#card-overflow-menu'))
      .click(Selector('.q-menu').find(entry))
  }

  async checkCount (test, count) {
    const eventsCount = this.events.count
    await test.expect(eventsCount).eql(count, 'Invalid events count')
  }

  async create (test, data) {
    await test
      .typeText(VueSelector('k-text-field'), data.name, { replace: true })
      .typeText(VueSelector('k-item-field'), data.participants, { replace: true })
      .wait(2000)
      .click(Selector('.q-menu .q-item').nth(0))
      .click(Selector('.q-dialog .q-card').find('#apply-button'))
      .wait(2000)
  }

  async delete (test, name) {
    await this.clickCardOverflowMenu(test, name, '#remove-event')
    await test
      .click(Selector('.q-dialog .q-btn').nth(1))
      .wait(2000)
  }
}
