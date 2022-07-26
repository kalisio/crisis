import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { hooks as mapHooks } from '@kalisio/kdk/map.api.js'
import { countParticipants } from '../../hooks/index.js'

const populatePreviousLog = commonHooks.populate({
  schema: hook => {
    return {
      include: [
        { service: hook.service.getPath(true), nameAs: 'previous', parentField: 'previous', childField: '_id' }
      ]
    }
  }
})

export default {
  before: {
    all: [coreHooks.convertObjectIDs(['participant', 'event'])],
    find: [mapHooks.marshallSpatialQuery, coreHooks.marshallComparisonQuery, countParticipants],
    get: [],
    create: [commonHooks.disallow('external'), coreHooks.convertDates(['createdAt', 'expireAt'])],
    update: [commonHooks.disallow('external'), coreHooks.convertDates(['createdAt', 'expireAt'])],
    patch: [commonHooks.disallow('external'), coreHooks.convertDates(['createdAt', 'expireAt'])],
    remove: [commonHooks.disallow('external')]
  },

  after: {
    all: [],
    // Due to anonymization in archive we don't populate participant
    find: [
      // Skip regular hooks on aggregation
      commonHooks.iff(hook => !_.get(hook, 'params.query.$aggregate'), populatePreviousLog)
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
