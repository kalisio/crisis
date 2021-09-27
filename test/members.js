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
  const xpath=`(//div[@id="role-field"]//div[@role="radio"])[${role}]`
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
    debug(`Navigating to members activity`)
    await core.expandCard(page, organisationComponent, organisation)
    await core.clickItemAction(page, organisationComponent, organisation, 'organisation-members', wait)
  } 
}

export async function countMembers (page, organisation) {
  await goToMembersActivity(page, organisation)
  return core.countItems(page, memberComponent)
}

export async function memberExists (page, organisation, member) {
  await goToMembersActivity(page, organisation)
  return core.itemExists(page, memberComponent, member.name)
}

export async function memberActionExists (page, organisation, member, action) {
  await goToMembersActivity(page, organisation)
  return core.itemActionExists(page, memberComponent, member.name, action)
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

export async function reissueMemberInvitation (page,  organisation, member) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'reissue-invitation')
  await core.type(page, '#email-field', member.email)
  await core.click(page, '.q-dialog button:nth-child(2)')
}

export async function removeMember (page,  organisation, member, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'remove-member')
  await core.click(page, '.q-dialog button:nth-child(2)', wait)
}

export async function addTag (page, organisation, member, tag, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'edit-item-tags', 500)
  await core.type(page, '#tags-field',tag, true, 500)
  await core.clickAction(page, 'apply-button', wait)
}

export async function removeTag (page, organisation, member, tag, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'edit-item-tags', 500)
  const xpath = `//div[contains(@class, "q-dialog")]//div[contains(@class, "q-chip row") and contains(., "${tag}")]//i`
  const elements = await page.$x(xpath)
  if (elements.length > 0) {
    elements[0].click()
    await page.waitForTimeout(1000)
  }
  await core.clickAction(page, 'apply-button', wait)
}

export async function joinGroup (page, organisation, group, member, permissions, wait = 2000) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'join-group')
  await core.type(page, '#group-field', group.name)
  await core.click(page, `#${_.kebabCase(group.name)}`)
  await core.clickSelect(page, '#role-field', `#${permissions}`)
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
    const xpath=`(//div[contains(@class,"q-menu")]//div[@role="checkbox"])[${i + 1}]`
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