import makeDebug from 'debug'
import _ from 'lodash'
import { core } from './kdk/index.mjs'
import { goToOrganisationsActivity } from './organisations.mjs'

const debug = makeDebug('crisis:test:tags')

const organisationComponent = 'OrganisationCard'
const tagComponent = 'team/KTagCard'

export async function goToTagsActivity (page, organisation, wait = 6000) {
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

export async function tagExists (page, organisation, tag, property = 'value') {
  await goToTagsActivity(page, organisation)
  const exists = await core.itemExists(page, tagComponent, _.get(tag, property))
  return exists
}

export async function tagActionExists (page, organisation, tag, action) {
  await goToTagsActivity(page, organisation)
  const exists = await core.itemActionExists(page, tagComponent, tag.value, action)
  return exists
}

export async function canCreateTag (page, organisation) {
  await goToTagsActivity(page, organisation)
  const exists = await core.elementExists(page, '#create-tag')
  return exists
}

export async function createTag (page, organisation, tag, wait = 1000) {
  await goToTagsActivity(page, organisation)
  await core.clickAction(page, 'create-tag')
  await core.type(page, '#value-field', tag.value)
  if (tag.description) await core.type(page, '#description-field', tag.description)
  await core.clickAction(page, 'apply-button', wait)
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
    const elements = await page.$$('xpath/.' + clearXPath)
    if (elements.length > 0) {
      elements[0].click()
    }
  }
  await core.click(page, '#apply-button', wait)
}

export async function editTagDescription (page, organisation, tag, description, wait = 1000) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'edit-item-description', 1000)
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '.q-dialog #apply-button', wait)
}

export async function goToTagMembersActivity (page, organisation, tag, wait = 6000) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'list-members', wait)
}

export async function removeTag (page, organisation, tag, wait = 1000) {
  await goToTagsActivity(page, organisation)
  await core.clickItemAction(page, tagComponent, tag.value, 'remove-item-header')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}
