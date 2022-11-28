import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { checkOrganisationsQuotas, checkSubscriptionQuotas, subscribeDefaultPlan, removeBilling } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
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
      coreHooks.createTopic(),
      coreHooks.createOrganisationAuthorisations,
      subscribeDefaultPlan
    ],
    update: [],
    patch: [],
    remove: [
      coreHooks.setAsDeleted,
      removeBilling,
      coreHooks.removeOrganisationGroups,
      coreHooks.removeOrganisationTags,
      coreHooks.removeOrganisationAuthorisations,
      coreHooks.removeTopic(),
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
