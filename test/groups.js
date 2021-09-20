import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

export async function goToGroupsActivity (page, wait = 2000) {
  const url = page.url()
  if (!url.includes('groups')) {
    await goToOrganisationsActivity(page, wait)
    await core.expandCard(page, organisation)
    await core.clickCardAction(page, organisation, 'organisation-groups')
    await page.waitForTimeout(wait)
  }
}

export async function countGroups (page, organisation) {
  await goToGroupsActivity(page, organisation)
  return core.countCards(page)
}

export async function groupExists (page, organisation, group) {
  await goToGroupssActivity(page, organisation)
  return core.cardExists(page, group)
}
