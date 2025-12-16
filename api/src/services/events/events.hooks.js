import _ from 'lodash'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { hooks as mapHooks } from '@kalisio/kdk/map.api.js'
import commonHooks from 'feathers-hooks-common'
import {
  addCreatorAsCoordinator, processNotification, sendEventPushNotifications,
  marshallPlanQuery, populatePlan, checkEventsQuotas, archive
} from '../../hooks/index.js'

const hooks = {
  before: {
    all: [
      coreHooks.convertObjectIDs(['layer', 'feature', 'alert._id', 'plan']),
      coreHooks.convertToString(['alert.conditions']),
      marshallPlanQuery
    ],
    find: [fuzzySearch({ fields: ['name'] }), coreHooks.diacriticSearch(), mapHooks.marshallSpatialQuery],
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
    all: [
      // Archive first to avoid polutting object with client-side information that could be added afterwards
      archive,
      coreHooks.convertToJson(['alert.conditions']),
      // Not by default for performance reason
      commonHooks.iff(hook => _.get(hook, 'params.planAsObject'), populatePlan),
    ],
    find: [
      mapHooks.asGeoJson({
        longitudeProperty: 'location.longitude',
        latitudeProperty: 'location.latitude',
        geometryProperty: 'location',
        asFeatureCollection: false
      })
    ],
    get: [],
    create: [sendEventPushNotifications],
    update: [sendEventPushNotifications],
    patch: [sendEventPushNotifications],
    remove: [commonHooks.setNow('updatedAt'), sendEventPushNotifications]
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

export default hooks
