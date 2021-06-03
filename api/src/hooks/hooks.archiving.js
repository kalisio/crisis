import _ from 'lodash'
import { getItems } from 'feathers-hooks-common'

export async function archive (hook) {
  // Only applicable to write operations
  if ((hook.method === 'get' || hook.method === 'find')) return hook

  const service = hook.service
  const object = getItems(hook)
  const query = _.get(hook, 'params.query', {})
  const archivingService = hook.app.getService(`archived-${service.name}`, service.context)
  if (archivingService) {
    switch (hook.method) {
      case 'create':
        await archivingService.create(object)
        break
      case 'update':
        // Possible for batch-update
        if (Array.isArray(object)) {
          await archivingService.update(null, hook.data, { query })
        } else {
          await archivingService.update(object._id, object)
        }
        break
      case 'patch':
        // Possible for batch-patch
        if (Array.isArray(object)) {
          await archivingService.patch(null, hook.data, { query })
        } else {
          await archivingService.patch(object._id, object)
        }
        break
      case 'remove':
        // Possible for batch-remove
        if (Array.isArray(object)) {
          // Do not tag as deleted already tagged objects
          Object.assign(query, { deletedAt: { $exists: false } })
          await archivingService.patch(null, { deletedAt: new Date() }, { query })
        } else {
          await archivingService.patch(object._id, { deletedAt: new Date() })
        }
        break
    }
  }
  return hook
}
