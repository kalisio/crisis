import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { subscribeToAppTopic, unsubscribeFromAppTopic } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    // When an old device is removed update user device list so that we will only unsubscribe from it
    remove: [hook => {
      const device = hook.service.findDeviceByRegistrationId(hook.id, hook.params.user)
      // Keep track of previous devices
      hook.params.devices = hook.params.user.devices
      hook.params.user.devices = [device]
      return hook
    },
    // Unsubscribe the device to all possible topics
    coreHooks.updateSubjectSubscriptions({ field: 'organisations', service: 'organisations' }),
    coreHooks.updateSubjectSubscriptions({ field: 'groups', service: 'groups' }),
    coreHooks.updateSubjectSubscriptions({ field: 'tags', service: 'tags' }),
    unsubscribeFromAppTopic,
    hook => {
      // Restore previous devices
      hook.params.user.devices = hook.params.devices
      return hook
    }
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    // When a new device is coming update user device list so that we will only subscribe to it
    create: [coreHooks.sendNewDeviceEmail,
      hook => {
        // Keep track of previous devices
        hook.params.devices = hook.params.user.devices
        hook.params.user.devices = [hook.result]
        return hook
      },
      // Subscribe the device to all possible topics
      coreHooks.updateSubjectSubscriptions({ field: 'organisations', service: 'organisations' }),
      coreHooks.updateSubjectSubscriptions({ field: 'groups', service: 'groups' }),
      coreHooks.updateSubjectSubscriptions({ field: 'tags', service: 'tags' }),
      subscribeToAppTopic,
      hook => {
        // Restore previous devices
        hook.params.user.devices = hook.params.devices
        return hook
      }
    ],
    update: [
      // Resubscribe the device to all possible topics in case some have been lost
      coreHooks.updateSubjectSubscriptions({ field: 'organisations', service: 'organisations' }),
      coreHooks.updateSubjectSubscriptions({ field: 'groups', service: 'groups' }),
      coreHooks.updateSubjectSubscriptions({ field: 'tags', service: 'tags' }),
      subscribeToAppTopic
    ],
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
