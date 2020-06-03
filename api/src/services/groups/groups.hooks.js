import { hooks as coreHooks } from '@kalisio/kdk/core.api'
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
    create: [
      coreHooks.createTopic(),
      coreHooks.createGroupAuthorisations],
    update: [],
    patch: [],
    remove: [
      coreHooks.setAsDeleted,
      coreHooks.removeGroupAuthorisations,
      coreHooks.removeTopic()]
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
