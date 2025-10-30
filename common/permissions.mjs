import { permissions } from '@kalisio/kdk/core.common.js'
import _ from 'lodash'

// FIXME: this file is duplicated in the api folder
// Indeed, permissions files are usually isomorphic files. However, when we tried to create a common folder
// to share it between frontend/backend but experienced problems with webpack

function defineEventAbilities (subject, can, cannot, app) {
  if (subject && subject._id) {
    if (subject.organisations) {
      subject.organisations.forEach(organisation => {
        const role = permissions.Roles[organisation.permissions]
        if (role >= permissions.Roles.member) {
          if (organisation._id) {
            // The unique identifier of a service is its path not its name.
            // Indeed we have for instance a 'events' service in each organisation.
            can('service', organisation._id.toString() + '/events')
            can('service', organisation._id.toString() + '/event-logs')
            can('service', organisation._id.toString() + '/event-templates')
            can('service', organisation._id.toString() + '/archived-events')
            can('service', organisation._id.toString() + '/archived-event-logs')
            // A user can access the templates to create an event
            can('read', 'event-templates', { context: organisation._id })
            // A user can create an event
            can('create', 'events', { context: organisation._id })
            // A user can access events in which he or his org is a participant
            can('read', 'events', { context: organisation._id, 'participants._id': subject._id })
            can('read', 'events', { context: organisation._id, 'participants._id': organisation._id })
            // A coordinator can manage his events
            can('all', 'events', { context: organisation._id, 'coordinators._id': subject._id })
            // The same for archive
            can('read', 'archived-events', { context: organisation._id, 'participants._id': subject._id })
            can('read', 'archived-events', { context: organisation._id, 'participants._id': organisation._id })
            can('read', 'archived-events', { context: organisation._id, 'coordinators._id': subject._id })
          }
          if (subject.groups) {
            subject.groups.forEach(group => {
              if (group._id && group.context && (group.context.toString() === organisation._id.toString())) {
                // A user can access events in which his group is a participant
                can('read', 'events', { context: organisation._id, 'participants._id': group._id })
                // A coordinator can manage events in which his group is a coordinator
                can('all', 'events', { context: organisation._id, 'coordinators._id': group._id })
                // The same for archive
                can('read', 'archived-events', { context: organisation._id, 'participants._id': group._id })
                can('read', 'archived-events', { context: organisation._id, 'coordinators._id': group._id })
              }
            })
          }
          if (subject.tags) {
            subject.tags.forEach(tag => {
              if (tag._id && tag.context && (tag.context.toString() === organisation._id.toString())) {
                // A user can access events in which his tag is a participant
                can('read', 'events', { context: organisation._id, 'participants._id': tag._id })
                // A coordinator can manage events in which his tag is a coordinator
                can('all', 'events', { context: organisation._id, 'coordinators._id': tag._id })
                // The same for archive
                can('read', 'archived-events', { context: organisation._id, 'participants._id': tag._id })
                can('read', 'archived-events', { context: organisation._id, 'coordinators._id': tag._id })
              }
            })
          }
          if (organisation._id) {
            // A user can create event logs for himself and coordinator for everybody within an event
            // FIXME: hard to fully express this with the permission system as rights about events
            // are not stored on the user but on events because it can be archived and a results in a pretty large list
            can(['read', 'create'], 'event-logs', { context: organisation._id })
            can('read', 'archived-event-logs', { context: organisation._id })
          }
        }
        if (role >= permissions.Roles.manager) {
          if (organisation._id) {
            can('all', 'event-templates', { context: organisation._id })
            can('read', 'archived-events', { context: organisation._id })
          }
        }
      })
    }
  }
}

function definePlanAbilities (subject, can, cannot, app) {
  if (subject && subject._id) {
    if (subject.organisations) {
      subject.organisations.forEach(organisation => {
        const role = permissions.Roles[organisation.permissions]
        if (role >= permissions.Roles.member) {
          if (organisation._id) {
            // The unique identifier of a service is its path not its name.
            // Indeed we have for instance a 'events' service in each organisation.
            can('service', organisation._id.toString() + '/plans')
            can('service', organisation._id.toString() + '/plan-templates')
            can('service', organisation._id.toString() + '/archived-plans')
            // A user can access the templates to create a plan
            can('read', 'plan-templates', { context: organisation._id })
            // A user can create plan and should be able to get information about running plans
            can('create', 'plans', { context: organisation._id })
            // A coordinator can manage his plans
            can('all', 'plans', { context: organisation._id, 'coordinators._id': subject._id })
            can('read', 'archived-plans', { context: organisation._id, 'coordinators._id': subject._id })
            // FIXME: A user can read running plans as we'd like it to see plans where he has an event
            // Hard to express restrictions with current permissions system however as it will require
            // request to the DB and to update abilities of all users involved in an event when creating/updating it.
            // As a consequence filtering will be done at the frontend level for now.
            can('read', 'plans', { context: organisation._id })
            can('read', 'archived-plans', { context: organisation._id })
          }
          if (subject.groups) {
            subject.groups.forEach(group => {
              if (group._id && group.context && (group.context.toString() === organisation._id.toString())) {
                // A coordinator can manage plans in which his group is a coordinator
                can('all', 'plans', { context: organisation._id, 'coordinators._id': group._id })
                can('read', 'archived-plans', { context: organisation._id, 'coordinators._id': group._id })
              }
            })
          }
          if (subject.tags) {
            subject.tags.forEach(tag => {
              if (tag._id && tag.context && (tag.context.toString() === organisation._id.toString())) {
                // A coordinator can manage plans in which his tag is a coordinator
                can('all', 'plans', { context: organisation._id, 'coordinators._id': tag._id })
                can('read', 'archived-plans', { context: organisation._id, 'coordinators._id': tag._id })
              }
            })
          }
        }
        if (role >= permissions.Roles.manager) {
          if (organisation._id) {
            can('all', 'plan-templates', { context: organisation._id })
            can('read', 'archived-plans', { context: organisation._id })
          }
        }
      })
    }
  }
}

// Hook computing contextual catalog, features, events, etc. abilities for a given user
export function defineUserAbilities (subject, can, cannot, app) {
  defineEventAbilities(subject, can, cannot, app)
  definePlanAbilities(subject, can, cannot, app)

  if (subject && subject._id) {
    if (subject.organisations) {
      subject.organisations.forEach(organisation => {
        if (organisation._id) {
          const role = permissions.Roles[organisation.permissions]
          if (role >= permissions.Roles.member) {
            can('service', organisation._id.toString() + '/catalog')
            can('read', 'catalog', { context: organisation._id })
            can('service', organisation._id.toString() + '/features')
            can('all', 'features', { context: organisation._id })
            can('service', organisation._id.toString() + '/alerts')
            can('read', 'alerts', { context: organisation._id })
          }
          if (role >= permissions.Roles.manager) {
            can(['create', 'update', 'remove'], 'catalog', { context: organisation._id })
            can(['create', 'remove'], 'alerts', { context: organisation._id })
          }
        }
      })
    }
  }
}

// Hook computing organisation abilities for a given user
export function defineOrganisationAbilities (subject, can, cannot) {
  if (subject) {
    // Create new organisations
    can('service', 'organisations')
    can('create', 'organisations')

    if (subject.organisations) {
      subject.organisations.forEach(organisation => {
        if (organisation._id) {
          // Generic rules for resources
          permissions.defineResourceRules(subject, organisation, 'organisations', can)
          // Specific rules for organisations
          const role = permissions.Roles[organisation.permissions]
          if (role >= permissions.Roles.member) {
            // The unique identifier of a service is its path not its name.
            // Indeed we have for instance a 'groups' service in each organisation.
            can('service', organisation._id.toString() + '/members')
            can('read', 'members', { context: organisation._id })
            can('service', organisation._id.toString() + '/tags')
            // Tags are public
            can('read', 'tags', { context: organisation._id })
            // Groups are private
            can('service', organisation._id.toString() + '/groups')
            can('service', organisation._id.toString() + '/storage')
            can(['read', 'create', 'remove', 'createMultipartUpload', 'completeMultipartUpload', 'uploadPart', 'putObject'], 'storage', { context: organisation._id })
          }
          if (role >= permissions.Roles.manager) {
            can('update', 'members', { context: organisation._id })
            // Managers can manage all groups/tags
            can('all', 'groups', { context: organisation._id })
            can(['create', 'remove'], 'authorisations', { resourcesService: organisation._id.toString() + '/groups', scope: 'groups' })
            can('all', 'tags', { context: organisation._id })
            // Remove invited members
            can(['remove'], 'users', { 'sponsor.organisationId': organisation._id })
          }
        }
      })
    }
  }
}

// Hook computing group abilities for a given user
export function defineGroupAbilities (subject, can, cannot) {
  if (subject) {
    if (subject.groups) {
      subject.groups.forEach(group => {
        if (group._id) {
          // Specific rules for groups
          const role = permissions.Roles[group.permissions]

          if (role >= permissions.Roles.member) {
            can('read', 'groups', { _id: group._id })
          }
          if (role >= permissions.Roles.manager) {
            can(['create', 'remove'], 'authorisations', { resource: group._id, permissions: 'member' })
          }
        }
      })
    }
  }
}

export function getRoleForOrganisation (user, organisationId) {
  const result = _.find(user.organisations, { _id: organisationId })
  if (!_.isUndefined(result)) return result.permissions
  return undefined
}
