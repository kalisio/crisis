import _ from 'lodash'
import makeDebug from 'debug'
import { Forbidden } from '@feathersjs/errors'
import { hooks } from '@kalisio/kdk/core.api'
import { permissions } from '@kalisio/kdk/core.common'

const debug = makeDebug('aktnmap:billing:hooks')

export async function getOrgWithBilling (hook, id) {
  const orgService = hook.app.getService('organisations')
  const org = await orgService.get(id.toString(), { query: { $select: ['_id', 'name', 'billing'] } })
  return org
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
    const subjects = hook.params.subjects.filter(subject => subject.email === customer)
    if ((subjects.length > 0) && (grantedRole < permissions.Roles.owner)) {
      const resourceName = org.name ? org.name : org._id.toString()
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

export function populateBillingObject (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'populateBillingObject\' hook should only be used as a \'before\' hook.')
  }
  return hooks.populateObject({ serviceField: 'billingObjectService', idField: 'billingObject', perspectiveField: 'billingPerspective', throwOnNotFound: true })(hook)
}

export function unpopulateBillingObject (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'unpopulateBillingObject\' hook should only be used as a \'after\' hook.')
  }
  return hooks.unpopulateObject({ serviceField: 'billingObjectService', idField: 'billingObject', perspectiveField: 'billingPerspective' })(hook)
}

export async function removeBilling (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeBilling\' hook should only be used as a \'after\' hook.')
  }

  const customer = _.get(hook.result, 'billing.customer', null)
  if (!_.isNil(customer)) {
    const billingObjectId = hook.result._id
    const billingObjectService = hook.service.path
    debug('Removing billing from object ' + billingObjectId + ' of service ' + billingObjectService)
    const billingService = hook.app.getService('billing')
    await billingService.remove(billingObjectId, {
      query: {
        action: 'customer'
      },
      billingObject: hook.result,
      patch: false,
      user: hook.params.user
    })
  }
  return hook
}

export async function preventUnverifiedUser (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'preventUnverifiedUser\' hook should only be used as a \'before\' hook.')
  }
  debug('Cheching if user is verified')
  if (_.isNil(hook.params.user)) {
    throw new Error('The \'preventUnverifiedUser\' must be able to access the \'user\' in \'params\'.')
  }
  const isVerified = _.get(hook.params.user, 'isVerified', false)
  if (!isVerified) {
    throw new Forbidden('Forrbiden access on service \'billing\': user must be verified')
  }
  return hook
}

export async function subscribeDefaultPlan (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'subscribeDefaultPlan\' hook should only be used as a \'after\' hook.')
  }
  const billingObjectId = hook.result._id
  const billingObjectService = hook.service.path
  debug('Subscribing object ' + billingObjectId + ' of service ' + billingObjectService + ' to default plan')
  const plans = _.get(hook.app.get('billing'), 'plans')
  if (_.isNil(plans)) {
    throw new Error('The \'subscribeDefaultPlan\' requires billing plans to be defined')
  }
  const defaultPlan = _.findKey(plans, { default: true })
  if (_.isNil(defaultPlan)) {
    throw new Error('The \'subscribeDefaultPlan\' requires a default billing plan to be defined')
  }
  const billingService = hook.app.getService('billing')
  await billingService.create({
    action: 'subscription',
    plan: defaultPlan,
    billingObject: billingObjectId,
    billingObjectService: billingObjectService,
    billingPerspective: 'billing'
  }, {
    user: hook.params.user
  })
  return hook
}
