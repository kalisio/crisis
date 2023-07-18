import _ from 'lodash'
import makeDebug from 'debug'
import commonHooks from 'feathers-hooks-common'

const { populate } = commonHooks
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

export async function sendEventPushNotifications (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendPushNotifications\' hook should only be used as a \'after\' hook.')
  }
  
  const userService = hook.app.getService('users')
  const pushService = hook.app.getService('push')
  if (!pushService) return hook
  // Define data for notification
  const notification = hook.params.notification
  const title = hook.result.name
  const body = (typeof notification === 'string'
    ? notification
    : (hook.result.description ? hook.result.description : ''))
  const dataNotification = {
    title,
    body,
    icon: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/aktnmap/aktnmap-icon-2048x2048.png',
    url: hook.result.urlRedirection
  }
  // Define participants
  const users = await userService.find({ paginate: false })
  const participants = hook.result.participants || []
  const participantsId = []
  _.forEach(participants, participant => {
    if (participant.service === 'members') participantsId.push(participant._id)
    if (participant.service === 'groups' || participant.service === 'tags') {
      _.forEach(users, user => {
        if (_.find(user[participant.service], participantService => _.toString(participantService._id) === _.toString(participant._id))) participantsId.push(user._id)
      })
    }
  })
  // Send notification
  pushService.create({
    dataNotification, 
    subscriptionService: 'api/users',
    subscriptionProperty: 'subscriptions',
    subscriptionFilter: _.isEmpty(participants) ? {} : { _id: { $in: participantsId }}
  })
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
