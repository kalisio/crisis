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

export async function organisationExists (page, organisation) {
  await goToOrganisationsActivity(page)
  return core.itemExists(page, organisationComponent, organisation.name)
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
  await core.type(page, '.q-dialog input', organisation.name)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editOrganisationBilling (page, organisation, wait = 1000) {
  await goToOrganisationsActivity(page)
  await core.expandCard(page, organisationComponent, organisation.name)
  await core.clickItemAction(page, organisationComponent, organisation.name, 'edit-billing', wait)
}
