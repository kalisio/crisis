import logger from 'loglevel'
import kCore from '@kalisio/kdk-core/client'
import kTeam from '@kalisio/kdk-team/client'
import kNotify from '@kalisio/kdk-notify/client'
import kMap from '@kalisio/kdk-map/client.map'
import kEvent from '@kalisio/kdk-event/client'
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
    api.configure(kEvent)
    api.configure(kBilling)
  } catch (error) {
    logger.error(error.message)
  }
}
