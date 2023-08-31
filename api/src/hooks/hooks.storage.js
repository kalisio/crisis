import _ from 'lodash'
import path from 'path'
import makeDebug from 'debug'
import { sendPushNotifications } from '../utils.js'

const debug = makeDebug('crisis:storage:hooks')

export async function sendMediaPushNotifications (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendMediaPushNotifications\' hook should only be used as a \'after\' hook.')
  }
  if (hook.params.notification) {
    // File key is eventID/filename
    const tokens = hook.result._id.split('/')
    if (tokens.length > 0) {
      // Retrieve target event
      const eventService = hook.app.getService('events', hook.service.getContextId())
      if (!eventService) throw new Error('No valid context found to retrieve event service for storage service')
      const event = await eventService.get(tokens[0])
      // Define data for notification
      const notification = _.defaults(hook.params.notification, {
        title: event.name,
        body: event.description || ''
      })
      await sendPushNotifications(hook.app, event.participants, notification)
    }
  }
  return hook
}
