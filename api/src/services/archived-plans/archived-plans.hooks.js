import { disallow } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api'
import { hooks as mapHooks } from '@kalisio/kdk/map.api'

module.exports = {
  before: {
    all: [],
    find: [mapHooks.marshallSpatialQuery, coreHooks.marshallComparisonQuery, coreHooks.distinct],
    get: [],
    create: [
      disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt'])
    ],
    update: [
      disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt'])
    ],
    patch: [
      disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt']),
    ],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    find: [],
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