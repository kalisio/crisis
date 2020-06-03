import { when } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    // We create topics for members tag only, check if tag is really created or just its count increased
    create: [when(hook => hook.result && hook.result.scope === 'members' && hook.result.count === 1, coreHooks.createTopic()),
      // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
      coreHooks.unpopulateTagResource],
    update: [],
    patch: [],
    // We remove topics for members tag only, check if tag is really removed or just its count decreased
    remove: [when(hook => hook.result && hook.result.scope === 'members' && hook.result.count <= 0, coreHooks.removeTopic),
      // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
      coreHooks.unpopulateTagResource]
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
