import { hooks as coreHooks } from '@kalisio/kdk/core.api'
import _ from 'lodash'
import { hooks as mapHooks } from '@kalisio/kdk/map.api'
import { setNow, discard, iff } from 'feathers-hooks-common'
import { addCreatorAsCoordinator, processNotification, sendEventNotifications, checkEventsQuotas, archive } from '../../hooks'

module.exports = {
  before: {
    all: [
      coreHooks.convertObjectIDs(['layer', 'feature', 'alert._id', 'plan']),
      coreHooks.convertToString(['alert.conditions'])
    ],
    find: [mapHooks.marshallSpatialQuery],
    get: [],
    // Because expireAt comes from client convert it to Date object
    create: [
      checkEventsQuotas,
      processNotification,
      addCreatorAsCoordinator,
      // Events attached to a plan should remain active until the plan is closed
      iff(hook => _.get(hook, 'data.plan'), discard('expireAt')),
      setNow('createdAt', 'updatedAt'), coreHooks.convertDates(['expireAt'])
    ],
    update: [
      processNotification,
      discard('createdAt', 'updatedAt'),
      // Events attached to a plan should remain active until the plan is closed
      iff(hook => _.get(hook, 'data.plan'), discard('expireAt')),
      setNow('updatedAt'), coreHooks.convertDates(['expireAt'])
    ],
    patch: [
      processNotification,
      discard('createdAt', 'updatedAt'),
      // Events attached to a plan should remain active until the plan is closed
      iff(hook => _.get(hook, 'data.plan'), discard('expireAt')),
      setNow('updatedAt'), coreHooks.convertDates(['expireAt'])
    ],
    remove: [
      processNotification
    ]
  },

  after: {
    all: [coreHooks.convertToJson(['alert.conditions'])],
    find: [mapHooks.asGeoJson({
      longitudeProperty: 'location.longitude',
      latitudeProperty: 'location.latitude',
      asFeatureCollection: false
    })],
    get: [],
    create: [sendEventNotifications],
    update: [sendEventNotifications],
    patch: [sendEventNotifications],
    // Because the notification ID is based on created/updated time we need to update it even on remove
    remove: [setNow('updatedAt'),
      sendEventNotifications/*, Because we can archive events we don't actually remove attachments so that it remain reachable
      coreHooks.removeAttachments('attachments') */
    ]
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}

// Add archiving feature
// This is only in dev/preprod mode, in prod this feature is managed by MongoDB Stitch
if (process.env.NODE_APP_INSTANCE !== 'prod') {
  module.exports.after.all.push(archive)
}
