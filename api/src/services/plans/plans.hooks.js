import { setNow, discard } from 'feathers-hooks-common'
import { addCreatorAsCoordinator,checkPlansQuotas, removeEventsPlan, archive } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      checkPlansQuotas,
      addCreatorAsCoordinator,
      setNow('createdAt', 'updatedAt')
    ],
    update: [
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    patch: [
      discard('createdAt', 'updatedAt'),
      setNow('updatedAt')
    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
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

// Add archiving feature
// This is only in dev/preprod mode, in prod this feature is managed by MongoDB Stitch
if (process.env.NODE_APP_INSTANCE !== 'prod') {
  module.exports.after.all.push(archive)
}