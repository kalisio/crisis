import commonHooks from 'feathers-hooks-common'
import { preventUnverifiedUser, populateBillingObject, unpopulateBillingObject } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [commonHooks.when(hook => hook.params.provider, preventUnverifiedUser), populateBillingObject],
    update: [commonHooks.when(hook => hook.params.provider, preventUnverifiedUser), populateBillingObject],
    patch: [],
    remove: [commonHooks.when(hook => hook.params.provider, preventUnverifiedUser), populateBillingObject]
  },

  after: {
    all: [],
    find: [],
    get: [],
    // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
    create: [unpopulateBillingObject],
    update: [unpopulateBillingObject],
    patch: [],
    remove: [unpopulateBillingObject]
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
