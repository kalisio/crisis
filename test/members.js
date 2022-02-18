import _ from 'lodash'
import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const debug = makeDebug('aktnmap:test:members')

const organisationComponent = 'OrganisationCard'
export const memberComponent = 'team/KMemberCard'

export async function clickRole (page, permissions, wait = 250) {
  let role = 1
  if (permissions === 'manager') role = 2
  if (permissions === 'owner') role = 3
  const xpath = `(//div[@id="role-field"]//div[@role="radio"])[${role}]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(wait)
  }
}

export async function goToMembersActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('members')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page)
    debug('Navigating to members activity')
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-members', wait)
  }
}

export async function countMembers (page, organisation) {
  await goToMembersActivity(page, organisation)
  const count = await core.countItems(page, memberComponent)
  return count
}

export async function memberExists (page, organisation, member) {
  await goToMembersActivity(page, organisation)
  const exists = await core.itemExists(page, memberComponent, member.name)
  return exists
}

export async function memberActionExists (page, organisation, member, action) {
  await goToMembersActivity(page, organisation)
  const exists = await core.itemActionExists(page, memberComponent, member.name, action)
  return exists
}

export async function canEditMember (page, organisation, member) {
  // Do no take into account the join-group action as a group must exists
  let exists = await memberActionExists(page, organisation, member, 'edit-member-role')
  if (!exists) return false
  exists = await memberActionExists(page, organisation, member, 'remove-member')
  if (!exists) return false
  exists = await memberActionExists(page, organisation, member, 'edit-item-tags')
  return exists
}

export async function canReinviteGuest (page, organisation, guest) {
  const exists = await memberActionExists(page, organisation, guest, 'reissue-invitation')
  return exists
}

export async function canAddMember (page, organisation) {
  await goToMembersActivity(page, organisation)
  const exists = await core.elementExists(page, '#add-member')
  return exists
}

export async function addMember (page, organisation, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickAction(page, 'add-member')
  await core.type(page, '#email-field', member.email)
  await core.clickAction(page, 'continue-button', 500)
  await clickRole(page, member.permissions)
  await core.clickAction(page, 'add-button', wait)
}

export async function inviteMember (page, organisation, member, wait = 5000) {
  await goToMembersActivity(page, organisation)
  await core.clickAction(page, 'add-member')
  await core.type(page, '#email-field', member.email)
  await core.clickAction(page, 'continue-button', 500)
  await core.type(page, '#name-field', member.name)
  await clickRole(page, member.permissions)
  await core.clickAction(page, 'add-button', wait)
}

export async function reissueMemberInvitation (page, organisation, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'reissue-invitation')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function removeMember (page, organisation, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'remove-member')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function canEdit (page, organisation, member) {
  const exists = await core.elementExists(page, '')
  return exists
}

export async function editTags (page, organisation, member, tagsToAdd, tagsToRemove = [], wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'edit-item-tags', 500)
  for (const tag of tagsToRemove) {
    debug(`Remove tag ${tag.value}`)
    const xpath = `//div[contains(@class, "q-dialog")]//div[contains(@class, "q-chip row") and contains(., "${tag.value}")]//i`
    const elements = await page.$x(xpath)
    if (elements.length > 0) {
      elements[0].click()
      await page.waitForTimeout(500)
    }
  }
  for (const tag of tagsToAdd) {
    debug(`Add tag ${tag.value}`)
    await core.type(page, '#tags-field', tag.value, true, false, 500)
  }
  await core.clickAction(page, 'apply-button', wait)
}

export async function joinGroup (page, organisation, group, member, permissions, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'join-group')
  await core.type(page, '#group-field', group.name)
  await core.click(page, `#${_.kebabCase(group.name)}`)
  if (permissions === 'manager') {
    await core.click(page, '#role-field')
  }
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function leaveGroup (page, organisation, group, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, `${_.kebabCase(group.name)}-button`)
  await core.click(page, '#leave-group')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function filterMembers (page, organisation, filter, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickTopPaneAction(page, 'member-filter')
  const options = ['owner', 'manager', 'member', 'guest']
  for (let i = 0; i < options.length; ++i) {
    const xpath = `(//div[contains(@class,"q-menu")]//div[@role="checkbox"])[${i + 1}]`
    const elements = await page.$x(xpath)
    if (elements.length > 0) {
      const isCheckedHandle = await elements[0].getProperty('ariaChecked')
      const isChecked = (await isCheckedHandle.jsonValue() === 'true')
      const check = _.get(filter, options[i], false)
      if (check !== isChecked) elements[0].click()
    }
  }
  await core.clickTopPaneAction(page, 'member-filter', wait)
}
