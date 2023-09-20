import _ from 'lodash'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'

export async function getOrgWithQuotas (hook, id) {
  const orgService = hook.app.getService('organisations')
  const org = await orgService.get(id.toString(), { query: { $select: ['_id', 'name', 'quotas'] } })
  return org
}

async function countItems (hook, service, org) {
  // Retrieve the target service
  const orgItemsService = (typeof service === 'object' ? service : hook.app.getService(service, org))
  // Indicate we'd only like to count
  const items = await orgItemsService.find({ query: { $limit: 0 } })
  return items.total + (hook.method === 'create' ? 1 : 0) // Take new item into account when required
}

function getItemsQuota (hook, service, org) {
  const quotas = hook.app.get('quotas')
  return _.get(org, `quotas.${service}`, _.get(quotas, service, 0))
}

export const checkOrganisationsQuotas = coreHooks.countLimit({
  service: 'organisations',
  count: async (hook) => {
    let orgs = _.get(hook, 'params.user.organisations', [])
    orgs = _.filter(orgs, (org) => org.permissions === 'owner')
    return orgs.length + (hook.method === 'create' ? 1 : 0) // Take new org into account when required
  },
  max: (hook) => {
    const appQuotas = hook.app.get('quotas')
    const userQuota = _.get(hook, 'params.user.quotas.organisations')
    return userQuota || _.get(appQuotas, 'organisations')
  }
})

export const checkMembersQuotas = coreHooks.countLimit({
  service: 'authorisations',
  count: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, _.get(hook.params, 'resource._id'))
    return countItems(hook, 'members', org)
  },
  max: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, _.get(hook.params, 'resource._id'))
    return getItemsQuota(hook, 'members', org)
  }
})

export const checkInvitationsQuotas = coreHooks.countLimit({
  service: 'authorisations',
  count: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, _.get(hook.data, 'sponsor.organisationId'))
    return countItems(hook, 'members', org)
  },
  max: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, _.get(hook.data, 'sponsor.organisationId'))
    return getItemsQuota(hook, 'members', org)
  }
})

export const checkGroupsQuotas = coreHooks.countLimit({
  service: 'groups',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'groups', org)
  }
})

export const checkEventsQuotas = coreHooks.countLimit({
  service: 'events',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'events', org)
  }
})

export const checkEventTemplatesQuotas = coreHooks.countLimit({
  service: 'event-templates',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'event-templates', org)
  }
})

export const checkPlansQuotas = coreHooks.countLimit({
  service: 'plans',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'plans', org)
  }
})

export const checkPlanTemplatesQuotas = coreHooks.countLimit({
  service: 'plan-templates',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'plan-templates', org)
  }
})

export const checkAlertsQuotas = coreHooks.countLimit({
  service: 'alerts',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with quotas infos
    const org = await getOrgWithQuotas(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'alerts', org)
  }
})
