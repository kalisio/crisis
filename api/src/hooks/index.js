import { createObjectID } from '@kalisio/kdk/core.api.js'
import makeDebug from 'debug'
const debug = makeDebug('aktnmap:hooks')

export * from './hooks.quotas.js'
export * from './hooks.billing.js'
export * from './hooks.events.js'
export * from './hooks.event-logs.js'
export * from './hooks.event-templates.js'
export * from './hooks.devices.js'
export * from './hooks.archiving.js'
export * from './hooks.organisations.js'
export * from './hooks.plans.js'

export function addCreatorAsCoordinator (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'addCreatorAsCoordinator\' hook should only be used as a \'before\' hook.')
  }

  const user = hook.params.user
  const coordinators = hook.data.coordinators || []
  if (user && Array.isArray(coordinators)) {
    // Add creator as coordinator if not already done
    if (!coordinators.find(coordinator => coordinator._id.toString() === user._id.toString())) {
      coordinators.push({
        _id: createObjectID(user._id),
        service: 'members',
        name: user.name,
        profile: {
          name: user.name,
          description: user.email
        },
        icon: { name: 'person' }
      })
      hook.data.coordinators = coordinators
      debug('Added coordinator to object: ', user)
    }
  }
  return hook
}
