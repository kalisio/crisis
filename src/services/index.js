import logger from 'loglevel'
import kCore, { LocalSettingsService } from '@kalisio/kdk-core/client'
import kTeam from '@kalisio/kdk-team/client'
import kNotify from '@kalisio/kdk-notify/client'
import kMap from '@kalisio/kdk-map/client.map'
import kBilling from '@kalisio/kdk-billing/client'
import usersHooks from './users.hooks'

export default function () {
  const api = this

  // Set up our plugin services
  try {
    api.configure(kCore)
    // Add hooks to automatically check uniqueness when creating a new user
    api.getService('users').hooks(usersHooks)
    api.configure(kTeam)
    api.configure(kNotify)
    api.configure(kMap)
    api.configure(kBilling)
    api.declareService('catalog', { context: true })
    api.declareService('features', { context: true })
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
        restoreView: 'restore.view'
      }
    })
    // Restore previous settings if any
    settingsService.restoreSettings()
  } catch (error) {
    logger.error(error.message)
  }
}
