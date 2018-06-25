import { iff, iffElse, when } from 'feathers-hooks-common'
import { hooks as coreHooks } from 'kCore'
import { hooks as teamHooks } from 'kTeam'
import { hooks as notifyHooks } from 'kNotify'
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
    find: [],
    get: [],
    create: [
      iff(hook => !hook.result.sponsor, notifyHooks.sendVerificationEmail),
      notifyHooks.removeVerification,
      iffElse(hook => hook.result.sponsor, teamHooks.joinOrganisation, teamHooks.createPrivateOrganisation)
    ],
    update: [],
    patch: [],
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
      notifyHooks.unregisterDevices
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
