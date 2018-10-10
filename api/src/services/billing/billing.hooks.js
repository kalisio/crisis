
import { when } from 'feathers-hooks-common'
import { hooks as billingHooks } from '@kalisio/kBilling'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ when(hook => hook.params.provider, billingHooks.preventUnverifiedUser) ],
    update: [ when(hook => hook.params.provider, billingHooks.preventUnverifiedUser) ],
    patch: [],
    remove: [ when(hook => hook.params.provider, billingHooks.preventUnverifiedUser) ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
    create: [ billingHooks.unpopulateBillingObject ],
    update: [ billingHooks.unpopulateBillingObject ],
    patch: [],
    remove: [ billingHooks.unpopulateBillingObject ]
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
