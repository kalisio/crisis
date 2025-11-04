import _ from 'lodash'
import { Theme, composables as kdkCoreComposables } from '@kalisio/kdk/core.client.js'

export function useOrganisations () {
  // Data
  const { Context, setContext, clearContext } = kdkCoreComposables.useContext({ fallbackRoute: 'organisations-activity' })

  // Functions
  async function setCurrentOrganisation (organisationId) {
    await setContext(organisationId)
    // Update the theme
    const color = _.get(Context.value, 'color')
    if (!_.isEmpty(color)) Theme.apply(color)
    else Theme.restore()
  }
  function clearCurrentOrganisation () {
    if (!Context.value) return
    clearContext()
    Theme.restore()
  }

  // Expose
  return {
    CurrentOrganisation: Context,
    setCurrentOrganisation,
    clearCurrentOrganisation
  }
}

export function useCurrentOrganisation () {
  const { Context } = kdkCoreComposables.useContext()

  // Expose
  return {
    CurrentOrganisation: readonly(Context)
  }
}
