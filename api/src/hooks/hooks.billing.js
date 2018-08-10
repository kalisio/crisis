import _ from 'lodash'
import { Forbidden } from '@feathersjs/errors'
import { permissions } from 'kCore/common'

export async function getOrgWithBilling (hook, id) {
  const orgService = hook.app.getService('organisations')
  const org = await orgService.get(id.toString(), { query: { $select: ['_id', 'name', 'billing'] } })
  return org
}

export async function updatePlan (hook) {
  if (hook.type !== 'after') {
    throw new Error(`The 'updatePlan' hook should only be used as a 'after' hook.`)
  }
  const data = hook.data || {}
  const query = hook.params.query || {}
  const billingObjectId = data.billingObjectId || query.billingObjectId
  let plan = _.head(_.keys(hook.app.get('plans') || {}))
  if (hook.method === 'create') {
    plan = _.lowerCase(hook.result.plan.name)
  }
  const orgService = hook.app.getService('organisations')
  await orgService.patch(billingObjectId, { 'billing.plan': plan })

  return hook
}

export async function preventRemovingCustomer (hook) {
  // By pass check ?
  if (hook.params.force) return hook
  const params = hook.params
  const data = hook.data || {}
  const query = params.query || {}
  const grantedPermissions = data.permissions || query.permissions
  const grantedRole = (grantedPermissions ? permissions.Roles[grantedPermissions] : undefined)
  const resource = hook.params.resource

  if (resource && resource._id) {
    const org = (resource.billing ? resource : await getOrgWithBilling(hook, resource._id))
    const customer = _.get(org, 'billing.customer.email')
    // Check if we try to remove customer from the list of owners
    let subjects = hook.params.subjects.filter(subject => subject.email === customer)
    if ((subjects.length > 0) && (grantedRole < permissions.Roles.owner)) {
      let resourceName = org.name ? org.name : org._id.toString()
      throw new Forbidden('You are not allowed to remove the customer of resource ' + resourceName, {
        translation: {
          key: 'CANNOT_REMOVE_CUSTOMER',
          params: { resource: resourceName }
        }
      })
    }
  }

  return hook
}
