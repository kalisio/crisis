import { when } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kCore'
import { hooks as notifyHooks } from '@kalisio/kNotify'

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
    create: [ when(hook => hook.result && hook.result.scope === 'members' && hook.result.count === 1, notifyHooks.createTopic),
      // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
      coreHooks.unpopulateTagResource ],
    update: [],
    patch: [],
    // We remove topics for members tag only, check if tag is really removed or just its count decreased
    remove: [ when(hook => hook.result && hook.result.scope === 'members' && hook.result.count <= 0, notifyHooks.removeTopic),
      // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
      coreHooks.unpopulateTagResource ]
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
