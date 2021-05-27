import { createObjectID } from '@kalisio/kdk/core.api'
import makeDebug from 'debug'
const debug = makeDebug('aktnmap:hooks')

// We faced a bug in babel so that transform-runtime with export * from 'x' generates import statements in transpiled code
// Tracked here : https://github.com/babel/babel/issues/2877
// We tested the workaround given here https://github.com/babel/babel/issues/2877#issuecomment-270700000 with success so far
export * from './hooks.quotas'
export * from './hooks.billing'
export * from './hooks.events'
export * from './hooks.event-logs'
export * from './hooks.devices'
export * from './hooks.archiving'

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
