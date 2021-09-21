import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const organisationComponent = 'OrganisationCard'
const tagComponent = 'team/KTagCard'

export async function goToTagsActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('tags')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page)
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-tags', wait)
  } 
}

export async function countTags (page, organisation) {
  await goToTagsActivity(page, organisation)
  return core.countItems(page, tagComponent)
}

export async function tagExists (page, organisation, tag) {
  await goToMembersActivity(page, organisation)
  return core.itemExists(page, tagComponent, tag.name)
}
