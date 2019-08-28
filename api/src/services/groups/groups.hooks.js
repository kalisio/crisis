import { hooks as coreHooks } from '@kalisio/kdk-core'
import { hooks as teamHooks } from '@kalisio/kdk-team'
import { hooks as notifyHooks } from '@kalisio/kdk-notify'
import { checkGroupsQuotas } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkGroupsQuotas],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [notifyHooks.createTopic,
      teamHooks.createGroupAuthorisations],
    update: [],
    patch: [],
    remove: [coreHooks.setAsDeleted,
      teamHooks.removeGroupAuthorisations,
      notifyHooks.removeTopic]
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
