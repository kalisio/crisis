import _ from 'lodash'
import { hooks as coreHooks } from 'kCore'
import { hooks as teamHooks } from 'kTeam'
import { hooks as notifyHooks } from 'kNotify'
import { when } from 'feathers-hooks-common'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ coreHooks.preventEscalation,
      when(hook => hook.params.resource,
        teamHooks.preventRemovingLastOwner('organisations'),
        teamHooks.preventRemovingLastOwner('groups')) ],
    update: [],
    patch: [],
    remove: [ coreHooks.preventEscalation,
      // Except when the resource is deleted by a owner check to keep at least one
      when(hook => hook.params.resource && !hook.params.resource.deleted,
        teamHooks.preventRemovingLastOwner('organisations'),
        teamHooks.preventRemovingLastOwner('groups')) ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ notifyHooks.subscribeSubjectsToResourceTopic ],
    update: [],
    patch: [],
    remove: [ notifyHooks.unsubscribeSubjectsFromResourceTopic,
      // Remove also auhorisations for all org groups/tags when removing authorisation on org
      when(hook => _.get(hook.params, 'query.scope') === 'organisations',
        teamHooks.removeOrganisationTagsAuthorisations,
        teamHooks.removeOrganisationGroupsAuthorisations) ]
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
