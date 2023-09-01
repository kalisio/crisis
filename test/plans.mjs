import _ from 'lodash'
import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client.js'
import { goToOrganisationsActivity } from './organisations.mjs'

const debug = makeDebug('crisis:test:plans')

const organisationComponent = 'OrganisationCard'
export const planComponent = 'PlanCard'
export const planTemplateComponent = 'PlanTemplateCard'
export const objectiveComponent = 'PlanObjectiveItem'
export const archivedEventComponent = 'ArchivedEventCard'
export const eventComponent = 'EventCard'
export const archivedPlanCard = 'ArchivedPlanCard'

export async function goToPlanTemplatesActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('plan-templates')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    debug('Navigating to plan templates activity')
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-plan-templates', wait)
  }
}

export async function goToPlansActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('plans')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    debug('Navigating to plans activity')
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-plans', wait)
  }
}

export async function clickPermission (page, permissions, wait = 250) {
  let role = 1
  if (permissions === 'manager') role = 2
  if (permissions === 'owner') role = 3
  const xpath = `//*[@id="permission-field"]/div[${role}]/div`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
  }
}

export async function createPlanTemplate (page, organisation, template, wait = 2000) {
  await goToPlanTemplatesActivity(page, organisation)
  await core.clickAction(page, 'create-plan-template')
  await core.type(page, '#name-field', template.name)
  if (template.description) await core.type(page, '#description-field', template.description)
  if (template.coordinators) {
    for (let i = 0; i < template.coordinators.length; i++) {
      const coordinators = template.coordinators[i]
      await core.type(page, '#coordinators-field', coordinators.name)
      await core.click(page, `#${_.kebabCase(coordinators.name)}`)
    }
  }
  if (template.permission) await clickPermission(page, template.permission)
  await core.clickAction(page, 'apply-button', wait)
}

export async function countPlanTemplates (page, organisation) {
  await goToPlanTemplatesActivity(page, organisation)
  const count = await core.countItems(page, planTemplateComponent)
  return count
}

export async function planTemplateExists (page, organisation, template, property) {
  await goToPlanTemplatesActivity(page, organisation)
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, planTemplateComponent, property ? _.get(template, property) : template)
  return exists
}

export async function editPlanTemplate (page, organisation, planTemplate, value, wait = 1000) {
  await goToPlanTemplatesActivity(page, organisation)
  await core.clickItemAction(page, planTemplateComponent, planTemplate.name, 'edit-item-header', 1000)
  await core.type(page, '#name-field', value, false, true)
  await core.click(page, '#apply-button', wait)
}

export async function editPlanTemplateDescription (page, organisation, planTemplate, description, wait = 1000) {
  await goToPlanTemplatesActivity(page, organisation)
  await core.clickItemAction(page, planTemplateComponent, planTemplate.name, 'edit-item-description', 1000)
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '#apply-button', wait)
}

export async function countPlans (page, organisation) {
  await goToPlansActivity(page, organisation)
  const count = await core.countItems(page, planComponent)
  return count
}

export async function createPlan (page, organisation, template, plan, wait = 2000) {
  await goToPlansActivity(page, organisation)
  // Open FAB if it does exist
  const fab = await core.elementExists(page, '#fab')
  if (fab) await core.clickAction(page, 'fab')
  await core.clickAction(page, `create-${_.kebabCase(template.name)}`)
  // We can use default setup from template or override
  if (plan.name) await core.type(page, '#name-field', plan.name, false, true)
  if (plan.description) await core.type(page, '#description-field', plan.description, false, true)
  if (plan.coordinators) {
    for (let i = 0; i < plan.coordinators.length; i++) {
      const coordinators = plan.coordinators[i]
      await core.type(page, '#coordinators-field', coordinators.name)
      await core.click(page, `#${_.kebabCase(coordinators.name)}`)
    }
  }
  await core.clickAction(page, 'apply-button', wait)
}

export async function planExists (page, organisation, plan, property) {
  await goToPlansActivity(page, organisation)
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, planComponent, property ? _.get(plan, property) : plan)
  return exists
}

export async function editPlan (page, organisation, plan, value, wait = 1000) {
  await goToPlansActivity(page, organisation)
  await core.clickItemAction(page, planComponent, plan.name, 'edit-item-header', 1000)
  await core.type(page, '#name-field', value, false, true)
  await core.click(page, '#apply-button', wait)
}

export async function editPlanDescription (page, organisation, plan, description, wait = 1000) {
  await goToPlansActivity(page, organisation)
  await core.clickItemAction(page, planComponent, plan.name, 'edit-item-description', 1000)
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '#apply-button', wait)
}

export async function closePlan (page, organisation, plan, wait = 2000) {
  await goToPlansActivity(page, organisation)
  await core.clickItemAction(page, planComponent, plan.name, 'remove-item-header')
  await page.waitForTimeout(wait)
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}

export async function closePlanEvent (page, organisation, plan, event, wait = 2000) {
  await goToPlanEvents(page, organisation, plan)
  await core.clickItemAction(page, eventComponent, event.name, 'expand-action', wait)
  await core.clickItemAction(page, eventComponent, event.name, 'remove-item-header', wait)
  await page.waitForTimeout(wait)
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}

export async function planArchivedEventExists (page, organisation, plan, event, property = 'name') {
  await goToPlanEvents(page, organisation, plan)
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, archivedEventComponent, property ? _.get(event, property) : event)
  return exists
}

export async function goToPlanEvents (page, organisation, plan, wait = 2000) {
  const url = page.url()
  if (!url.includes('events')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToPlansActivity(page, organisation)
    debug('Navigating to plan events')
    await core.clickItemAction(page, planComponent, plan.name, 'plan-events', wait)
  }
}

export async function goToObjectives (page, organisation, plan, from = 'plan', wait = 2000) {
  const url = page.url()
  if (url.includes('objectives')) return
  if (from === 'planTemplate') {
    await goToPlanTemplatesActivity(page, organisation, wait)
    await core.clickItemAction(page, planTemplateComponent, plan.name, 'edit-objectives', wait)
  } else {
    await goToPlansActivity(page, organisation, wait)
    await core.clickItemAction(page, planComponent, plan.name, 'edit-objectives', wait)
  }
}

export async function createPlanObjective (page, organisation, plan, objective, from, wait = 2000) {
  await goToObjectives(page, organisation, plan, from)
  if (await core.elementExists(page, '#add-plan-objective')) await core.click(page, '#add-plan-objective', wait)
  await core.type(page, '#name-field', objective.name)
  await core.type(page, '#description-field', objective.description)
  await core.clickAction(page, 'add-plan-objective-button', wait)
  await core.click(page, '#close-button')
}

export async function countPlanObjectives (page, organisation, plan, from) {
  await goToObjectives(page, organisation, plan, from)
  const count = await core.countItems(page, objectiveComponent)
  await core.click(page, '#close-button')
  return count
}

export async function goToArchivedPlans (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('archived-plans')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToPlansActivity(page, organisation)
    debug('Navigating to logbook archives')
    await core.clickItemAction(page, organisationComponent, organisation, 'archived-plans', wait)
  }
}

export async function planArchivedExists (page, organisation, plan, property = 'name') {
  await goToArchivedPlans(page, organisation)
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, archivedPlanCard, property ? _.get(plan, property) : plan)
  return exists
}

export async function canCreatePlan (page, organisation, template) {
  await goToPlansActivity(page, organisation)
  // Open FAB if it does exist
  let exists = await core.elementExists(page, '#fab')
  if (!exists) return exists
  await core.clickAction(page, 'fab')
  exists = await core.elementExists(page, `#create-${_.kebabCase(template.name)}`)
  return exists 
}

export async function canCreatePlanTemplate (page, organisation) {
  await goToPlanTemplatesActivity(page, organisation)
  const exists = await core.elementExists(page, '#create-plan-template')
  return exists
}

export async function planTemplateActionExists (page, organisation, planTemplate, action) {
  await goToPlanTemplatesActivity(page, organisation)
  const exists = await core.itemActionExists(page, planTemplateComponent, planTemplate.name, action)
  return exists
}
