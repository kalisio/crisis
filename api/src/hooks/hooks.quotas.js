import _ from 'lodash'
import { hooks as coreHooks } from 'kCore'

async function getOrgWithBilling(hook, id) {
  const orgService = hook.app.getService('organisations')
  const org = await orgService.get(id.toString(), { query: { $select: ['_id', 'billing'] } })
  return org
}

async function countMembers(hook, org) {
  // Retrieve the list of members
  const orgMembersService = hook.app.getService('members', org)
  // Indicate we'd only like to count
  let members = await orgMembersService.find({ query: { $limit: 0 } })
  return members.total + 1 // Take new member into account
}

function getMembersQuota(hook, org) {
  const quotas = hook.app.get('quotas')
  return _.get(quotas, _.get(org, 'billing.plan', 'bronze') + '.members', 1)
}

export const checkOrganisationsQuotas = coreHooks.countLimit({
  service: 'organisations',
  count: async (hook) => {
    let orgs = _.get(hook, 'params.user.organisations', [])
    orgs = _.filter(orgs, (org) => org.permissions === 'owner')
    // Retrieve the org with billing infos
    for (let i = 0; i < orgs.length; i++) {
      orgs[i] = await getOrgWithBilling(hook, orgs[i]._id)
    }
    // Then filter those with bronze plan
    orgs = _.filter(orgs, (org) => _.get(org, 'billing.plan', 'bronze') === 'bronze')
    return orgs.length + 1 // Take new org into account
  },
  max: (hook) => {
    const quotas = hook.app.get('quotas')
    return _.get(quotas, 'global.bronze', 1)
  }
})

export const checkMembersQuotas = coreHooks.countLimit({
  service: 'authorisations',
  count: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, _.get(hook.params, 'resource._id'))
    return countMembers(hook, org)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, _.get(hook.params, 'resource._id'))
    return getMembersQuota(hook, org)
  }
})

export const checkInvitationsQuotas = coreHooks.countLimit({
  service: 'authorisations',
  count: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, _.get(hook.data, 'sponsor.organisationId'))
    return countMembers(hook, org)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, _.get(hook.data, 'sponsor.organisationId'))
    return getMembersQuota(hook, org)
  }
})

