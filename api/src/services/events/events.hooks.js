import _ from 'lodash'
import { hooks as coreHooks } from '@kalisio/kdk/core.api'
import { hooks as mapHooks } from '@kalisio/kdk/map.api'
import { iff, setNow, discard, populate } from 'feathers-hooks-common'
import { addCreatorAsCoordinator, processNotification, sendEventNotifications, checkEventsQuotas } from '../../hooks'

const populateAlert = populate({
  schema: hook => {
    const alertsService = hook.app.getService('alerts', hook.service.context)
    return {
      include: [
        {
          service: alertsService.getPath(true),
          nameAs: 'alert',
          parentField: 'alert',
          childField: '_id'
        }
      ]
    }
  }
})

module.exports = {
  before: {
    all: [coreHooks.convertObjectIDs(['layer', 'feature', 'alert'])],
    find: [mapHooks.marshallSpatialQuery],
    get: [],
    // Because expireAt comes from client convert it to Date object
    create: [checkEventsQuotas, processNotification, addCreatorAsCoordinator, setNow('createdAt', 'updatedAt'), coreHooks.convertDates(['expireAt'])],
    update: [processNotification, discard('createdAt', 'updatedAt'), setNow('updatedAt'), coreHooks.convertDates(['expireAt'])],
    patch: [processNotification, discard('createdAt', 'updatedAt'), setNow('updatedAt'), coreHooks.convertDates(['expireAt'])],
    remove: [processNotification]
  },

  after: {
    all: [],
    find: [mapHooks.asGeoJson({
      longitudeProperty: 'location.longitude',
      latitudeProperty: 'location.latitude'
    })],
    // When event is generateds from an alert populate the source
    get: [iff(hook => _.get(hook, 'result.alert'), populateAlert)],
    create: [sendEventNotifications],
    update: [sendEventNotifications],
    patch: [sendEventNotifications],
    // Because the notification ID is based on created/updated time we need to update it even on remove
    remove: [setNow('updatedAt'),
      sendEventNotifications/*, Because we can archive events we don't actually remove attachments so that it remain reachable
      coreHooks.removeAttachments('attachments')*/
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
