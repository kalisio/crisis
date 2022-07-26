import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    // When updating attachments on events we need to transfer the notification parameter in query
    // However on create the parameters are sent via form data
    create: [commonHooks.iff(hook => hook.data.notification, (hook) => {
      _.set(hook, 'params.query.notification', hook.data.notification)
      return hook
    })],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
    create: [coreHooks.unpopulateAttachmentResource],
    update: [],
    patch: [],
    // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
    remove: [coreHooks.unpopulateAttachmentResource]
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
