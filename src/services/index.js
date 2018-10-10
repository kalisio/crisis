import logger from 'loglevel'
import kCore from '@kalisio/kCore/client'
import kTeam from '@kalisio/kTeam/client'
import kNotify from '@kalisio/kNotify/client'
import kMap from '@kalisio/kMap/client'
import kEvent from '@kalisio/kEvent/client'
import kBilling from '@kalisio/kBilling/client'
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
