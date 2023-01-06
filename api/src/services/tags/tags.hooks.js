import commonHooks from 'feathers-hooks-common'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { updateEventTemplateResource } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [fuzzySearch({ fields: ['value'] }), coreHooks.diacriticSearch()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      updateEventTemplateResource('participants'),
      updateEventTemplateResource('coordinators')
    ],
    find: [],
    get: [],
    // We create topics for members tag only, check if tag is really created or just its count increased
    create: [commonHooks.when(hook => hook.result && hook.result.scope === 'members' && hook.result.count === 1, coreHooks.createTopic()),
      // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
      coreHooks.unpopulateTagResource],
    update: [],
    patch: [],
    // We remove topics for members tag only, check if tag is really removed or just its count decreased
    remove: [commonHooks.when(hook => hook.result && hook.result.scope === 'members' && hook.result.count <= 0, coreHooks.removeTopic()),
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
