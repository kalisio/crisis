import _ from 'lodash'
import { disallow, populate, iff } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api'
import { hooks as mapHooks } from '@kalisio/kdk/map.api'
import { countParticipants } from '../../hooks'

const populatePreviousLog = populate({
  schema: hook => {
    return {
      include: [
        { service: hook.service.getPath(true), nameAs: 'previous', parentField: 'previous', childField: '_id' }
      ]
    }
  }
})

module.exports = {
  before: {
    all: [coreHooks.convertObjectIDs(['participant', 'event'])],
    find: [mapHooks.marshallSpatialQuery, coreHooks.marshallComparisonQuery, countParticipants],
    get: [],
    create: [disallow('external'), coreHooks.convertDates(['createdAt', 'expireAt'])],
    update: [disallow('external'), coreHooks.convertDates(['createdAt', 'expireAt'])],
    patch: [disallow('external'), coreHooks.convertDates(['createdAt', 'expireAt'])],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    // Due to anonymization in archive we don't populate participant
    find: [
      // Skip regular hooks on aggregation
      iff(hook => !_.get(hook, 'params.query.$aggregate'), populatePreviousLog)
    ],
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
