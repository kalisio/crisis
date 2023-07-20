import {
  sendMediaPushNotifications, processNotification
} from '../../hooks/index.js'

export default {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
    completeMultipartUpload: [processNotification],
    putObject: [processNotification]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
    completeMultipartUpload: [sendMediaPushNotifications],
    putObject: [sendMediaPushNotifications]
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
