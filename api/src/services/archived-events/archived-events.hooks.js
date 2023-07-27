import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { hooks as mapHooks } from '@kalisio/kdk/map.api.js'
import { populatePlan, marshallPlanQuery } from '../../hooks/index.js'

export default {
  before: {
    all: [
      coreHooks.convertObjectIDs(['plan']),
      coreHooks.convertToString(['alert.conditions'])
    ],
    find: [fuzzySearch({ fields: ['name'] }), coreHooks.diacriticSearch(), mapHooks.marshallSpatialQuery, coreHooks.marshallComparisonQuery, marshallPlanQuery, coreHooks.distinct],
    get: [],
    create: [
      commonHooks.disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
      coreHooks.convertObjectIDs(['layer', 'feature'])
    ],
    update: [
      commonHooks.disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
      coreHooks.convertObjectIDs(['layer', 'feature'])
    ],
    patch: [
      commonHooks.disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
      coreHooks.convertObjectIDs(['layer', 'feature'])
    ],
    remove: [commonHooks.disallow('external')]
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
