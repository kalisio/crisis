import _ from 'lodash'
import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const debug = makeDebug('aktnmap:test:tags')

const organisationComponent = 'OrganisationCard'

export const planTemplateComponent = 'PlanTemplateCard'

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

export async function createPlan (page, organisation, template, event, wait = 2000) {
  await goToPlansActivity(page, organisation)
  // Open FAB if it does exist
  const fab = await core.elementExists(page, '#fab')
  if (fab) await core.clickAction(page, 'fab')
  await core.clickAction(page, `create-${_.kebabCase(template.name)}`)
  // We can use default setup from template or override
  if (event.name) await core.type(page, '#name-field', event.name, false, true)
  if (event.description) await core.type(page, '#description-field', event.description, false, true)
  // Geolocate on map by default
  const xpath = '(//div[@id="location-input"]//div[@role="radio"])[2]'
  const locationElements = await page.$x(xpath)
  if (locationElements.length > 0) {
    locationElements[0].click()
  }
  if (event.participants) {
    for (let i = 0; i < event.participants.length; i++) {
      const participant = event.participants[i]
      await core.type(page, '#participants-field', participant.name)
      await core.click(page, `#${_.kebabCase(participant.name)}`)
    }
  }
  if (event.coordinators) {
    // TODO
  }
  await core.clickAction(page, 'apply-button', wait)
}

export async function createPlanTemplate (page, organisation, template, wait = 2000) {
    await goToPlanTemplatesActivity(page, organisation)
    await core.clickAction(page, 'expand-action')
    await core.clickAction(page, 'organisation-plan-templates')
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