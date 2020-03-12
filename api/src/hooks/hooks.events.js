import _ from 'lodash'
import { createObjectID } from '@kalisio/kdk/core.api'
import makeDebug from 'debug'
const debug = makeDebug('aktnmap:events:hooks')

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
        name: user.name,
        icon: { name: 'person' }
      })
      hook.data.coordinators = coordinators
      debug('Added coordinator to event: ', user)
    }
  }
  return hook
}

export async function sendEventNotifications (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendNotifications\' hook should only be used as a \'after\' hook.')
  }

  const pusherService = hook.app.getService('pusher')
  if (!pusherService) return hook
  const notification = hook.params.notification
  if (notification) {
    const participants = hook.result.participants || []
    const publishPromises = []
    participants.forEach(participant => {
      let participantService = participant.service
      if (hook.service.context) {
        participantService = hook.service.getContextId() + '/' + participantService
      }
      publishPromises.push(pusherService.create({
        action: 'message',
        // The notification contains the event title + a given prefix
        message: {
          title: hook.result.name,
          body: notification,
          createdAt: hook.result.createdAt,
          updatedAt: hook.result.updatedAt,
          // Custom vibration pattern
          vibration: [500, 1000, 500, 500, 500, 500],
          sound: 'default'
        },
        pushObject: participant._id.toString(),
        pushObjectService: participantService
      }))
    })
    // We'd like to be tolerant here because the participants might have be removed from the system while the event is still alive
    // let results = await Promise.all(publishPromises)
    const results = []
    for (let i = 0; i < publishPromises.length; i++) {
      try {
        const result = await publishPromises[i]
        results.push(result)
      } catch (error) {
        hook.app.logger.error(error.message, error)
      }
    }
    debug('Published event notifications on ' + results.length + ' topics/users for event ' + hook.result._id.toString())
  }
  return hook
}
