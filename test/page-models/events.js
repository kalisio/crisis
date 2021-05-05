import { Selector } from 'testcafe'
import VueSelector from 'testcafe-vue-selectors'
import BaseCollection from './core/base-collection'
import Layout from './core//layout'
import _ from 'lodash'

export default class Events extends BaseCollection {
  constructor () {
    super('eventsGrid', 'QCard')
    this.layout = new Layout()
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
