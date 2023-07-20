import _ from 'lodash'
import makeDebug from 'debug'
import commonHooks from 'feathers-hooks-common'
import { sendPushNotifications } from '../utils.js'
const { populate } = commonHooks
const debug = makeDebug('aktnmap:events:hooks')

export async function sendEventPushNotifications (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendPushNotifications\' hook should only be used as a \'after\' hook.')
  }
  // Define data for notification
  if (hook.params.notification) {
    const notification = _.defaults(hook.params.notification, {
      title: hook.result.name,
      body: hook.result.description || ''
    })
    await sendPushNotifications(hook.app, hook.result.participants, notification)
  }
  return hook
}

export function marshallPlanQuery (hook) {
  const query = _.get(hook, 'params.query')
  if (!query) return
  if (_.has(query, 'planAsObject')) {
    _.set(hook, 'params.planAsObject', _.get(query, 'planAsObject'))
    delete query.planAsObject
  }
  return hook
}

export const populatePlan = populate({
  schema: hook => {
    const service = hook.service
    // Target archived or live service ?
    const plansService = (!service.name.startsWith('archived-')
      ? hook.app.getService('plans', service.context)
      : hook.app.getService('archived-plans', service.context))
    return {
      include: [
        {
          service: plansService.getPath(true),
          nameAs: 'plan',
          parentField: 'plan',
          childField: '_id'
        }
      ]
    }
  }
})
