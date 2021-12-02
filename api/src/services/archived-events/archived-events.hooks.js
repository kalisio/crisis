import _ from 'lodash'
import { disallow, iff } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api'
import { hooks as mapHooks } from '@kalisio/kdk/map.api'
import { populatePlan, marshallPlanQuery } from '../../hooks'

module.exports = {
  before: {
    all: [
      coreHooks.convertObjectIDs(['plan']),
      coreHooks.convertToString(['alert.conditions'])
    ],
    find: [mapHooks.marshallSpatialQuery, coreHooks.marshallComparisonQuery, marshallPlanQuery, coreHooks.distinct],
    get: [],
    create: [
      disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
      coreHooks.convertObjectIDs(['layer', 'feature'])
    ],
    update: [
      disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
      coreHooks.convertObjectIDs(['layer', 'feature'])
    ],
    patch: [
      disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
      coreHooks.convertObjectIDs(['layer', 'feature'])
    ],
    remove: [disallow('external')]
  },

  after: {
    all: [coreHooks.convertToJson(['alert.conditions'])],
    find: [
      // Not by default for performance reason
      iff(hook => _.get(hook, 'params.planAsObject'), populatePlan),
      mapHooks.asGeoJson({
        longitudeProperty: 'location.longitude',
        latitudeProperty: 'location.latitude',
        geometryProperty: 'location',
        asFeatureCollection: false
      })
    ],
    get: [],
    // Avoid emitting events as in production we use Mongo Realm to fill the collection, which does not emit events unlike services
    create: [coreHooks.skipEvents],
    update: [coreHooks.skipEvents],
    patch: [coreHooks.skipEvents],
    remove: [coreHooks.skipEvents]
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
