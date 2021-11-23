import { setNow, populate } from 'feathers-hooks-common'
import { hooks } from '@kalisio/kdk/core.api'
import { addLogDefaults, sendStateNotifications, linkWithPreviousLog, updatePreviousLog, archive } from '../../hooks'

const populatePreviousLog = populate({
  schema: hook => {
    return {
      include: [
        { service: hook.service.getPath(true), nameAs: 'previous', parentField: 'previous', childField: '_id' }
      ]
    }
  }
})

const populateParticipant = populate({
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

module.exports = {
  before: {
    all: [hooks.convertObjectIDs(['participant', 'event'])],
    find: [],
    get: [],
    create: [setNow('createdAt'), addLogDefaults, linkWithPreviousLog],
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
  module.exports.after.all.push(archive)
}
