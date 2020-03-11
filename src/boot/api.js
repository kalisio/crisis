import 'whatwg-fetch'
import config from 'config'
import appHooks from '../app.hooks'
import services from '../services'
import plugin from '../vue-kdk'
import { kalisio, beforeGuard, authenticationGuard } from '@kalisio/kdk-core/client'

export default async ({ app, router, Vue }) => {
  let api = kalisio()

  // Setup app hooks
  api.hooks(appHooks)
  // Then all services
  services.call(api)

  Vue.use(plugin, { api })

  // Add global guard
  beforeGuard.registerGuard(authenticationGuard)

  api.on('authenticated', (data) => {
    // Store API gateway token if any
    if (data.gatewayToken) api.get('storage').setItem(config.gatewayJwt, data.gatewayToken)
  })
  api.on('logout', (data) => {
    // Remove API gateway token if any
    api.get('storage').removeItem(config.gatewayJwt)
  })
}
