import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { verifyGuest, consentGuest } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [verifyGuest, consentGuest, async hook => {
      hook.result.planetTokens = hook.app.get('planetTokens')
      if (process.env.API_GATEWAY_JWT) {
        hook.result.gatewayToken = hook.app.get('gatewayToken')
      } else {
        const config = hook.app.get('authentication')
        if (!config) return hook
        // Default appId for Crisis used to access the gateway
        const appId = config.appId
        if (appId) {
          await coreHooks.createJWT({
            name: 'gatewayToken',
            jwt: user => ({
              subject: appId,
              // Audience is target subdomain
              audience: process.env.SUBDOMAIN
            }),
            payload: user => ({
              userId: (user ? user._id : undefined)
            })
          })(hook)
        }
      }
      // Token used to access Kalisio planet to view/manage map data, might requires admin permissions
      /*
      await coreHooks.createJWT({
        name: 'planetToken',
        jwt: user => ({
          subject: 'crisis',
          // Audience is subdomain
          audience: config.domain
        }),
        payload: user => ({
          catalog: { permissions: 'owner' }
        })
      })(hook)
      */
      return hook
    }],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
