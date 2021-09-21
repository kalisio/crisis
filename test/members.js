import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const organisationComponent = 'OrganisationCard'
const memberComponent = 'team/KMemberCard'

export async function goToMembersActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('members')) {
    await goToOrganisationsActivity(page)
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-members')
    await page.waitForTimeout(wait)
  } 
}

export async function countMembers (page, organisation) {
  await goToMembersActivity(page, organisation)
  return core.countItems(page, memberComponent)
}

export async function memberExists (page, organisation, member) {
  await goToMembersActivity(page, organisation)
  return core.itemExists(page, memberComponent, member)
}

export async function removeMember (page,  organisation, member) {
  await goToMembersActivity(page, organisation)
  await core.clickitemAction(page, memberComponent, member, 'remove-member')
  await core.click(page, '.q-dialog button:nth-child(2)')
}