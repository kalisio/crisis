import _ from 'lodash'

// Send a notification to participants that can be users, groups or tags
export async function sendPushNotifications (app, participants, notification) {
  const userService = app.getService('users')
  const pushService = app.getService('push')
  if (!pushService) return
  // Define data for notification
  _.defaults(notification, {
    // FIXME: add vibration
    icon: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/aktnmap/aktnmap-icon-512x512.png'
  })
  // Define participants
  const users = await userService.find({ paginate: false })
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
    notification, 
    subscriptionService: 'api/users',
    subscriptionProperty: 'subscriptions',
    subscriptionFilter: _.isEmpty(participants) ? {} : { _id: { $in: participantsId }}
  })
}
