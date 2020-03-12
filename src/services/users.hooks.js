import { hooks as coreHooks } from '@kalisio/kdk/core.api'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ coreHooks.checkUnique ],
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
