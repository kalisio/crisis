import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const organisationComponent = 'OrganisationCard'
const groupComponent = 'team/KMemberCard'

export async function goToGroupsActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('groups')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-groups')
    await page.waitForTimeout(wait)
  }
}

export async function countGroups (page, organisation) {
  await goToGroupsActivity(page, organisation)
  return core.countItems(page, groupComponent)
}

export async function groupExists (page, organisation, group) {
  await goToGroupsActivity(page, organisation)
  return core.itemExists(page, groupComponent, group)
}

export async function createGroup (page, organisation, group, wait = 1000) {
  await goToGroupsActivity(page, organisation)
  await core.clickAction(page, 'create-group')
  await core.type(page, '#name-field', group.name)
  await core.type(page, '#description-field', group.description)
  await core.clickAction(page, 'apply-button', wait)
}

export async function removeGroup (page, organisation, group, wait = 1000) {
  await goToGroupsActivity(page, organisation)
  await core.clickItemAction(page, groupComponent, group.name, 'remove-item-header')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}
