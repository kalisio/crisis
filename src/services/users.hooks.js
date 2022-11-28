import { hooks as kdkCoreHooks } from '@kalisio/kdk/core.client'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [kdkCoreHooks.checkUnique],
    update: [],
    patch: [],
    remove: []
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
