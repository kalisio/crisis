import _ from 'lodash'
import { hooks as coreHooks } from 'kCore'
import { hooks as teamHooks } from 'kTeam'
import { hooks as notifyHooks } from 'kNotify'
import { when } from 'feathers-hooks-common'
import { checkMembersQuotas } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ coreHooks.preventEscalation,
      when(hook => hook.params.resource,
        teamHooks.preventRemovingLastOwner('organisations'),
        teamHooks.preventRemovingLastOwner('groups')),
      when(hook => (_.get(hook, 'data.scope') || _.get(hook.params, 'query.scope')) === 'organisations',
        checkMembersQuotas) ],
    update: [],
    patch: [],
    remove: [ coreHooks.preventEscalation,
      // Except when the resource is deleted by a owner check to keep at least one
      when(hook => hook.params.resource && !hook.params.resource.deleted,
        teamHooks.preventRemovingLastOwner('organisations'),
        teamHooks.preventRemovingLastOwner('groups')),
      // Remove also auhorisations for all org groups/tags when removing authorisation on org
      // Need to be done in a before and not a after hook because otherwise the user has been
      // removed from the member service and will not be available anymore for subsequent operations
      when(hook => _.get(hook.params, 'query.scope') === 'organisations',
        teamHooks.removeOrganisationTagsAuthorisations,
        teamHooks.removeOrganisationGroupsAuthorisations) ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ notifyHooks.subscribeSubjectsToResourceTopic ],
    update: [],
    patch: [],
    remove: [ notifyHooks.unsubscribeSubjectsFromResourceTopic ]
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
