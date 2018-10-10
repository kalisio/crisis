import { hooks as coreHooks } from '@kalisio/kCore'
import { hooks as teamHooks } from '@kalisio/kTeam'
import { hooks as notifyHooks } from '@kalisio/kNotify'
import { checkGroupsQuotas } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ checkGroupsQuotas ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ notifyHooks.createTopic,
      teamHooks.createGroupAuthorisations ],
    update: [],
    patch: [],
    remove: [ coreHooks.setAsDeleted,
      teamHooks.removeGroupAuthorisations,
      notifyHooks.removeTopic ]
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
