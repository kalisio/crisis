import { iff, iffElse, when } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api'
import { checkInvitationsQuotas } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [when(hook => hook.data.sponsor, checkInvitationsQuotas),
      coreHooks.addVerification,
      coreHooks.convertDates(['expireAt'])],
    update: [coreHooks.convertDates(['expireAt'])],
    patch: [coreHooks.convertDates(['expireAt'])],
    remove: [coreHooks.preventRemoveUser]
  },

  after: {
    all: [],
    find: [coreHooks.removeVerification],
    get: [coreHooks.removeVerification],
    create: [
      iff(hook => !hook.result.sponsor, coreHooks.sendVerificationEmail),
      iffElse(hook => hook.result.sponsor, coreHooks.joinOrganisation, coreHooks.createPrivateOrganisation),
      coreHooks.removeVerification
    ],
    update: [coreHooks.removeVerification],
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
