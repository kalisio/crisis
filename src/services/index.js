import _ from 'lodash'
import logger from 'loglevel'
import { memory } from '@feathersjs/memory'
import kdkCore from '@kalisio/kdk/core.client'
import kdkMap from '@kalisio/kdk/map.client.map'
import usersHooks from './users.hooks'

function siftMatcher (originalQuery) {
  // Filter out specific operators others than the reserved ones (starting by $),
  // which are already filtered by core matcher
  const keysToOmit = ['planAsObject']
  return _.omit(originalQuery, ...keysToOmit)
}

export default async function () {
  const api = this

  // Set up our plugin services
  try {
    await api.configure(kdkCore)
    // Declare our matcher
    api.registerMatcher(siftMatcher)
    // Add hooks to automatically check uniqueness when creating a new user
    api.getService('users').hooks(usersHooks)
    await api.configure(kdkMap)
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
    // We use an in-memory service to manage plan objectives so that we can use standard collection/form components,
    // although objectives are not autonomous objects but are stored in the plan object itself
    api.createService('plan-objectives', {
      service: memory({
        id: 'name',
        paginate: { default: 12 },
        matcher: api.matcher,
        filters: { $locale: true }
      })
    })
    // Restore previous settings if any
    const settingsService = api.getService('settings')
    if (settingsService) settingsService.restoreSettings()
  } catch (error) {
    logger.error(error.message)
  }
}
