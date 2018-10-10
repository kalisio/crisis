// Application hooks that run for every service
import { permissions as corePermissions, hooks as coreHooks } from '@kalisio/kCore/client'
import { permissions as teamPermissions } from '@kalisio/kTeam/common'
import { permissions as notifyPermissions } from '@kalisio/kNotify/common'
import { permissions as mapPermissions } from '@kalisio/kMap/common'
import { permissions as eventPermissions } from '@kalisio/kEvent/common'
import { permissions as billingPermissions } from '@kalisio/kBilling/common'

// Register all default hooks for authorisation
// Default rules for all users
corePermissions.defineAbilities.registerHook(corePermissions.defineUserAbilities)
corePermissions.defineAbilities.registerHook(notifyPermissions.defineUserAbilities)
corePermissions.defineAbilities.registerHook(mapPermissions.defineUserAbilities)
// Then rules for organisations
corePermissions.defineAbilities.registerHook(teamPermissions.defineOrganisationAbilities)
// Then rules for groups
corePermissions.defineAbilities.registerHook(teamPermissions.defineGroupAbilities)
// Then rules for events
corePermissions.defineAbilities.registerHook(eventPermissions.defineEventAbilities)
// Then rules for billing
corePermissions.defineAbilities.registerHook(billingPermissions.defineBillingAbilities)

export default {
  before: {
    all: [ coreHooks.log, coreHooks.emit ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ coreHooks.log, coreHooks.emit ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ coreHooks.log, coreHooks.emit ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
