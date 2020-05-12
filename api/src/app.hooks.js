// Application hooks that run for every service
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import commonHooks from 'feathers-hooks-common'
import { permissions as corePermissions, hooks as coreHooks } from '@kalisio/kdk/core.api'
import { permissions as mapPermissions } from '@kalisio/kdk/map.api'
import * as permissions from './permissions'

const { authenticate } = require('@feathersjs/authentication').hooks

// Register all default hooks for authorisation
// Default rules for all users
corePermissions.defineAbilities.registerHook(corePermissions.defineUserAbilities)
// Then rules for organisations
corePermissions.defineAbilities.registerHook(corePermissions.defineOrganisationAbilities)
// Then rules for groups
corePermissions.defineAbilities.registerHook(corePermissions.defineGroupAbilities)
// Then rules for mapping
corePermissions.defineAbilities.registerHook(mapPermissions.defineUserAbilities)
// Then rules for app
corePermissions.defineAbilities.registerHook(permissions.defineUserAbilities)

module.exports = {
  before: {
    all: [coreHooks.log,
      // We skip authentication in some cases
      commonHooks.when(hook => {
        // First built-in Feathers services like authentication
        if (typeof hook.service.getPath !== 'function') return false
        // Then user creation
        if ((hook.service.name === 'users') && (hook.method === 'create')) return false
        // Subscribers creation/deletion
        if ((hook.service.name === 'subscribers') && ((hook.method === 'create') || (hook.method === 'remove'))) return false
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
      coreHooks.sendInvitationEmail)],
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
