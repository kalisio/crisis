import commonHooks from 'feathers-hooks-common'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { addLogDefaults, sendEventLogPushNotifications, linkWithPreviousLog, updatePreviousLog, archive } from '../../hooks/index.js'

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
          query: { $select: ['profile.name', 'email'] }
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
    all: [archive],
    find: [populatePreviousLog, populateParticipant],
    get: [],
    create: [updatePreviousLog, sendEventLogPushNotifications, populatePreviousLog, populateParticipant],
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

export default hooks
