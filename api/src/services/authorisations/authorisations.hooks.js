import _ from 'lodash'
import { hooks as coreHooks } from '@kalisio/kdk/core.api'
import { when } from 'feathers-hooks-common'
import { checkMembersQuotas, preventRemovingCustomer } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      // No escalation possible on groups as there are only group managers now (no more owners)
      when(hook => (_.get(hook, 'data.scope') || _.get(hook.params, 'query.scope')) === 'organisations', coreHooks.preventEscalation),
      when(hook => hook.params.resource,
        coreHooks.preventRemovingLastOwner('organisations')),
        // Groups can now be left as empty because org managers can manage all groups
        //coreHooks.preventRemovingLastOwner('groups')),
      when(hook => (_.get(hook, 'data.scope') || _.get(hook.params, 'query.scope')) === 'organisations',
        checkMembersQuotas,
        preventRemovingCustomer)
    ],
    update: [],
    patch: [],
    remove: [
      // No escalation possible on groups as there are only group managers now (no more owners)
      when(hook => (_.get(hook, 'data.scope') || _.get(hook.params, 'query.scope')) === 'organisations', coreHooks.preventEscalation),
      // Except when the resource is deleted by a owner check to keep at least one
      when(hook => hook.params.resource && !hook.params.resource.deleted,
        coreHooks.preventRemovingLastOwner('organisations')),
        // Groups can now be left as empty because org managers can manage all groups
        //coreHooks.preventRemovingLastOwner('groups')),
      // Remove also auhorisations for all org groups/tags when removing authorisation on org
      // Need to be done in a before and not a after hook because otherwise the user has been
      // removed from the member service and will not be available anymore for subsequent operations
      when(hook => _.get(hook.params, 'query.scope') === 'organisations',
        preventRemovingCustomer,
        coreHooks.removeOrganisationTagsAuthorisations,
        coreHooks.removeOrganisationGroupsAuthorisations)
    ]
  },

  after: {
    all: [],
    find: [],
    get: [],
    // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
    create: [coreHooks.subscribeSubjectsToResourceTopic, coreHooks.unpopulateSubjects, coreHooks.unpopulateResource],
    update: [],
    patch: [],
    // Required due to https://github.com/feathersjs-ecosystem/feathers-sync/issues/87
    remove: [coreHooks.unsubscribeSubjectsFromResourceTopic, coreHooks.unpopulateSubjects, coreHooks.unpopulateResource]
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
