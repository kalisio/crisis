import _ from 'lodash'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { checkOrganisationsQuotas, removeOrganisationAlerts, updateEventTemplateResources, removeOrganisationResources,
  removeOrganisationAuthorisations, removeOrganisationServices, createOrganisationServices, createOrganisationAuthorisations
 } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [fuzzySearch({ fields: ['name'] }), coreHooks.diacriticSearch()],
    get: [],
    create: [checkOrganisationsQuotas],
    update: [],
    patch: [commonHooks.iff(commonHooks.isProvider('external'), coreHooks.preventChanges(false, ['quotas']))],
    remove: []
  },

  after: {
    all: [updateEventTemplateResources('participants')],
    find: [],
    get: [],
    create: [
      createOrganisationServices,
      createOrganisationAuthorisations
    ],
    update: [],
    patch: [],
    remove: [
      coreHooks.setAsDeleted,
      removeOrganisationAlerts,
      removeOrganisationResources('groups'),
      removeOrganisationResources('tags'),
      removeOrganisationAuthorisations,
      removeOrganisationServices
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
