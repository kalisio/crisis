import makeDebug from 'debug'
import { getItems } from 'feathers-hooks-common'
const debug = makeDebug('aktnmap:plans:hooks')

export async function removeEventsPlan (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeEventsFromPlan\' hook should only be used as a \'after\' hook.')
  }
  const service = hook.service
  const object = getItems(hook)
  const eventsService = hook.app.getService('events', service.context)
  const response = await eventsService.find({ query: { plan: object._id }, $limit: 0 })
  if (response.total > 0) {
    await eventsService.remove(null, { query: { plan: object._id } })
  }
  return hook
}
