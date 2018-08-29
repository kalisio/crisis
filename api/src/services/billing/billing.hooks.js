import _ from 'lodash'
import { hooks as billingHooks } from 'kBilling'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
