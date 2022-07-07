import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const debug = makeDebug('aktnmap:test:tags')

const organisationComponent = 'OrganisationCard'

export const logbookComponent = 'ArchivedEventCard'
export const logbookActiveComponent = 'Opened'
export const logbookClosedComponent = 'Closed'

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

export async function createPlanTemplate (page, organisation, template, wait = 2000) {
    await goToPlanTemplatesActivity(page, organisation)
    await core.clickAction(page, 'create-plan-template')
    await core.type(page, '#name-field', template.name)
    if (template.description) await core.type(page, '#description-field', template.description)
    if (template.permission) await clickPermission(page, template.permission)
    await core.clickAction(page, 'apply-button', wait)
  }