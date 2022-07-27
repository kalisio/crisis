import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { addLogDefaults, sendStateNotifications, linkWithPreviousLog, updatePreviousLog, archive } from '../../hooks/index.js'

const populatePreviousLog = commonHooks.populate({
  schema: hook => {
    return {
      include: [
        { service: hook.service.getPath(true), nameAs: 'previous', parentField: 'previous', childField: '_id' }
      ]
    }
  }
})

const populateParticipant = commonHooks.populate({
  schema: hook => {
    const usersService = hook.app.getService('users')
    return {
      include: [
        {
          service: usersService.getPath(true),
          nameAs: 'participant',
          parentField: 'participant',
          childField: '_id',
          query: { $select: ['profile.name'] }
        }
      ]
    }
  }
})

const hooks = {
  before: {
    all: [coreHooks.convertObjectIDs(['participant', 'event'])],
    find: [],
    get: [],
    create: [commonHooks.setNow('createdAt'), addLogDefaults, linkWithPreviousLog],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [populatePreviousLog, populateParticipant],
    get: [],
    create: [updatePreviousLog, sendStateNotifications, populatePreviousLog, populateParticipant],
    update: [],
    patch: [],
    remove: []
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

// Add archiving feature
// This is only in dev/preprod mode, in prod this feature is managed by MongoDB Stitch
if (process.env.NODE_APP_INSTANCE !== 'prod') {
  hooks.after.all.push(archive)
}

export default hooks
