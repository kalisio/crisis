import makeDebug from 'debug'
import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import { getOrganisationAvatarUrl, sendPushNotifications } from '../utils.js'

const { getItems } = commonHooks
const debug = makeDebug('crisis:event-logs:hooks')

export async function addLogDefaults (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'addLogDefaults\' hook should only be used as a \'before\' hook.')
  }

  let participant = hook.data.participant
  let stakeholder = hook.data.stakeholder
  const event = hook.data.event
  const user = hook.params.user
  // By default we assume the user is the participant
  if (user) {
    if (!participant) hook.data.participant = participant = user._id
    if (!stakeholder) hook.data.stakeholder = stakeholder = 'participant'
  }
  hook.data.lastInEvent = true
  if (participant && event) {
    debug('Added default log properties for participant ' + hook.data.participant.toString() + ' on event ' + event.toString())
  }

  return hook
}

export async function linkWithPreviousLog (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'linkWithPreviousLog\' hook should only be used as a \'before\' hook.')
  }

  const item = getItems(hook)
  const participant = item.participant
  const event = item.event
  if (event && participant) {
    if (!item.previous) {
      const previousLogs = await hook.service.find({
        query: {
          $sort: { createdAt: -1 }, // Sorting by newest ones
          $limit: 1,
          participant,
          event,
          lastInEvent: true
        },
        paginate: false
      })
      if (previousLogs.length > 0) {
        const previousLog = previousLogs[0]
        debug('Tagging previous log for participant ' + participant.toString() + ' on event ' + event.toString())
        item.previous = previousLog._id
        // Copy expiry date
        item.expireAt = previousLog.expireAt
      }
    }
    // When the first log is created we need to extract it from the source event
    if (!item.expireAt) {
      // Event service is contextual, look for context on initiator service
      const eventService = hook.app.getService('events', hook.service.context)
      if (!eventService) return Promise.reject(new Error('No valid context found to retrieve event service for initiator service ' + hook.service.name))
      const eventObject = await eventService.get(event.toString())
      // Copy expiry date
      debug('Tagging expiry date on log for participant ' + participant.toString() + ' on event ' + event.toString())
      item.expireAt = eventObject.expireAt
    }
  }

  return hook
}

export async function updatePreviousLog (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'updatePreviousLog\' hook should only be used as a \'after\' hook.')
  }

  const item = getItems(hook)

  if (item.previous) {
    await hook.service.patch(item.previous.toString(), { lastInEvent: false })
  }

  return hook
}

export async function sendEventLogPushNotifications (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'sendEventLogPushNotifications\' hook should only be used as a \'after\' hook.')
  }

  // A notification occur only when we record the interaction of a given workflow step
  // from the coordinator toward the participant
  const interaction = _.get(hook, 'result.properties.interaction')
  const stakeholder = _.get(hook, 'result.stakeholder')
  if (interaction && (stakeholder === 'coordinator')) {
    const participant = hook.result.participant
    let event = hook.result.event
    if (participant && event) {
      // We need the event first to get its title as we only have the id
      const eventsService = hook.app.getService('events', hook.service.context)
      event = await eventsService.get(event.toString())// Get organisation avatar if any
      // Get organisation avatar if any
      const icon = await getOrganisationAvatarUrl(hook, event)
      // We'd like to be tolerant here because the participants might have be removed from the system while the event is still alive
      try {
        const notification = {
          title: event.name,
          body: interaction.value,
          icon
        }
        await sendPushNotifications(hook.app, [participant.toString()], notification)
      } catch (error) {
        hook.app.logger.error(error.message, error)
      }
    }
  }
  return hook
}

export async function countParticipants (hook) {
  const query = hook.params.query
  const service = hook.service
  if (!query) return hook
  // Perform aggregation
  if (query.$aggregate) {
    // Check if we'd like to aggregate according to a property of events
    // Indeed in that case we have to read it from events by a lookup
    const eventProperty = (typeof query.$aggregate === 'string' ? query.$aggregate : null)
    const collection = service.Model
    // The query contains the match stage except options relevent to the aggregation pipeline
    const match = _.omit(query, ['$aggregate', '$geoNear', '$sort'])

    const pipeline = []
    // Check for geometry stage
    if (query.$geoNear) {
      pipeline.push({ $geoNear: query.$geoNear })
    }
    // Find matching logs only
    pipeline.push({ $match: match })
    // Ensure they are ordered by increasing time by default
    pipeline.push({ $sort: query.$sort || { createdAt: 1 } })
    // If we aggregate according to a property stored in events
    if (eventProperty) {
      // Add a lookup to retrieve this property
      pipeline.push({
        $lookup:
        { from: 'archived-events', localField: 'event', foreignField: '_id', as: 'eventLookup' }
      })
      // Then set it on result
      pipeline.push({
        $project:
        { [`${eventProperty}`]: { $arrayElemAt: [`$eventLookup.${eventProperty}`, 0] }, participant: 1, event: 1 }
      })
      // Then group by accordingly
      pipeline.push({ $group: { _id: `$${eventProperty}`, count: { $sum: 1 } } })
    } else {
      // Otherwise simply group by event
      pipeline.push({ $group: { _id: '$event', count: { $sum: 1 } } })
    }
    // Add a filter to discard any null element
    pipeline.push({ $match: { _id: { $ne: null } } })
    debug('Aggregating participants in logs')
    pipeline.forEach(stage => {
      _.forOwn(stage, (value, key) => debug('Stage', key, value))
    })
    const results = await collection.aggregate(pipeline).toArray()
    debug(`Aggregated ${results.length} events in logs`)
    // Set result to avoid service DB call
    hook.result = results
  }
  return hook
}
