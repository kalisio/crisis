import _ from 'lodash'
import { createObjectID } from '@kalisio/kdk/core.api.js'
import makeDebug from 'debug'
const debug = makeDebug('crisis:hooks')

export * from './hooks.authentication.js'
export * from './hooks.authorisations.js'
export * from './hooks.quotas.js'
export * from './hooks.events.js'
export * from './hooks.event-logs.js'
export * from './hooks.event-templates.js'
export * from './hooks.archiving.js'
export * from './hooks.organisations.js'
export * from './hooks.groups.js'
export * from './hooks.plans.js'
export * from './hooks.storage.js'
export * from './hooks.users.js'

export function processNotification (hook) {
  // We use a query parameter to transport the notification body when creating, updating, removing an event
  // Indeed it needs to be translated so it is sent by the client depending on its locale
  const notification = _.get(hook.params, 'query.notification')
  if (notification) {
    hook.params.notification = notification
    // Delete from query otherwise it will be used to filter items
    _.unset(hook.params, 'query.notification')
  }
  return hook
}

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
        profile: {
          name: _.get(user, 'profile.name'),
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
