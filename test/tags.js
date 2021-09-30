import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const debug = makeDebug('aktnmap:test:tags')

const organisationComponent = 'OrganisationCard'
const tagComponent = 'team/KTagCard'

export async function goToTagsActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('tags')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page)
    debug(`Navigating to tags activity`)
    await core.expandCard(page, organisationComponent, organisation, 2000)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-tags', wait)
  } 
}

export async function countTags (page, organisation) {
  await goToTagsActivity(page, organisation)
  return core.countItems(page, tagComponent)
}

export async function tagExists (page, organisation, tag) {
  await goToTagsActivity(page, organisation)
  return core.itemExists(page, tagComponent, tag.value)
}

export async function tagActionExists (page, organisation, tag, action) {
  await goToTagsActivity(page, organisation)
  return core.itemActionExists(page, tagComponent, tag.value, action)
}

export async function canEditTag (page, organisation, tag) {
  await goToTagsActivity(page, organisation)
  return tagActionExists(page, organisation, tag, 'edit-item-header') 
}

export async function editTagValue (page, organisation, tag, value, wait = 1000) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'edit-item-header')
  await core.type(page, '#value-field', value, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editTagIcon (page, organisation, tag, icon, wait = 1000) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'edit-item-header')
  await core.clickAction(page, 'icon-chooser-button')
  await core.chooseIcon(page, icon.name, icon.color)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function listMembers (page, organisation, tag) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'list-members', 2000)
}