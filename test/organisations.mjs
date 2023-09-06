import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client.js'

const debug = makeDebug('crisis:test:events')

export const organisationComponent = 'OrganisationCard'

export async function goToOrganisationsActivity (page, wait = 2000) {
  const url = page.url()
  if (!url.includes('organisations')) {
    debug('Navigating to organisations activity')
    await core.clickPaneAction(page, 'left', 'my-organisations')
  }
}

export async function countOrganisations (page) {
  await goToOrganisationsActivity(page)
  const count = await core.countItems(page, organisationComponent)
  return count
}

export async function organisationExists (page, organisation) {
  await goToOrganisationsActivity(page)
  const exists = await core.itemExists(page, organisationComponent, organisation.name)
  return exists
}

export async function createOrganisation (page, organisation, wait = 1000) {
  await goToOrganisationsActivity(page)
  await core.clickAction(page, 'create-organisation')
  await core.type(page, '#name-field', organisation.name)
  await core.type(page, '#description-field', organisation.description)
  await core.clickAction(page, 'apply-button', wait)
}

export async function deleteOrganisation (page, organisation, wait = 1000) {
  await goToOrganisationsActivity(page)
  await core.expandCard(page, organisationComponent, organisation.name)
  await core.clickItemAction(page, organisationComponent, organisation.name, 'remove-item-header')
  await core.type(page, '.q-dialog-plugin input', organisation.name)
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}
