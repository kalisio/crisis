import _ from 'lodash'

// Send a notification to participants that can be users, groups or tags
export async function sendPushNotifications (app, participants, notification) {
  const pushService = app.getService('push')
  if (!pushService) return hook

  // Define data for notification
  _.defaults(notification, {
    icon: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/crisis/crisis-icon-color-512x512.png'
  })
  const data = {
    notification, 
    subscriptionService: `${app.get('apiPath')}/users`,
    subscriptionProperty: 'subscriptions',
  }

  // Define participants
  const [userIds, groupIds, tagIds, organisationIds] = Array(4).fill([])
  _.forEach(participants, participant => {
    // Check for ObjectID
    if (typeof participant === 'string') userIds.push(participant)
    if (participant.service === 'members') userIds.push(participant._id)
    if (participant.service === 'groups') groupIds.push(participant._id)
    if (participant.service === 'tags') tagIds.push(participant._id)
    if (participant.service === 'organisations') tagIds.push(participant._id)
  })
  
  // Send notification
  if (_.size(userIds) > 0) pushService.create({ ...data, subscriptionFilter: { _id: { $in: userIds }}})
  if (_.size(groupIds) > 0) pushService.create({ ...data, subscriptionFilter: { groups: { $elemMatch: { _id: { $in: groupIds }}}}})
  if (_.size(tagIds) > 0) pushService.create({ ...data, subscriptionFilter: { tags: { $elemMatch: { _id: { $in: tagIds }}}}})
  if (_.size(organisationIds) > 0) pushService.create({ ...data, subscriptionFilter: { organisations: { $elemMatch: { _id: { $in: organisationIds }}}}})
}
