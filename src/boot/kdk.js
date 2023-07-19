import _ from 'lodash'
import config from 'config'
import { Notify, Dialog } from 'quasar'
import appHooks from '../app.hooks'
import services from '../services'
import { utils, initializeApi, i18n, utils as kdkCoreUtils, Store, Layout, Events, beforeGuard, authenticationGuard } from '@kalisio/kdk/core.client'
import { Geolocation } from '@kalisio/kdk/map.client.map'

/* function updateThemeColors () {
  const theme = config.theme
  // Default theme override
  if (theme) Theme.apply(theme)
} */

export default async ({ app }) => {
  // Required to make injections reactively linked to the provider
  // https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity
  app.config.unwrapInjectedRef = true

  // Initiate the client
  const api = initializeApi()
  // Setup app hooks
  api.hooks(appHooks)
  // Then all services
  services.call(api)

  // Initializes i18n
  await i18n.initialize(app, ['core', 'map', 'aktnmap'])

  // Register global properties to the the vue app
  app.config.globalProperties.$store = Store
  app.config.globalProperties.$layout = Layout
  app.config.globalProperties.$events = Events
  app.config.globalProperties.$api = api
  app.config.globalProperties.$can = api.can
  app.config.globalProperties.$notify = Notify.create
  app.config.globalProperties.$tie = i18n.tie.bind(i18n)
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
  app.component('KAction', await kdkCoreUtils.loadComponent('KAction'))
  app.component('KPanel', await kdkCoreUtils.loadComponent('KPanel'))
  app.component('KStamp', await kdkCoreUtils.loadComponent('KStamp'))
  app.component('KTextArea', await kdkCoreUtils.loadComponent('KTextArea'))
  app.component('KChipsPane', await kdkCoreUtils.loadComponent('KChipsPane'))
  app.component('KAvatar', await kdkCoreUtils.loadComponent('KAvatar'))
  app.component('KModal', await kdkCoreUtils.loadComponent('KModal'))
  app.component('KDialog', await kdkCoreUtils.loadComponent('KDialog'))
  app.component('KMenu', await kdkCoreUtils.loadComponent('menu/KMenu'))
  app.component('KForm', await kdkCoreUtils.loadComponent('form/KForm'))
  app.component('KList', await kdkCoreUtils.loadComponent('collection/KList'))
  app.component('KGrid', await kdkCoreUtils.loadComponent('collection/KGrid'))
  app.component('KBoard', await kdkCoreUtils.loadComponent('collection/KBoard'))
  app.component('KHistory', await kdkCoreUtils.loadComponent('collection/KHistory'))
  app.component('KItem', await kdkCoreUtils.loadComponent('collection/KItem'))
  app.component('KCard', await kdkCoreUtils.loadComponent('collection/KCard'))
  app.component('KCardSection', await kdkCoreUtils.loadComponent('collection/KCardSection'))
  app.component('KMediaBrowser', await kdkCoreUtils.loadComponent('media/KMediaBrowser'))
  app.component('KShape', await kdkCoreUtils.loadComponent('media/KShape'))
  app.component('KStatisticsChart', await kdkCoreUtils.loadComponent('chart/KStatisticsChart'))
  app.component('KLocationMap', await kdkCoreUtils.loadComponent('KLocationMap'))
  app.component('KLayersPanel', await kdkCoreUtils.loadComponent('catalog/KLayersPanel'))
  app.component('KColorLegend', await kdkCoreUtils.loadComponent('KColorLegend'))
  app.component('KPage', await kdkCoreUtils.loadComponent('layout/KPage'))
  app.component('KTour', await kdkCoreUtils.loadComponent('app/KTour'))
  app.component('KWelcome', await kdkCoreUtils.loadComponent('app/KWelcome'))
  app.component('KSignupAlert', await kdkCoreUtils.loadComponent('account/KSignupAlert'))

  // Register global properties
  // FIXME: This is used for testing purpose, don't know how to access this from Puppeteer otherwise
  global.$store = app.config.globalProperties.$store
  global.$layout = app.config.globalProperties.$layout
  global.$api = app.config.globalProperties.$api

  // Add global guard
  beforeGuard.registerGuard(authenticationGuard)

  // updateThemeColors()

  api.on('authenticated', (data) => {
    // Subscribe to webpush notifications
    utils.subscribeToPushNotifications()
    // Store API gateway token if any
    if (data.gatewayToken) api.get('storage').setItem(config.gatewayJwt, data.gatewayToken)
  })
  api.on('logout', (data) => {
    // Remove API gateway token if any
    api.get('storage').removeItem(config.gatewayJwt)
  })
}
