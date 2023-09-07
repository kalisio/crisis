import _ from 'lodash'
import makeDebug from 'debug'
import { core } from '@kalisio/kdk/test.client.js'
import { goToOrganisationsActivity } from './organisations.mjs'

const debug = makeDebug('crisis:test:members')

const organisationComponent = 'OrganisationCard'
export const memberComponent = 'team/KMemberCard'

export async function clickRole (page, permissions, wait = 250) {
  let role = 1
  if (permissions === 'manager') role = 2
  if (permissions === 'owner') role = 3
  const xpath = `//*[@id="role-field"]/div[${role}]/div`
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
    organisation = organisation.name || organisation.owner.name || organisation
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
  exists = await memberActionExists(page, organisation, member, 'add-tag')
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
  await page.waitForTimeout(wait)
  await core.type(page, '#name-field', member.name)
  await clickRole(page, member.permissions)
  await core.clickAction(page, 'add-button', wait)
}

export async function reissueMemberInvitation (page, organisation, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'reissue-invitation')
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}

export async function removeMember (page, organisation, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'remove-member')
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}

export async function canEdit (page, organisation, member) {
  const exists = await core.elementExists(page, '')
  return exists
}

export async function joinGroup (page, organisation, group, member, permissions, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'join-group')
  await core.type(page, '#group-field', group.name)
  await core.click(page, `#${_.kebabCase(group.name)}`)
  if (permissions === 'manager') {
    await core.click(page, 'div#role-field.q-toggle')
  }
  await core.click(page, '#join-button', wait)
}

export async function leaveGroup (page, organisation, group, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, `${_.kebabCase(group.name)}-button`)
  await core.click(page, '#leave-group')
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}

export async function addTag (page, organisation, tag, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'add-tag')
  await core.type(page, '#tag-field', tag.value)
  await core.click(page, `#${_.kebabCase(tag.value)}`)
  await core.click(page, '#join-button', wait)
}

export async function removeTag (page, organisation, tag, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  const xpath = `//div[contains(@component, "${memberComponent}") and contains(., "${member.name}")]//div[@id="${_.kebabCase(tag.value)}-pane"]//i[contains(@role, "button")]`
  const elements = await page.$x(xpath)
  if (elements.length > 0) elements[0].click()
  await page.waitForTimeout(wait)
  await core.click(page, '.q-dialog-plugin button:nth-child(2)', wait)
}

export async function filterMembers (page, organisation, filter, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.click(page, '#member-filter', wait)
  const options = ['owner', 'manager', 'member', 'guest']
  for (let i = 0; i < options.length; ++i) {
    const xpath = `//*[@id="member-filter-popup"]/div/div[${i + 1}]/div`
    const elements = await page.$x(xpath)
    if (elements.length > 0) {
      const isCheckedHandle = await elements[0].getProperty('ariaChecked')
      const isChecked = (await isCheckedHandle.jsonValue() === 'true')
      const check = _.get(filter, options[i], false)
      if (check !== isChecked) elements[0].click()
    }
  }
  await core.click(page, '#member-filter', wait)
}
