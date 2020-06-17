import _ from 'lodash'
import { disallow, populate, iff } from 'feathers-hooks-common'
import { hooks } from '@kalisio/kdk/core.api'
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
    all: [],
    find: [countParticipants],
    get: [],
    create: [disallow('external'), hooks.convertDates(['createdAt', 'expireAt']), hooks.convertObjectIDs(['participant', 'event'])],
    update: [disallow('external'), hooks.convertDates(['createdAt', 'expireAt']), hooks.convertObjectIDs(['participant', 'event'])],
    patch: [disallow('external'), hooks.convertDates(['createdAt', 'expireAt']), hooks.convertObjectIDs(['participant', 'event'])],
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
