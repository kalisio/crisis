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
    debug('Navigating to tags activity')
    await core.expandCard(page, organisationComponent, organisation, 2000)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-tags', wait)
  }
}

export async function countTags (page, organisation) {
  await goToTagsActivity(page, organisation)
  const count = await core.countItems(page, tagComponent)
  return count
}

export async function tagExists (page, organisation, tag) {
  await goToTagsActivity(page, organisation)
  const exists = await core.itemExists(page, tagComponent, tag.value)
  return exists
}

export async function tagActionExists (page, organisation, tag, action) {
  await goToTagsActivity(page, organisation)
  const exists = await core.itemActionExists(page, tagComponent, tag.value, action)
  return exists
}

export async function canEditTag (page, organisation, tag) {
  await goToTagsActivity(page, organisation)
  const exists = await tagActionExists(page, organisation, tag, 'edit-item-header')
  return exists
}

export async function editTag (page, organisation, tag, value, icon = null, wait = 1000) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'edit-item-header', 1000)
  await core.type(page, '#value-field', value, false, true)
  if (icon) {
    await core.clickAction(page, 'icon-chooser-button')
    await core.chooseIcon(page, icon.name, icon.color)
  } else {
    const clearXPath = '(//div[contains(@class, "q-dialog")]//i[contains(@class, "cursor-pointer")])[2]'
    const elements = await page.$x(clearXPath)
    if (elements.length > 0) {
      elements[0].click()
    }
  }
  await core.click(page, '.q-dialog #apply-button', wait)
}

export async function editTagDescription (page, organisation, tag, description, wait = 1000) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'edit-item-description', 1000)
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '.q-dialog #apply-button', wait)
}

export async function listMembers (page, organisation, tag) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'list-members', 2000)
}
