import _ from 'lodash'
import config from 'config'
import appHooks from '../app.hooks'
import services from '../services'
import { api, utils as kdkCoreUtils, Store, Layout, Events, Theme, beforeGuard, authenticationGuard } from '@kalisio/kdk/core.client'
import { Geolocation } from '@kalisio/kdk/map.client.map'

/*function updateThemeColors () {
  const theme = config.theme
  // Default theme override
  if (theme) Theme.apply(theme)
}*/

export default async ({ app }) => {
  // Required to make injections reactively linked to the provider
  // https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity
  app.config.unwrapInjectedRef = true

  // Setup app hooks
  api.hooks(appHooks)
  // Then all services
  services.call(api)

  // Register global properties to the the vue app
  app.config.globalProperties.$store = Store
  app.config.globalProperties.$layout = Layout
  app.config.globalProperties.$events = Events
  app.config.globalProperties.$api = api
  app.config.globalProperties.$can = api.can
  app.config.globalProperties.$toast = kdkCoreUtils.toast
  app.config.globalProperties.$tie = function (key, param) {
    if (_.isEmpty(key)) return key
    return this.$te(key) ? this.$t(key, param) : key
  }
  app.config.globalProperties.$config = function (path, defaultValue) {
    return _.get(config, path, defaultValue)
  }
  app.config.globalProperties.$geolocation = Geolocation
  app.config.globalProperties.$checkBillingOption = async function (option) {
    if (this.$config('flavor') === 'dev') return
    const perspective = await api.getService('organisations')
      .get(this.contextId, { query: { $select: ['name', 'billing'] } })
    const options = _.get(perspective, 'billing.options', [])
    if (!_.find(options, { plan: option })) {
      Dialog.create({
        title: this.$t('OOPS'),
        message: this.$t('errors.UNSUBSCRIBED_OPTION'),
        persistent: true
      }).onOk(() => {
        this.$router.push({
          name: 'edit-organisation-billing',
          params: { objectId: this.contextId, title: perspective.name }
        })
      })
    }
  }

  // Register global components
  app.component('KAction', await kdkCoreUtils.loadComponent('frame/KAction'))
  app.component('KPopupAction', await kdkCoreUtils.loadComponent('frame/KPopupAction'))
  app.component('KMenu', await kdkCoreUtils.loadComponent('menu/KMenu'))
  app.component('KStamp', await kdkCoreUtils.loadComponent('frame/KStamp'))
  app.component('KPanel', await kdkCoreUtils.loadComponent('frame/KPanel'))
  app.component('KSpot', await kdkCoreUtils.loadComponent('frame/KSpot'))
  app.component('KModal', await kdkCoreUtils.loadComponent('frame/KModal'))
  app.component('KForm', await kdkCoreUtils.loadComponent('form/KForm'))
  app.component('KGrid', await kdkCoreUtils.loadComponent('collection/KGrid'))
  app.component('KCard', await kdkCoreUtils.loadComponent('collection/KCard'))
  app.component('KCardSection', await kdkCoreUtils.loadComponent('collection/KCardSection'))
  app.component('KLocationMap', await kdkCoreUtils.loadComponent('KLocationMap'))
  app.component('KList', await kdkCoreUtils.loadComponent('collection/KList'))
  app.component('KItem', await kdkCoreUtils.loadComponent('collection/KItem'))  
  app.component('KPage', await kdkCoreUtils.loadComponent('layout/KPage'))

  // Register global properties
  // FIXME: This is used for testing purpose, don't know how to access this from Puppeteer otherwise
  global.$store = app.config.globalProperties.$store
  global.$layout = app.config.globalProperties.$layout
  global.$api = app.config.globalProperties.$api

  // Add global guard
  beforeGuard.registerGuard(authenticationGuard)

  //updateThemeColors()

  api.on('authenticated', (data) => {
    // Store API gateway token if any
    if (data.gatewayToken) api.get('storage').setItem(config.gatewayJwt, data.gatewayToken)
  })
  api.on('logout', (data) => {
    // Remove API gateway token if any
    api.get('storage').removeItem(config.gatewayJwt)
  })
}
