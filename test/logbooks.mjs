import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client.js'
import { goToOrganisationsActivity } from './organisations.mjs'

const debug = makeDebug('crisis:test:tags')

const organisationComponent = 'OrganisationCard'
export const logbookComponent = 'ArchivedEventCard'
export const logbookBadgeComponent = 'QBadge'

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

export async function countLogbookEvents (page, organisation) {
  await goToLogbook(page, organisation)
  const count = await core.countItems(page, logbookComponent)
  return count
}

export async function countLogbookBadges (page, status) {
  const color = (status === 'Opened' ? 'bg-black' : 'bg-green')
  return core.countElements(page, `//div[contains(@component, "${logbookBadgeComponent}") and contains(@class, "${color}")]`)
}

export async function countLogbookOpenedEvents (page, organisation, wait = 2000) {
  await goToLogbook(page, organisation)
  page.waitForTimeout(wait)
  const count = await countLogbookBadges(page, 'Opened')
  return count
}

export async function countLogbookClosedEvents (page, organisation, wait = 2000) {
  await goToLogbook(page, organisation)
  page.waitForTimeout(wait)
  const count = await countLogbookBadges(page, 'Closed')
  return count
}
