import _ from 'lodash'
import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const debug = makeDebug('aktnmap:test:tags')

const organisationComponent = 'OrganisationCard'
export const planComponent = 'PlanCard'

export const planTemplateComponent = 'PlanTemplateCard'

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
    // TODO
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
    if (template.coordinators) await core.type(page, '#coordinators-field', template.coordinators)
    //if (template.permission) await clickPermission(page, template.permission)
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