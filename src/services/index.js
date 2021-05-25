import logger from 'loglevel'
import kCore, { LocalSettingsService } from '@kalisio/kdk/core.client'
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
    // Setup service for settings edition
    const settingsService = api.createService('settings', {
      service: LocalSettingsService,
      propertyMapping: {
        shortTime: 'timeFormat.time.short',
        longTime: 'timeFormat.time.long',
        shortDate: 'timeFormat.date.short',
        longDate: 'timeFormat.date.long',
        shortYear: 'timeFormat.year.short',
        longYear: 'timeFormat.year.long',
        utc: 'timeFormat.utc',
        location: 'locationFormat',
        restoreView: 'restore.view',
        restoreLayers: 'restore.layers',
        timelineStep: 'timeline.step',
        timeseriesSpan: 'timeseries.span'
      }
    })
    // Restore previous settings if any
    settingsService.restoreSettings()
  } catch (error) {
    logger.error(error.message)
  }
}
