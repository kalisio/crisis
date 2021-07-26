import logger from 'loglevel'
import memory from 'feathers-memory'
import kCore from '@kalisio/kdk/core.client'
import kMap from '@kalisio/kdk/map.client.map'
import usersHooks from './users.hooks'

export default function () {
  const api = this

  // Set up our plugin services
  try {
    api.configure(kCore)
    // Add hooks to automatically check uniqueness when creating a new user
    api.getService('users').hooks(usersHooks)
    api.configure(kMap)
    // Declare the built-in services, others are optional
    api.declareService('catalog', { context: true })
    api.declareService('features', { context: true })
    api.declareService('alerts', { context: true })
    api.declareService('events', { context: true })
    api.declareService('event-logs', { context: true })
    api.declareService('event-templates', { context: true })
    api.declareService('archived-events', { context: true })
    api.declareService('archived-event-logs', { context: true })
    api.declareService('plans', { context: true })
    api.declareService('plan-templates', { context: true })
    api.declareService('archived-plans', { context: true })
    api.declareService('billing')
    // We use an in-memory service to manage plan objectives so that we can use standard collection/form components,
    // although objectives are not autonomous objects but are stored in the plan object itself
    api.createService('plan-objectives', {
      service: memory({
        id: 'name',
        paginate: { default: 10 },
        matcher: api.matcher
      })
    })
  } catch (error) {
    logger.error(error.message)
  }
}
