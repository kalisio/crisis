import _ from 'lodash'
import makeDebug from 'debug'
import { core } from './kdk/index.mjs'
import { goToOrganisationsActivity } from './organisations.mjs'

const debug = makeDebug('crisis:test:events')

const organisationComponent = 'OrganisationCard'
export const eventComponent = 'EventCard'
export const eventLogComponent = 'EventLogItem'
export const eventTemplateComponent = 'EventTemplateCard'

export async function clickPermission (page, permission, wait = 250) {
  let index = 1
  if (permission === 'manager') index = 2
  if (permission === 'owner') index = 3
  const xpath = `//*[@id="permission-field"]/div[${index}]/div`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await core.waitForTimeout(wait)
  }
}

export async function goToEventsActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('events')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    debug('Navigating to events activity')
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-events', wait)
  }
}

export async function goToEventLogs (page, organisation, event, wait = 2000) {
  await goToEventsActivity(page, organisation)
  await core.clickItemAction(page, eventComponent, event.name, 'event-logs', wait)
}

export async function closeEventLogs (page, wait = 2000) {
  await core.click(page, '.q-dialog #close-action', wait)
}

export async function goToEventMap (page, organisation, event, wait = 2000) {
  await goToEventsActivity(page, organisation)
  await core.clickItemAction(page, eventComponent, event.name, 'event-map', wait)
}

export async function closeEventMap (page, wait = 2000) {
  await core.clickPaneAction(page, 'top', 'back', wait)
}

export async function goToEventTemplatesActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('event-templates')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    debug('Navigating to event templates activity')
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-event-templates', wait)
  }
}

export async function countEvents (page, organisation) {
  await goToEventsActivity(page, organisation)
  const count = await core.countItems(page, eventComponent)
  return count
}

export async function countEventLogs (page, organisation, event) {
  const count = await core.countItems(page, eventLogComponent)
  return count
}

export async function countEventTemplates (page, organisation) {
  await goToEventTemplatesActivity(page, organisation)
  const count = await core.countItems(page, eventTemplateComponent)
  return count
}

export async function eventExists (page, organisation, event, property) {
  await goToEventsActivity(page, organisation)
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, eventComponent, property ? _.get(event, property) : event)
  return exists
}

export async function eventLogExists (page, organisation, event, eventLog, property) {
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, eventLogComponent, property ? _.get(eventLog, property) : eventLog)
  return exists
}

export async function eventTemplateExists (page, organisation, template, property) {
  await goToEventTemplatesActivity(page, organisation)
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, eventTemplateComponent, property ? _.get(template, property) : template)
  return exists
}

export async function eventActionExists (page, organisation, event, action) {
  await goToEventsActivity(page, organisation)
  const exists = await core.itemActionExists(page, eventComponent, event.name, action)
  return exists
}

export async function eventLogActionExists (page, organisation, event, eventLog, action) {
  const exists = await core.itemActionExists(page, eventLogComponent, eventLog.name, action)
  return exists
}

export async function eventTemplateActionExists (page, organisation, template, action) {
  await goToEventTemplatesActivity(page, organisation)
  const exists = await core.itemActionExists(page, eventTemplateComponent, template.name, action)
  return exists
}

export async function createEvent (page, organisation, template, event, wait = 2000) {
  await goToEventsActivity(page, organisation)
  // Open FAB if it does exist
  const fab = await core.elementExists(page, '#fab')
  if (fab) await core.clickAction(page, 'fab')
  await core.clickAction(page, `create-${_.kebabCase(template.name)}`)
  // We can use default setup from template or override
  if (event.name) await core.type(page, '#name-field', event.name, false, true)
  if (event.description) await core.type(page, '#description-field', event.description, false, true)
  // Geolocate on map by default
  core.click(page, '#geolocate')
  if (event.participants) {
    for (let i = 0; i < event.participants.length; i++) {
      const participant = event.participants[i]
      await core.type(page, '#participants-field', participant.name)
      await core.click(page, `#${_.kebabCase(participant.name)}`)
    }
  }
  if (event.coordinators) {
    for (let i = 0; i < event.coordinators.length; i++) {
      const coordinators = event.coordinators[i]
      await core.type(page, '#coordinators-field', coordinators.name)
      await core.click(page, `#${_.kebabCase(coordinators.name)}`)
    }
  }
  await core.clickAction(page, 'apply-button', wait)
}

export async function createEventTemplate (page, organisation, template, wait = 2000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickAction(page, 'create-event-template')
  // We can use default setup from template or override
  await core.type(page, '#name-field', template.name)
  if (template.description) await core.type(page, '#description-field', template.description)
  if (template.permission) await clickPermission(page, template.permission)
  // Set expiry duration
  await core.click(page, '#expiryDuration-field')
  const xpath = `//*[@id="${template.expiryDuration}"]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await core.waitForTimeout(wait)
  }
  await core.clickAction(page, 'apply-button', wait)
}

export async function createEventTemplateWorkflow (page, organisation, template, wait = 2000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'add-item-workflow')
  for (let i = 0; i < template.workflow.length; i++) {
    const step = template.workflow[i]
    await core.type(page, '#title-field', step.title)
    if (step.stakeholder) await core.clickSelect(page, '#stakeholder-field', `#${step.stakeholder}`)
    if (step.description) await core.type(page, '#description-field', step.description)
    const interactions = _.get(step, 'interactions', [])
    for (let j = 0; j < interactions.length; j++) {
      const interaction = interactions[j]
      const xpath = '//input[@id="interaction-field"]'
      const elements = await page.$x(xpath)
      if (elements.length > 0) {
        elements[0].type(interaction)
        await core.waitForTimeout(wait)
        await page.keyboard.press('Enter')
      }
    }
    const ends = _.get(step, 'end', [])
    await core.clickSelect(page, '#end-field', ends.map(end => `#${_.kebabCase(end)}`))
    // Jump to next step
    if (i < template.workflow.length - 1) {
      await core.click(page, '#add-step')
    }
  }
  await core.clickAction(page, 'apply-button', wait)
}

export async function editEventName (page, organisation, event, name, wait = 2000) {
  await goToEventsActivity(page, organisation)
  await core.clickItemAction(page, eventComponent, event.name, 'edit-item-header')
  await core.type(page, '#name-field', name, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editEventTemplateName (page, organisation, template, name, wait = 2000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'edit-item-header')
  await core.type(page, '#name-field', name, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editEventDescription (page, organisation, event, description, wait = 2000) {
  await goToEventsActivity(page, organisation)
  await core.clickItemAction(page, eventComponent, event.name, 'edit-item-description')
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editEventTemplateDescription (page, organisation, template, description, wait = 2000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'edit-item-description')
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editEventTemplateWorkflow (page, organisation, template, description, wait = 2000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'edit-item-workflow')
  for (let i = 0; i < template.workflow.length; i++) {
    const step = template.workflow[i]
    await core.type(page, '#title-field', step.title, false, true)
    if (step.description) await core.type(page, '#description-field', step.description, false, true)
    // Remove last
    for (let j = 0; j < step.lastInteractionsLength; j++) {
      const xpath = '//div[@id="chip-0"]//i[contains(@role, "button")]'
      const elements = await page.$x(xpath)
      if (elements.length > 0) {
        elements[0].click()
        await core.waitForTimeout(wait)
      }
    }
    // Update interaction
    const interactions = _.get(step, 'interactions', [])
    for (let j = 0; j < interactions.length; j++) {
      const interaction = interactions[j]
      const xpath = '//input[@id="interaction-field"]'
      const elements = await page.$x(xpath)
      if (elements.length > 0) {
        elements[0].type(interaction)
        await core.waitForTimeout(wait)
        await page.keyboard.press('Enter')
      }
    }
    const ends = _.get(step, 'end', [])
    for (let j = 0; j < ends.length; j++) {
      await core.clickSelect(page, '#end-field', `#${_.kebabCase(ends[j])}`)
    }
    // Jump to next step
    if (i < template.workflow.length - 1) {
      await core.click(page, '#next-step')
    }
  }
  await core.clickAction(page, 'apply-button', wait)
}

export async function logEventStep (page, organisation, event, step, wait = 2000) {
  await goToEventsActivity(page, organisation)
  await core.clickItemAction(page, eventComponent, event.name, 'follow-up')
  await core.clickSelect(page, '#interaction-field', `#${step.value}`)
  if (step.comment) await core.type(page, '#comment-field', step.comment)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function logParticipantEventStep (page, organisation, event, member, step, wait = 2000) {
  await core.clickItemAction(page, eventLogComponent, member.name, 'follow-up', wait)
  await core.clickSelect(page, '#interaction-field', `#${step.value}`)
  if (step.comment) await core.type(page, '#comment-field', step.comment)
  await core.click(page, '#apply-button', wait)
}

export async function removeEvent (page, organisation, event, wait = 2000) {
  await goToEventsActivity(page, organisation)
  await core.expandCard(page, eventComponent, event.name)
  await core.clickItemAction(page, eventComponent, event.name, 'remove-item-header')
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}

export async function removeEventTemplate (page, organisation, template, wait = 2000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'remove-item-header')
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}

export async function removeEventTemplateWorkflow (page, organisation, template, wait = 2000) {
  await goToEventTemplatesActivity(page, organisation)
  await core.clickItemAction(page, eventTemplateComponent, template.name, 'remove-item-workflow')
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}
