import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { checkGroupsQuotas, updateEventTemplateResource } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
    (hook) => { console.log('fuck1') },
    checkGroupsQuotas
    ],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      (hook) => { console.log('fuck2') },
      updateEventTemplateResource('participants'),
      updateEventTemplateResource('coordinators'),
      (hook) => { console.log('fuck3') }
    ],
    find: [],
    get: [],
    create: [
      (hook) => { console.log('fuck4') },
      coreHooks.createTopic(),
      (hook) => { console.log('fuck5') }
      // Groups can now be created as empty because org managers can manage all groups
      // coreHooks.createGroupAuthorisations
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
