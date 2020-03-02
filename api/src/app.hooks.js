// Application hooks that run for every service
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import commonHooks from 'feathers-hooks-common'
import { permissions as corePermissions, hooks as coreHooks } from '@kalisio/kdk-core'
import { permissions as teamPermissions } from '@kalisio/kdk-team'
import { permissions as notifyPermissions, hooks as notifyHooks } from '@kalisio/kdk-notify'
import { permissions as mapPermissions } from '@kalisio/kdk-map'
import { permissions as eventPermissions } from '@kalisio/kdk-event'
import { permissions as billingPermissions } from '@kalisio/kdk-billing/common'
const { authenticate } = require('@feathersjs/authentication').hooks

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
// Then rules for contextual catalog, features, etc.
corePermissions.defineAbilities.registerHook((subject, can, cannot) => {
  if (subject && subject._id) {
    if (subject.organisations) {
      subject.organisations.forEach(organisation => {
        if (organisation._id) {
          // Specific rules for organisations
          const role = corePermissions.Roles[organisation.permissions]
          // The unique identifier of a service is its path not its name.
          // Indeed we have for instance a 'groups' service in each organisation.
          can('service', organisation._id.toString() + '/catalog')
          can('read', 'catalog', { context: organisation._id })
          can('service', organisation._id.toString() + '/features')
          can('all', 'features', { context: organisation._id })
          can('service', organisation._id.toString() + '/alerts')
          can('read', 'alerts', { context: organisation._id })
          if (role >= corePermissions.Roles.manager) {
            can(['create', 'update', 'remove'], 'catalog', { context: organisation._id })
            can(['create', 'remove'], 'alerts', { context: organisation._id })
          }
        }
      })
    }
  }
})

module.exports = {
  before: {
    all: [coreHooks.log,
      // We skip authentication in some cases
      commonHooks.when(hook => {
        // First built-in Feathers services like authentication
        if (typeof hook.service.getPath !== 'function') return false
        // Then user creation
        if ((hook.service.name === 'users') && (hook.method === 'create')) return false
        // Password reset, verify sign in, etc.
        if ((hook.service.name === 'account') && (hook.data.action !== 'passwordChange') && (hook.data.action !== 'identityChange')) return false
        // If not exception perform authentication
        return true
      }, authenticate('jwt')),
      // We skip processing DB IDs in some cases
      commonHooks.when(hook => {
        // First built-in Feathers services like authentication
        if (typeof hook.service.getPath !== 'function') return false
        // If not exception process IDs
        return true
      }, coreHooks.processObjectIDs),
      coreHooks.authorise],
    find: [fuzzySearch(), coreHooks.marshallCollationQuery],
    get: [],
    // This one cannot be registered on the user service directly because it should run before password hashing, etc.
    create: [commonHooks.when(hook => hook.service.name === 'users' && hook.data.sponsor,
      coreHooks.setExpireAfter(48 * 60 * 60), // 48h in seconds
      coreHooks.generatePassword,
      notifyHooks.sendInvitationEmail)],
    update: [coreHooks.preventUpdatePerspectives],
    patch: [],
    remove: []
  },

  after: {
    all: [coreHooks.log, coreHooks.processPerspectives],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [coreHooks.log],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
