import { disallow, populate } from 'feathers-hooks-common'
import { hooks } from '@kalisio/kdk-core'

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
    find: [],
    get: [],
    create: [disallow('external'), hooks.convertDates(['createdAt', 'expireAt']), hooks.convertObjectIDs(['participant', 'event'])],
    update: [disallow('external'), hooks.convertDates(['createdAt', 'expireAt']), hooks.convertObjectIDs(['participant', 'event'])],
    patch: [disallow('external'), hooks.convertDates(['createdAt', 'expireAt']), hooks.convertObjectIDs(['participant', 'event'])],
    remove: [disallow('external')]
  },

  after: {
    all: [],
    // Due to anonymization in archive we don't populate participant
    find: [populatePreviousLog],
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
