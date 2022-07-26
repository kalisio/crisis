import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
const { getItems } = commonHooks

export async function archive (hook) {
  // Only applicable to write operations
  if ((hook.method === 'get' || hook.method === 'find')) return hook

  const service = hook.service
  // Avoid polluting source object as we modify it
  const object = _.cloneDeep(getItems(hook))
  // Delete or anonymize required fields
  if (object && object.participants && Array.isArray(object.participants)) {
    object.participants.forEach(participant => {
      if (participant.email || participant.profile) {
        delete participant.name
        delete participant.email
        delete participant.profile
      }
    })
  }
  if (object && object.coordinators && Array.isArray(object.coordinators)) {
    object.coordinators.forEach(coordinator => {
      if (coordinator.email || coordinator.profile) {
        delete coordinator.name
        delete coordinator.email
        delete coordinator.profile
      }
    })
  }
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
