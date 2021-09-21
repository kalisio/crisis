import { core } from '@kalisio/kdk/test.client'

const organisationComponent = 'OrganisationCard'

export async function goToOrganisationsActivity (page, wait = 2000) {
  const url = page.url()
  if (!url.includes('organisations')) await core.clickLeftPaneAction(page, 'my-organisations', wait)
}

export async function countOrganisations (page) {
  await goToOrganisationsActivity(page)
  return core.countItems(page, organisationComponent)
}

export async function organisationExists (page, name) {
  await goToOrganisationsActivity(page)
  return core.itemExists(page, organisationComponent, name)
}

export async function createOrganisation (page, name, description, wait = 1000) {
  await goToOrganisationsActivity(page)
  await core.clickAction(page, 'create-organisation')
  await core.type(page, '#name-field', name)
  await core.type(page, '#description-field', description)
  await core.clickAction(page, 'apply-button', wait)
}

export async function deleteOrganisation (page, name, wait = 1000) {
  await goToOrganisationsActivity(page)
  await core.expandCard(page, organisationComponent, name)
  await core.clickItemAction(page, organisationComponent, name, 'remove-item-header')
  await core.type(page, '.q-dialog input', name)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editOrganisationBilling (page, name, wait = 1000) {
  await goToOrganisationsActivity(page)
  await core.expandCard(page, organisationComponent, name)
  await core.clickItemAction(page, organisationComponent, name, 'edit-billing', wait)
}
