import _ from 'lodash'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { updateEventTemplateResources, updateOrganisationResource } from '../../hooks/index.js'

// Our tags target the members scope only but as we use a generic editor for creation we have to add it by default
// We also add the context automatically if not provided
function addMembersScope (hook) {
  if (!_.has(hook.data, 'scope')) _.set(hook.data, 'scope', 'members')
  if (!_.has(hook.data, 'context')) _.set(hook.data, 'context', hook.service.getContextId())
}

export default {
  before: {
    all: [],
    find: [fuzzySearch({ fields: ['value'] }), coreHooks.diacriticSearch()],
    get: [],
    create: [addMembersScope],
    update: [addMembersScope],
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
    create: [],
    update: [updateOrganisationResource('tags')],
    patch: [updateOrganisationResource('tags')],
    remove: [
      coreHooks.setAsDeleted,
      updateOrganisationResource('tags')
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
