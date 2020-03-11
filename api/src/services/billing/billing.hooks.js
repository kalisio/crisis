import { when } from 'feathers-hooks-common'
import { preventUnverifiedUser, populateBillingObject, unpopulateBillingObject } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [when(hook => hook.params.provider, preventUnverifiedUser), populateBillingObject],
    update: [when(hook => hook.params.provider, preventUnverifiedUser), populateBillingObject],
    patch: [],
    remove: [when(hook => hook.params.provider, preventUnverifiedUser), populateBillingObject]
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
