import _ from 'lodash'

// Send a notification to participants that can be users, groups or tags
export async function sendPushNotifications (app, participants, notification) {
  const pushService = app.getService('push')
  if (!pushService) return hook

  // Define data for notification
  _.defaults(notification, {
    icon: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/aktnmap/aktnmap-icon-512x512.png'
  })
  const data = {
    notification, 
    subscriptionService: 'api/users',
    subscriptionProperty: 'subscriptions',
  }

  // Define participants
  const [usersId, groupsId, tagsId] = Array(3).fill([])
  _.forEach(participants, participant => {
    if (participant.service === 'members') usersId.push(participant._id)
    if (participant.service === 'groups') groupsId.push(participant._id)
    if (participant.service === 'tags') tagsId.push(participant._id)
  })


  // Send notification
  if (_.size(usersId) > 0) pushService.create({ ...data, subscriptionFilter: { _id: { $in: usersId }}})
  if (_.size(groupsId) > 0) pushService.create({ ...data, subscriptionFilter: { groups: { $elemMatch: { _id: { $in: groupsId }}}}})
  if (_.size(tagsId) > 0) pushService.create({ ...data, subscriptionFilter: { tags: { $elemMatch: { _id: { $in: tagsId }}}}})
}
