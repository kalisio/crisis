import _ from 'lodash'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { checkOrganisationsQuotas, checkSubscriptionQuotas, subscribeDefaultPlan,
         removeBilling, removeOrganisationAlerts } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [fuzzySearch({ fields: ['name'] }), coreHooks.diacriticSearch()],
    get: [],
    create: [checkOrganisationsQuotas],
    update: [],
    // When changing billing plan check for quotas
    patch: [commonHooks.when(hook => _.get(hook, 'data.billing'), checkOrganisationsQuotas, checkSubscriptionQuotas)],
    remove: [coreHooks.preventRemoveOrganisation]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      coreHooks.createOrganisationServices,
      coreHooks.createOrganisationAuthorisations,
      subscribeDefaultPlan
    ],
    update: [],
    patch: [],
    remove: [
      coreHooks.setAsDeleted,
      removeBilling,
      removeOrganisationAlerts,
      coreHooks.removeOrganisationResources('groups'),
      coreHooks.removeOrganisationResources('tags'),
      coreHooks.removeOrganisationAuthorisations,
      coreHooks.removeOrganisationServices
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
