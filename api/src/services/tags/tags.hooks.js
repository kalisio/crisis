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
    create: [
      // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
      coreHooks.unpopulateTagResource
    ],
    update: [],
    patch: [],
    remove: [
      // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
      coreHooks.unpopulateTagResource
    ]
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
