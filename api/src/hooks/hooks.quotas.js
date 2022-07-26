import _ from 'lodash'
import { hooks as coreHooks } from '@kalisio/kdk/core.api.js'
import { getOrgWithBilling } from './hooks.billing.js'

async function countItems (hook, service, org) {
  // Retrieve the target service
  const orgItemsService = (typeof service === 'object' ? service : hook.app.getService(service, org))
  // Indicate we'd only like to count
  const items = await orgItemsService.find({ query: { $limit: 0 } })
  return items.total + (hook.method === 'create' ? 1 : 0) // Take new item into account when required
}

function getItemsQuota (hook, service, org) {
  const quotas = hook.app.get('quotas')
  return _.get(quotas, _.get(org, 'billing.subscription.plan', 'bronze') + '.' + service, 1)
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
    orgs = _.filter(orgs, (org) => _.get(org, 'billing.subscription.plan', 'bronze') === 'bronze')
    return orgs.length + (hook.method === 'create' ? 1 : 0) // Take new org into account when required
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
    return countItems(hook, 'members', org)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, _.get(hook.params, 'resource._id'))
    return getItemsQuota(hook, 'members', org)
  }
})

export const checkInvitationsQuotas = coreHooks.countLimit({
  service: 'authorisations',
  count: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, _.get(hook.data, 'sponsor.organisationId'))
    return countItems(hook, 'members', org)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, _.get(hook.data, 'sponsor.organisationId'))
    return getItemsQuota(hook, 'members', org)
  }
})

export const checkGroupsQuotas = coreHooks.countLimit({
  service: 'groups',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'groups', org)
  }
})

export const checkEventsQuotas = coreHooks.countLimit({
  service: 'events',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'events', org)
  }
})

export const checkEventTemplatesQuotas = coreHooks.countLimit({
  service: 'event-templates',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'event-templates', org)
  }
})

export const checkPlansQuotas = coreHooks.countLimit({
  service: 'plans',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'plans', org)
  }
})

export const checkPlanTemplatesQuotas = coreHooks.countLimit({
  service: 'plan-templates',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'plan-templates', org)
  }
})

export const checkAlertsQuotas = coreHooks.countLimit({
  service: 'alerts',
  count: async (hook) => {
    return countItems(hook, hook.service)
  },
  max: async (hook) => {
    // Retrieve the org with billing infos
    const org = await getOrgWithBilling(hook, hook.service.getContextId())
    return getItemsQuota(hook, 'alerts', org)
  }
})

export const checkSubscriptionQuotas = async (hook) => {
  const services = ['members', 'groups', 'events', 'event-templates', 'plans', 'plan-templates', 'alerts']
  const quotaHooks = []
  services.forEach(service => {
    quotaHooks.push(coreHooks.countLimit({
      service,
      count: async (hook) => {
        // Retrieve the org with billing infos, when patching ID is not in data
        const org = Object.assign({ _id: hook.id }, hook.data)
        return countItems(hook, service, org)
      },
      max: async (hook) => {
        // Retrieve the org with billing infos, when patching ID is not in data
        const org = Object.assign({ _id: hook.id }, hook.data)
        return getItemsQuota(hook, service, org)
      }
    })(hook))
  })
  await Promise.all(quotaHooks)
  return hook
}
