import _ from 'lodash'
import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const organisationComponent = 'OrganisationCard'
export const eventComponent = 'EventCard'
export const eventTemplateComponent = 'EventTemplateCard'

export async function clickPermission (page, permissions, wait = 250) {
  let index = 0
  if (permissions === 'manager') index = 1
  if (permissions === 'owner') index = 2
  const xpath=`(//div[@id="role-field"]//div[@role="radio"])[${index}]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
  }
}

export async function goToEventsActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('events')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-events', wait)
  }
}

export async function goToEventTemplatesActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('event-templates')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-event-templates', wait)
  }
}

export async function countEvents (page, organisation) {
  await goToEventsActivity(page, organisation)
  return core.countItems(page, eventComponent)
}

export async function countEventTemplates (page, organisation) {
  await goToEventTemplatesActivity(page, organisation)
  return core.countItems(page, eventTemplateComponent)
}

export async function eventExists (page, organisation, event, property = 'name') {
  await goToEventsActivity(page, organisation)
  return core.itemExists(page, eventComponent, _.get(event, property))
}

export async function eventTemplateExists (page, organisation, template, property = 'name') {
  await goToEventTemplatesActivity(page, organisation)
  return core.itemExists(page, eventTemplateComponent, _.get(template, property))
}

export async function eventActionExists (page, organisation, event, action) {
  await goToEventsActivity(page, organisation)
  return core.itemActionExists(page, eventComponent, event.name, action)
}

export async function eventTemplateActionExists (page, organisation, template, action) {
  await goToEventTemplatesActivity(page, organisation)
  return core.itemActionExists(page, eventTemplateComponent, template.name, action)
}

export async function createEvent (page, organisation, event, template, wait = 1000) {
  await goToEventsActivity(page, organisation)
  await core.clickAction(page, 'fab')
  await core.clickAction(page, `create-${template.name}`)
  await core.type(page, '#name-field', event.name)
  if (event.description) await core.type(page, '#description-field', event.description)
  await core.clickAction(page, 'apply-button', wait)
}

export async function createEventTemplate (page, organisation, template, wait = 1000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickAction(page, 'create-event-template')
  await core.type(page, '#name-field', template.name)
  if (template.description) await core.type(page, '#description-field', template.description)
  if (template.permission) await clickPermission(page, template.permission)
  await core.clickAction(page, 'apply-button', wait)
}

export async function editEventName (page, organisation, event, name, wait = 1000) {
  await goToEventsActivity(page, organisation)
  await core.clickItemAction(page, eventComponent, event.name, 'edit-item-header')
  await core.type(page, '#name-field', name, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editEventTemplateName (page, organisation, template, name, wait = 1000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'edit-item-header')
  await core.type(page, '#name-field', name, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editEventDescription (page, organisation, event, description, wait = 1000) {
  await goToEventsActivity(page, organisation)
  await core.clickItemAction(page, eventComponent, event.name, 'edit-item-description')
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editEventTemplateDescription (page, organisation, template, description, wait = 1000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'edit-item-description')
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function removeEvent (page, organisation, event, wait = 1000) {
  await goToEventsActivity(page, organisation)
  await core.clickItemAction(page, eventComponent, event.name, 'remove-item-header')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function removeEventTemplate (page, organisation, template, wait = 1000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'remove-item-header')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

