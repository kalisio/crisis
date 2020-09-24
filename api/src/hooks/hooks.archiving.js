import { getItems } from 'feathers-hooks-common'

export async function archive (hook) {
  const service = hook.service
  const object = getItems(hook)
  const archivingService = hook.app.getService(`archived-${service.name}`, service.context)
  if (archivingService) {
    switch (hook.method) {
      case 'create':
        await archivingService.create(object)
        break
      case 'update':
        await archivingService.update(object._id, object)
        break
      case 'patch':
        await archivingService.patch(object._id, object)
        break
      case 'remove':
        await archivingService.patch(object._id, { deletedAt: new Date() })
        break
    }
  }
  return hook
}
