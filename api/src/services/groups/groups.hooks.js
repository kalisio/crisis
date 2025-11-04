import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { checkGroupsQuotas, updateEventTemplateResources, updateOrganisationResource, removeGroupAuthorisations } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [fuzzySearch({ fields: ['name'] }), coreHooks.diacriticSearch()],
    get: [],
    create: [
      checkGroupsQuotas
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      updateEventTemplateResources('participants'),
      updateEventTemplateResources('coordinators')
    ],
    find: [],
    get: [],
    create: [
      // Groups can now be created as empty because org managers can manage all groups
      // coreHooks.createGroupAuthorisations
    ],
    update: [updateOrganisationResource('groups')],
    patch: [updateOrganisationResource('groups')],
    remove: [
      coreHooks.setAsDeleted,
      removeGroupAuthorisations
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
