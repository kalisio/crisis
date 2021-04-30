import _ from 'lodash'
import { Dialog } from 'quasar'
import config from 'config'
import { utils as kCoreUtils } from '@kalisio/kdk/core.client'
import utils from './utils'
import { Store, Layout, Events } from '@kalisio/kdk/core.client'
import { Geolocation } from '@kalisio/kdk/map.client.map'

export default {
  install (Vue, options) {
    // Inject in Vue the Kalisio features
    Vue.prototype.$store = Store
    Vue.prototype.$layout = Layout    
    Vue.prototype.$events = Events
    Vue.prototype.$api = options.api
    Vue.prototype.$can = options.api.can
    Vue.prototype.$toast = kCoreUtils.toast
    Vue.prototype.$load = utils.load
    Vue.prototype.$createComponent = utils.createComponent
    Vue.prototype.$createComponentVNode = utils.createComponentVNode
    Vue.prototype.$config = function (path, defaultValue) {
      return _.get(config, path, defaultValue)
    }
    Vue.prototype.$geolocation = Geolocation
    Vue.prototype.$checkBillingOption = async function (option) {
      if (this.$config('flavor') === 'dev') return
      const perspective = await this.$api.getService('organisations')
        .get(this.contextId, { query: { $select: ['billing'] } })
      const options = _.get(perspective, 'billing.options', [])
      if (!_.find(options, { plan: option })) {
        Dialog.create({
          title: this.$t('OOPS'),
          message: this.$t('errors.UNSUBSCRIBED_OPTION'),
          persistent: true
        }).onOk(() => {
          this.$router.push({ name: 'organisation-settings-activity',
            params: { page: 'billing', contextId: this.contextId } })
        })
      }
    }
    // FIXME: This is used for testing purpose, don't know how to access this from testcafe otherwise
    global.$layout = Vue.prototype.$layout
    global.$store = Vue.prototype.$store
    global.$api = Vue.prototype.$api
  }
}
