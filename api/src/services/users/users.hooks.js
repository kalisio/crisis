import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { checkInvitationsQuotas, joinOrganisation, leaveOrganisations, sendInvitationEmail, preventRemoveUser } from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [
      commonHooks.when(hook => hook.data.sponsor,
        checkInvitationsQuotas,
        (hook) => {
          // Read invitation expiration from config if any
          const authConfig = hook.app.get('authentication')
          return coreHooks.setExpireAfter(authConfig.invitationExpireAfter || 2 * 24 * 60 * 60)(hook) // 48h in seconds
        },
        coreHooks.generatePassword({
          suggestedPasswordField: 'suggestedPassword'
        }),
        sendInvitationEmail,
        coreHooks.hashPassword('password')),
      coreHooks.addVerification,
      coreHooks.convertDates(['expireAt'])
    ],
    update: [commonHooks.disallow('external')],
    patch: [
      commonHooks.iff(commonHooks.isProvider('external'), coreHooks.preventChanges(false, ['organisations'])),
      commonHooks.iff(commonHooks.isProvider('external'), coreHooks.preventChanges(false, ['groups'])),
      coreHooks.convertDates(['expireAt'])
    ],
    remove: [preventRemoveUser]
  },

  after: {
    all: [],
    find: [coreHooks.removeVerification],
    get: [coreHooks.removeVerification],
    create: [
      commonHooks.iff(hook => !hook.result.sponsor, coreHooks.sendVerificationEmail),
      commonHooks.iff(hook => hook.result.sponsor, joinOrganisation),
      coreHooks.removeVerification
    ],
    update: [],
    patch: [coreHooks.removeVerification],
    remove: [
      coreHooks.setAsDeleted,
      coreHooks.removeAttachments('avatar'),
      leaveOrganisations(),
      coreHooks.removeVerification
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
