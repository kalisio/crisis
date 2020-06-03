import _ from 'lodash'
import { when } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api'
import { checkOrganisationsQuotas, checkPlanQuotas, subscribeDefaultPlan, removeBilling } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkOrganisationsQuotas],
    update: [],
    // When changing billing plan check for quotas
    patch: [when(hook => _.get(hook, 'data.billing'), checkOrganisationsQuotas, checkPlanQuotas)],
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
      coreHooks.createSubscribersGroup,
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
