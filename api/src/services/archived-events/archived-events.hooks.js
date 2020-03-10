import { disallow } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk-core'
import { hooks as mapHooks } from '@kalisio/kdk-map'

module.exports = {
  before: {
    all: [],
    find: [mapHooks.marshallSpatialQuery, coreHooks.marshallComparisonQuery, coreHooks.distinct],
    get: [],
    create: [disallow('external'), coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
             coreHooks.convertObjectIDs(['layer', 'feature'])],
    update: [disallow('external'), coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
             coreHooks.convertObjectIDs(['layer', 'feature'])],
    patch: [disallow('external'), coreHooks.convertDates(['createdAt', 'updatedAt', 'expireAt']),
             coreHooks.convertObjectIDs(['layer', 'feature'])],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    find: [mapHooks.asGeoJson({
      longitudeProperty: 'location.longitude',
      latitudeProperty: 'location.latitude',
      asFeatureCollection: false
    })],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
