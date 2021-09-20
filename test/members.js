import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

export async function goToMembersActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('members')) {
    await goToOrganisationsActivity(page)
    await core.expandCard(page, organisation)
    await core.clickCardAction(page, organisation, 'organisation-members')
    await page.waitForTimeout(wait)
  } 
}

export async function countMembers (page, organisation) {
  await goToMembersActivity(page, organisation)
  return core.countCards(page)
}

export async function memberExists (page, organisation, member) {
  await goToMembersActivity(page, organisation)
  return core.cardExists(page, member)
}

export async function removeMember (page,  organisation, member) {
  await goToMembersActivity(page, organisation)
  await core.clickCardAction(page, member, 'remove-member')
  await core.click(page, '.q-dialog button:nth-child(2)')
}