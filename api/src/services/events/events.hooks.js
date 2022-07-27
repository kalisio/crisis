import _ from 'lodash'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { hooks as mapHooks } from '@kalisio/kdk/map.api.js'
import commonHooks from 'feathers-hooks-common'
import {
  addCreatorAsCoordinator, processNotification, sendEventNotifications,
  marshallPlanQuery, populatePlan, checkEventsQuotas, archive
} from '../../hooks/index.js'

const hooks = {
  before: {
    all: [
      coreHooks.convertObjectIDs(['layer', 'feature', 'alert._id', 'plan']),
      coreHooks.convertToString(['alert.conditions'])
    ],
    find: [mapHooks.marshallSpatialQuery, marshallPlanQuery],
    get: [],
    // Because expireAt comes from client convert it to Date object
    create: [
      checkEventsQuotas,
      processNotification,
      addCreatorAsCoordinator,
      // Events attached to a plan should remain active until the plan is closed
      commonHooks.iff(hook => _.get(hook, 'data.plan'), commonHooks.discard('expireAt')),
      commonHooks.setNow('createdAt', 'updatedAt'), coreHooks.convertDates(['expireAt'])
    ],
    update: [
      processNotification,
      commonHooks.discard('createdAt', 'updatedAt'),
      // Events attached to a plan should remain active until the plan is closed
      commonHooks.iff(hook => _.get(hook, 'data.plan'), commonHooks.discard('expireAt')),
      commonHooks.setNow('updatedAt'), coreHooks.convertDates(['expireAt'])
    ],
    patch: [
      processNotification,
      commonHooks.discard('createdAt', 'updatedAt'),
      // Events attached to a plan should remain active until the plan is closed
      commonHooks.iff(hook => _.get(hook, 'data.plan'), commonHooks.discard('expireAt')),
      commonHooks.setNow('updatedAt'), coreHooks.convertDates(['expireAt'])
    ],
    remove: [
      processNotification
    ]
  },

  after: {
    all: [coreHooks.convertToJson(['alert.conditions'])],
    find: [
      // Not by default for performance reason
      commonHooks.iff(hook => _.get(hook, 'params.planAsObject'), populatePlan),
      mapHooks.asGeoJson({
        longitudeProperty: 'location.longitude',
        latitudeProperty: 'location.latitude',
        geometryProperty: 'location',
        asFeatureCollection: false
      })
    ],
    get: [],
    create: [sendEventNotifications],
    update: [sendEventNotifications],
    patch: [sendEventNotifications],
    // Because the notification ID is based on created/updated time we need to update it even on remove
    remove: [commonHooks.setNow('updatedAt'),
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
  hooks.after.all.push(archive)
}

export default hooks
