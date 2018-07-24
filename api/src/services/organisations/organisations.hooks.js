import _ from 'lodash'
import { when } from 'feathers-hooks-common'
import { hooks as coreHooks } from 'kCore'
import { hooks as teamHooks } from 'kTeam'
import { hooks as notifyHooks } from 'kNotify'
import { hooks as eventHooks } from 'kEvent'
import { checkOrganisationsQuotas, checkPlanQuotas } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ checkOrganisationsQuotas, teamHooks.addOrganisationPlan ],
    update: [],
    // When changing billing plan check for quotas
    patch: [ when(hook => _.get(hook, 'data.billing'), checkOrganisationsQuotas, checkPlanQuotas) ],
    remove: [ teamHooks.preventRemoveOrganisation ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ teamHooks.createOrganisationServices,
      eventHooks.createOrganisationServices,
      notifyHooks.createTopic,
      teamHooks.createOrganisationAuthorisations ],
    update: [],
    patch: [],
    remove: [ coreHooks.setAsDeleted,
      teamHooks.removeOrganisationGroups,
      teamHooks.removeOrganisationTags,
      teamHooks.removeOrganisationAuthorisations,
      notifyHooks.removeTopic,
      eventHooks.removeOrganisationServices,
      teamHooks.removeOrganisationServices ]
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
