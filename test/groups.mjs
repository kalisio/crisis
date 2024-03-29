import _ from 'lodash'
import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client.js'
import { goToOrganisationsActivity } from './organisations.mjs'

const debug = makeDebug('crisis:test:groups')

const organisationComponent = 'OrganisationCard'
export const groupComponent = 'team/KGroupCard'

export async function goToGroupsActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('groups')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page, wait)
    debug('Navigating to groups activity')
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-groups', wait)
  }
}

export async function countGroups (page, organisation) {
  await goToGroupsActivity(page, organisation)
  const count = await core.countItems(page, groupComponent)
  return count
}

export async function groupExists (page, organisation, group, property = 'name') {
  await goToGroupsActivity(page, organisation)
  const exists = await core.itemExists(page, groupComponent, _.get(group, property))
  return exists
}

export async function groupActionExists (page, organisation, group, action) {
  await goToGroupsActivity(page, organisation)
  const exists = await core.itemActionExists(page, groupComponent, group.name, action)
  return exists
}

export async function createGroup (page, organisation, group, wait = 1000) {
  await goToGroupsActivity(page, organisation)
  await core.clickAction(page, 'create-group')
  await core.type(page, '#name-field', group.name)
  if (group.description) await core.type(page, '#description-field', group.description)
  await core.clickAction(page, 'apply-button', wait)
}

export async function editGroupName (page, organisation, group, name, wait = 1000) {
  await goToGroupsActivity(page, organisation)
  await core.clickItemAction(page, groupComponent, group.name, 'edit-item-header')
  await core.type(page, '#name-field', name, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function editGroupDescription (page, organisation, group, description, wait = 1000) {
  await goToGroupsActivity(page, organisation)
  await core.clickItemAction(page, groupComponent, group.name, 'edit-item-description')
  await core.type(page, '#description-field', description, false, true)
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function removeGroup (page, organisation, group, wait = 1000) {
  await goToGroupsActivity(page, organisation)
  await core.clickItemAction(page, groupComponent, group.name, 'remove-item-header')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function goToGroupMembersActivity (page, organisation, group, wait = 2000) {
  await goToGroupsActivity(page, organisation)
  await core.clickItemAction(page, groupComponent, group.name, 'list-members', wait)
}
