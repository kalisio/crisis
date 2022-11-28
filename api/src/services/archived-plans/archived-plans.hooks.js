import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { hooks as mapHooks } from '@kalisio/kdk/map.api.js'

export default {
  before: {
    all: [],
    find: [mapHooks.marshallSpatialQuery, coreHooks.marshallComparisonQuery, coreHooks.distinct],
    get: [],
    create: [
      commonHooks.disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt'])
    ],
    update: [
      commonHooks.disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt'])
    ],
    patch: [
      commonHooks.disallow('external'),
      coreHooks.convertDates(['createdAt', 'updatedAt'])
    ],
    remove: [commonHooks.disallow('external')]
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
