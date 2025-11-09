import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import { getOrganisationAvatarUrl, sendPushNotifications } from '../utils/index.js'
const { populate } = commonHooks

export async function sendEventPushNotifications (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendEventPushNotifications\' hook should only be used as a \'after\' hook.')
  }
  // Define data for notification
  if (hook.params.notification) {
    // Get organisation avatar if any
    const icon = await getOrganisationAvatarUrl(hook, hook.result)
    const notification = _.defaults(hook.params.notification, {
      title: hook.result.name,
      body: hook.result.description || '',
      icon
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
