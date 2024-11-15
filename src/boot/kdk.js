import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { Notify, Dialog } from 'quasar'
import appHooks from '../app.hooks'
import services from '../services'
import {
  utils, initializeApi, i18n, utils as kdkCoreUtils, Store, Layout, Events,
  beforeGuard, authenticationGuard, permissionsGuard
} from '@kalisio/kdk/core.client'
import { Geolocation, setupApi } from '@kalisio/kdk/map.client.map'

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
  const api = initializeApi(setupApi)
  // Setup app hooks
  api.hooks(appHooks)
  // Then all services
  await services.call(api)

  // Initializes i18n
  await i18n.initialize(app, ['core', 'map', 'crisis'])

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
  app.config.globalProperties.$checkQuota = async function (service, quota) {
    const org = await api.getService('organisations')
      .get(this.contextId, { query: { $select: ['name', 'quotas'] } })
    const orgQuota = _.get(org, `quotas.${service}`, Store.get(`capabilities.api.quotas.${service}`, 0))
    // -1 means no limit
    if (orgQuota === -1) return
    if (quota > orgQuota) {
      Dialog.create({
        title: this.$t('OOPS'),
        message: this.$t('errors.UNSUBSCRIBED_OPTION'),
        persistent: true
      }).onOk(() => {
        this.$router.push({ name: 'home' })
      })
    }
  }

  // Register global components
  app.component('KAction', await kdkCoreUtils.loadComponent('action/KAction'))
  app.component('KPanel', await kdkCoreUtils.loadComponent('KPanel'))
  app.component('KStamp', await kdkCoreUtils.loadComponent('KStamp'))
  app.component('KScrollArea', await kdkCoreUtils.loadComponent('KScrollArea'))
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
  app.component('KLocationMap', await kdkCoreUtils.loadComponent('location/KLocationMap'))
  app.component('KLocationCardSection', await kdkCoreUtils.loadComponent('location/KLocationCardSection'))
  app.component('KLayersPanel', await kdkCoreUtils.loadComponent('catalog/KLayersPanel'))
  app.component('KPage', await kdkCoreUtils.loadComponent('layout/KPage'))
  app.component('KTour', await kdkCoreUtils.loadComponent('app/KTour'))
  app.component('KWelcome', await kdkCoreUtils.loadComponent('app/KWelcome'))
  app.component('KSignupAlert', await kdkCoreUtils.loadComponent('account/KSignupAlert'))

  // Register global properties
  // FIXME: This is used for testing purpose, don't know how to access this from Puppeteer otherwise
  global.$store = app.config.globalProperties.$store
  global.$layout = app.config.globalProperties.$layout
  global.$api = app.config.globalProperties.$api

  // Add global guards
  beforeGuard.registerGuard(authenticationGuard)
  beforeGuard.registerGuard(permissionsGuard)

  // updateThemeColors()
  
  api.on('authenticated', (data) => {
    // User will be updated in store just after login so that we need to wait for the event
    Events.once('user-changed', utils.subscribeToPushNotifications)
    // Store API gateway token if any
    if (data.gatewayToken) api.get('storage').setItem(config.gatewayJwt, data.gatewayToken)
  })
  api.on('logout', (data) => {
    // Remove API gateway token if any
    api.get('storage').removeItem(config.gatewayJwt)
  })

  // Install listener to log push notifications
  if (navigator.serviceWorker) {
    navigator.serviceWorker.onmessage = (event) => {
      const data = event.data
      if (data && data.type === 'push') {
        logger.info(`New notification received: ${_.get(data, 'notification.title')}`)
      }
    }
  }

  // For debug purpose
  logger.debug(`[KDK] is now ready: ${JSON.stringify(Store.get('kdk'), null, 4)}`)
}
