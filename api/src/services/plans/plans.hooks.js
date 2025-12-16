import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { hooks as mapHooks } from '@kalisio/kdk/map.api.js'
import { addCreatorAsCoordinator, checkPlansQuotas, updateEventsObjective, removeEventsPlan, archive } from '../../hooks/index.js'

const hooks = {
  before: {
    all: [],
    find: [fuzzySearch({ fields: ['name'] }), coreHooks.diacriticSearch()],
    get: [mapHooks.marshallSpatialQuery],
    create: [
      checkPlansQuotas,
      addCreatorAsCoordinator,
      commonHooks.setNow('createdAt', 'updatedAt')
    ],
    update: [
      commonHooks.discard('createdAt', 'updatedAt'),
      commonHooks.setNow('updatedAt'),
      coreHooks.populatePreviousObject
    ],
    patch: [
      commonHooks.discard('createdAt', 'updatedAt'),
      commonHooks.setNow('updatedAt'),
      coreHooks.populatePreviousObject
    ],
    remove: []
  },

  after: {
    // Archive first to avoid polutting object with client-side information that could be added afterwards
    all: [archive],
    find: [],
    get: [mapHooks.asGeoJson({
      longitudeProperty: 'location.longitude',
      latitudeProperty: 'location.latitude',
      geometryProperty: 'location',
      asFeatureCollection: false,
      dataPath: 'result.objectives'
    })],
    create: [],
    update: [updateEventsObjective],
    patch: [updateEventsObjective],
    remove: [removeEventsPlan]
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
