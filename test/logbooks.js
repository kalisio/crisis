import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const debug = makeDebug('aktnmap:test:tags')

const organisationComponent = 'OrganisationCard'

export const logbookComponent = 'ArchivedEventCard'
export const logbookActiveComponent = 'Opened'
export const logbookClosedComponent = 'Closed'

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

export async function countLogbookOpenedItems (page, organisation, wait = 2000) {
  await goToLogbook(page, organisation)
  page.waitForTimeout(wait)
  const count = await core.countLogbookItems(page, 'Opened')
  return count
}

export async function countLogbookClosedItems (page, organisation, wait = 2000) {
  await goToLogbook(page, organisation)
  page.waitForTimeout(wait)
  const count = await core.countLogbookItems(page, 'Closed')
  return count
}

/* export async function countLogbookEventsTest (page, organisation, status) {
  await goToLogbook(page, organisation)
  let componentStatus
  let countFunction
  if (status === 'opened') {
    componentStatus = 'Opened'
    countFunction = 'countLogbookItems'
  }
  else if (status === 'closed') {
    componentStatus = 'Closed'
    countFunction = 'countLogbookItems'
  }
  else if (status === 'all') {
    componentStatus = 'ArchivedEventCard'
    countFunction = 'countLogbookEvents'
  }
  const count = await core.countFunction(page, componentStatus)
  return count
} */
