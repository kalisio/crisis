import { iff, iffElse, when } from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kCore'
import { hooks as teamHooks } from '@kalisio/kTeam'
import { hooks as notifyHooks } from '@kalisio/kNotify'
import { checkInvitationsQuotas } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [ when(hook => hook.data.sponsor, checkInvitationsQuotas),
      notifyHooks.addVerification ],
    update: [],
    patch: [],
    remove: [ teamHooks.preventRemoveUser ]
  },

  after: {
    all: [],
    find: [ notifyHooks.removeVerification ],
    get: [ notifyHooks.removeVerification ],
    create: [
      iff(hook => !hook.result.sponsor, notifyHooks.sendVerificationEmail),
      iffElse(hook => hook.result.sponsor, teamHooks.joinOrganisation, teamHooks.createPrivateOrganisation),
      notifyHooks.removeVerification
    ],
    update: [ notifyHooks.removeVerification ],
    patch: [ notifyHooks.removeVerification ],
    remove: [
      coreHooks.setAsDeleted,
      coreHooks.removeAttachments('avatar'),
      notifyHooks.updateSubjectSubscriptions({
        field: 'tags',
        service: 'tags',
        subjectAsItem: true
      }),
      coreHooks.updateTags, // After unsubscriptions otherwise will remove topic of unused tags before it
      teamHooks.leaveOrganisations(),
      notifyHooks.unregisterDevices,
      notifyHooks.removeVerification
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
