import _ from 'lodash'
import makeDebug from 'debug'
import common from 'feathers-hooks-common'
import errors from '@feathersjs/errors'
import { Roles, RoleNames } from '@kalisio/kdk/core/common/permissions.js'

const { Forbidden } = errors
const { getItems } = common

const debug = makeDebug('crisis:users:hooks')

export function preventRemoveUser (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'preventRemoveUser\' hook should only be used as a \'before\' hook.')
  }

  // By pass check ?
  if (hook.params.force) return hook
  const user = hook.params.user
  // Check if the target is the current user
  if ((user._id.toString() === hook.id.toString()) && user.organisations) {
    // We must ensure the user is no more a owner of an organisation
    const owningOrganisations = _.filter(user.organisations, { permissions: RoleNames[Roles.owner] })
    if (!_.isEmpty(owningOrganisations)) {
      debug('Cannot remove the user: ', user)
      throw new Forbidden('You are not allowed to delete the user ' + user.name, {
        translation: {
          key: 'CANNOT_REMOVE_USER',
          params: { user: _.get(user, 'profile.name') }
        }
      })
    }
  }
  return hook
}

export async function joinOrganisation (hook) {
  const app = hook.app
  const subject = getItems(hook)
  const authorisationService = app.getService('authorisations')
  const usersService = app.getService('users')

  // Set membership for the created user
  await authorisationService.create({
    scope: 'organisations',
    permissions: subject.sponsor.roleGranted, // Member by default
    resource: subject.sponsor.organisationId,
    resourcesService: 'organisations'
  }, {
    subjectsService: usersService,
    subjects: [subject]
  })
  debug('Organisation membership set for user ' + subject._id)
  return hook
}

export function leaveOrganisations (options = { skipPrivate: true }) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'leaveOrganisations\' hook should only be used as a \'after\' hook.')
    }

    const app = hook.app
    const organisationsService = app.getService('organisations')
    const authorisationService = app.getService('authorisations')
    const usersService = app.getService('users')
    const subject = getItems(hook)
    const organisations = _.get(subject, 'organisations', [])

    await Promise.all(organisations.map(organisation => {
      // Unset membership on org except private org if required
      if (options.skipPrivate && organisation._id.toString() === subject._id.toString()) return Promise.resolve()
      return authorisationService.remove(organisation._id.toString(), {
        query: {
          scope: 'organisations'
        },
        user: hook.params.user,
        // Because we already have resource set it as objects to avoid populating
        // Moreover used as an after hook the subject might not already exist anymore
        subjects: [subject],
        subjectsService: usersService,
        resource: organisation,
        resourcesService: organisationsService
      })
    }))

    debug('Membership unset for all organisations on user ' + subject._id)
    return hook
  }
}

export async function sendInvitationEmail (hook) {
  // Before because we need to send the clear password by email
  if (hook.type !== 'before') {
    throw new Error('The \'sendInvitationEmail\' hook should only be used as a \'before\' hook.')
  }

  const accountService = hook.app.getService('account')
  await accountService.options.notifier('sendInvitation', hook.data)
  return hook
}

export async function updateUserAbilities (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'updateUserAbilities\' hook should only be used as a \'after\' hook.')
  }

  const authorisationsService = hook.app.getService('authorisations')
  const user = hook.params.user

  // Patching profile should not trigger abilities update since
  // it is a perspective and permissions are not available in this case
  // Updating abilities in this case will result in loosing permissions for orgs/groups as none are available
  if (_.has(user, 'organisations') || _.has(user, 'groups')) authorisationsService.updateAbilities(user)
  return hook
}
