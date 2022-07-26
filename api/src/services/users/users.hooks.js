import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { checkInvitationsQuotas } from '../../hooks/index.js'

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
        coreHooks.sendInvitationEmail,
        coreHooks.hashPassword()),
      coreHooks.addVerification,
      coreHooks.convertDates(['expireAt'])
    ],
    update: [commonHooks.disallow('external')],
    patch: [
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.preventChanges('organisations')),
      commonHooks.iff(commonHooks.isProvider('external'), commonHooks.preventChanges('groups')),
      coreHooks.convertDates(['expireAt'])
    ],
    remove: [coreHooks.preventRemoveUser]
  },

  after: {
    all: [],
    find: [coreHooks.removeVerification],
    get: [coreHooks.removeVerification],
    create: [
      commonHooks.iff(hook => !hook.result.sponsor, coreHooks.sendVerificationEmail),
      commonHooks.iffElse(hook => hook.result.sponsor, coreHooks.joinOrganisation, coreHooks.createPrivateOrganisation),
      coreHooks.removeVerification
    ],
    update: [],
    patch: [coreHooks.removeVerification],
    remove: [
      coreHooks.setAsDeleted,
      coreHooks.removeAttachments('avatar'),
      coreHooks.updateSubjectSubscriptions({
        field: 'tags',
        service: 'tags',
        subjectAsItem: true
      }),
      coreHooks.updateTags, // After unsubscriptions otherwise will remove topic of unused tags before it
      coreHooks.leaveOrganisations(),
      coreHooks.unregisterDevices,
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
