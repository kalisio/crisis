import _ from 'lodash'
import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client.js'
import { goToOrganisationsActivity } from './organisations.mjs'

const debug = makeDebug('aktnmap:test:plans')

const organisationComponent = 'OrganisationCard'
export const planComponent = 'PlanCard'
export const eventComponent = 'EventCard'
export const planTemplateComponent = 'PlanTemplateCard'
export const objectiveComponent = 'PlanObjectiveItem'

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

export async function goToLogbook (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('archived-events')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    debug('Navigating to logbook archives')
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-archived-events', wait)
  }
}

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

export async function goToPlanEvents (page, organisation, plan, wait = 2000) {
  const url = page.url()
  if (!url.includes('events')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToPlansActivity(page, organisation)
    debug('Navigating to plan events')
    await core.clickItemAction(page, planComponent, plan, 'plan-events', wait)
  }
}

export async function planEventExists (page, organisation, plan, event, property) {
  await goToPlanEvents(page, organisation, plan)
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, eventComponent, property ? _.get(event, property) : event)
  return exists
}

export async function expandPlanEvent (page, event, wait = 2000) {
  // const url = page.url()
  await core.clickItemAction(page, eventComponent, event, 'expand-action', wait)
}

export async function closePlanEvent (page, event, wait = 2000) {
  // const url = page.url()
  await core.clickItemAction(page, eventComponent, event, 'remove-item-header', wait)
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

export async function removePlan (page, organisation, plan, wait = 2000) {
  await goToPlansActivity(page, organisation)
  await core.expandCard(page, planComponent, plan.name)
  await core.clickItemAction(page, planComponent, plan.name, 'remove-item-header')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function planExists (page, organisation, plan, property) {
  await goToPlansActivity(page, organisation)
  // Can provide an object with a property to match or a text input
  const exists = await core.itemExists(page, planComponent, property ? _.get(plan, property) : plan)
  return exists
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

// Problème à résoudre ici : on accède au formulaire, mais sans arriver à remplir les champs
export async function createPlanTemplateObjective (page, organisation, plan, objective, wait = 2000) {
  const url = page.url()
  if (!url.includes('objectives')) {
    await goToPlanTemplateObjectives(page, organisation)
    await core.clickItemAction(page, planTemplateComponent, plan, 'edit-objectives', wait)
    await core.type(page, '#name-field', 'test'/* objective.name */)
    if (objective.description) await core.type(page, '#description-field', 'test'/* objective.description */)
    await core.clickAction(page, 'add-plan-objective-button', wait)
  }
}

export async function countPlanObjectives (page, organisation, planTemplate) {
  await goToPlanTemplateObjectives(page, organisation, planTemplate)
  const count = await core.countItems(page, objectiveComponent)
  return count
}
