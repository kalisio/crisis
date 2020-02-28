import { hooks as notifyHooks } from '@kalisio/kdk-notify'
import { iff } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk-core'

module.exports = {
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
    create: [notifyHooks.verifyGuest, notifyHooks.consentGuest, iff(hook => process.env.API_GATEWAY, async hook => {
      const config = hook.app.get('authentication')
      if (!config) return hook
      // Default appId for Akt'n'Map used to access the gateway
      const appId = config.appId
      if (appId) await coreHooks.createJWT({
        name: 'gatewayToken',
        jwt: user => ({ subject: appId }),
        payload: user => ({ userId: (user ? user._id : undefined) })
      })(hook)
      return hook
    })],
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
