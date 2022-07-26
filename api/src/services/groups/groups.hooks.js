import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { checkGroupsQuotas, updateEventTemplateResource } from '../../hooks/index.js'

export default {
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
    all: [
      updateEventTemplateResource('participants'),
      updateEventTemplateResource('coordinators')
    ],
    find: [],
    get: [],
    create: [
      coreHooks.createTopic(),
      // Groups can now be created as empty because org managers can manage all groups
      //coreHooks.createGroupAuthorisations
    ],
    update: [],
    patch: [],
    remove: [
      coreHooks.setAsDeleted,
      coreHooks.removeGroupAuthorisations,
      coreHooks.removeTopic()
    ]
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
