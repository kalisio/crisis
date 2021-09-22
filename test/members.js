import _ from 'lodash'
import { core } from '@kalisio/kdk/test.client'
import { goToOrganisationsActivity } from './organisations'

const organisationComponent = 'OrganisationCard'
const memberComponent = 'team/KMemberCard'

export async function goToMembersActivity (page, organisation, wait = 2000) {
  const url = page.url()
  if (!url.includes('members')) {
    // We can pass an object or a name
    organisation = organisation.name || organisation
    await goToOrganisationsActivity(page)
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

export async function joinGroup (page, organisation, group, member, permissions) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'join-group')
  await core.type(page, '#group-field', group.name)
  await core.click(page, `#${_.kebabCase(group.name)}`)
  await core.clickSelect(page, '#role-field', `#${permissions}`)
  await core.click(page, '.q-dialog button:nth-child(2)')
}

export async function leaveGroup (page, organisation, group, member) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'group-button')
  await core.click(page, '#leave-group')
  await core.click(page, '.q-dialog button:nth-child(2)')
}

export async function reissueMemberInvitation (page,  organisation, member) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'reissue-invitation')
  await core.type(page, '#email-field', member.email)
  await core.click(page, '.q-dialog button:nth-child(2)')
}

export async function removeMember (page,  organisation, member) {
  await goToMembersActivity(page, organisation)
  await core.clickItemAction(page, memberComponent, member.name, 'remove-member')
  await core.click(page, '.q-dialog button:nth-child(2)')
}