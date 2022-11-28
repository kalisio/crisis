import makeDebug from 'debug'
import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import { Customer, Card, Subscription } from 'feathers-stripe'
import { BadRequest } from '@feathersjs/errors'

const debug = makeDebug('aktnmap:billing:service')

const propertiesToOmit = ['billingObject', 'billingObjectService', 'billingPerspective', 'action']

function toStripeCustomerData (data) {
  if (_.isNil(data.email)) throw new BadRequest('createCustomer: missing \'email\' parameter')
  return {
    email: data.email,
    description: _.get(data, 'description', ''),
    business_vat_id: _.get(data, 'vatNumber', '')
  }
}

export default function (name, app, options) {
  const config = app.get('billing')
  return {
    async createStripeSubscription (customerId, planId, billingMethod) {
      debug('create Stripe subscription to ' + planId + ' for ' + customerId + ' [billing method: ' + billingMethod + ']')
      const subscriptionService = app.service('billing/subscription')
      const stripeSubscriptionData = {
        customer: customerId,
        plan: planId,
        billing: billingMethod
      }
      if (billingMethod === 'send_invoice') stripeSubscriptionData.days_until_due = config.daysUntilInvoiceDue
      const stripeSubscription = await subscriptionService.create(stripeSubscriptionData)
      return stripeSubscription.id
    },
    async removeStripeSubscription (customerId, subscriptionId) {
      debug('remove Stripe subscription ' + subscriptionId + ' from ' + customerId)
      const subscriptionService = app.service('billing/subscription')
      await subscriptionService.remove(subscriptionId, { customer: customerId, stripe: {} })
    },
    async createStripeCard (customerId, token) {
      debug('create card ' + token + ' for customer ' + customerId)
      const cardService = app.service('billing/card')
      const card = await cardService.create({ source: token }, { customer: customerId })
      return { stripeId: card.id, brand: card.brand, last4: card.last4 }
    },
    async removeStripeCard (customerId, cardId) {
      debug('remove card from customer ' + customerId)
      const cardService = app.service('billing/card')
      await cardService.remove(cardId, { customer: customerId })
    },
    async updateStripeBillingMethod (subscriptionId, billingMethod) {
      debug('update billing for subscription ' + subscriptionId + ' with method ' + billingMethod)
      const subscriptionData = { billing: billingMethod }
      if (billingMethod === 'send_invoice') subscriptionData.days_until_due = config.daysUntilInvoiceDue
      const subscriptionService = app.service('billing/subscription')
      await subscriptionService.update(subscriptionId, subscriptionData)
    },
    async createCustomer (billingObject, data) {
      const billingObjectId = billingObject._id
      const stripeCustomerData = toStripeCustomerData(data)
      debug('create customer ' + stripeCustomerData.email)
      const customerService = app.service('billing/customer')
      const stripeCustomer = await customerService.create(stripeCustomerData)
      let customerObject = Object.assign({ stripeId: stripeCustomer.id }, _.omit(data, propertiesToOmit))
      if (!_.isNil(_.get(data, 'token', null))) {
        const card = await this.createStripeCard(stripeCustomer.id, data.token)
        customerObject = Object.assign(customerObject, { card: card })
      }
      const billingObjectService = app.getService(data.billingObjectService)
      await billingObjectService.patch(billingObjectId, { 'billing.customer': customerObject })
      return customerObject
    },
    async updateCustomer (billingObject, data) {
      const billingObjectId = billingObject._id
      const customerId = _.get(billingObject, 'billing.customer.stripeId')
      const stripeCustomerData = toStripeCustomerData(data)
      debug('update customer ' + customerId)
      const customerService = app.service('billing/customer')
      const stripeCustomer = await customerService.update(customerId, stripeCustomerData)
      let customerObject = Object.assign({ stripeId: customerId }, _.omit(data, propertiesToOmit))
      if (stripeCustomer.sources.total_count > 0) {
        // do we need to remove the card
        if (_.isNil(data.card)) {
          // Card has been removed
          await this.removeStripeCard(customerId, stripeCustomer.sources.data[0].id)
          // Update subscription if needed
          if (stripeCustomer.subscriptions.total_count > 0) {
            if (_.isNil(data.token)) await this.updateStripeBillingMethod(stripeCustomer.subscriptions.data[0].id, 'send_invoice')
          }
        }
        if (!_.isNil(data.token)) {
          // Card has been replaced
          if (!_.isNil(data.card)) await this.removeStripeCard(customerId, stripeCustomer.sources.data[0].id)
          const card = await this.createStripeCard(customerId, data.token)
          customerObject = Object.assign(customerObject, { card: card })
        }
      } else if (!_.isNil(data.token)) {
        // Card has been added
        const card = await this.createStripeCard(customerId, data.token)
        customerObject = Object.assign(customerObject, { card: card })
        // Update subscription if needed
        if (stripeCustomer.subscriptions.total_count > 0) {
          await this.updateStripeBillingMethod(stripeCustomer.subscriptions.data[0].id, 'charge_automatically')
        }
      }
      const billingObjectService = app.getService(data.billingObjectService)
      await billingObjectService.patch(billingObjectId, { 'billing.customer': customerObject })
      return customerObject
    },
    async removeCustomer (billingObject, query, patch) {
      const billingObjectId = billingObject._id
      const customerId = _.get(billingObject, 'billing.customer.stripeId')
      debug('remove customer: ' + customerId)
      const customerService = app.service('billing/customer')
      await customerService.remove(customerId)
      if (patch) {
        const billingObjectService = app.getService(query.billingObjectService)
        await billingObjectService.patch(billingObjectId, {
          'billing.customer': null,
          'billing.subscription': null,
          'billing.options': []
        })
      }
    },
    async createSubscription (billingObject, data) {
      const billingObjectId = billingObject._id
      // Subscribing a plan/option is similar for stripe
      const plan = _.get(data, 'plan')
      if (_.isNil(plan)) throw new BadRequest('createSubscription: missing \'plan\' parameter')
      const optionConfig = _.get(config, `options.${plan}`)
      const planConfig = _.get(config, `plans.${plan}`, optionConfig)
      debug('create subscripton for ' + billingObjectId + ' to plan/option ' + plan)
      const subscription = { plan }
      if (!_.isNil(planConfig.stripeId)) {
        const customerId = _.get(billingObject, 'billing.customer.stripeId')
        const customerCard = _.get(billingObject, 'billing.customer.card')
        if (_.isNil(customerId)) throw new BadRequest('updateSubscription: you must create a customer before subscribing to a product')
        let billingMethod = 'send_invoice'
        if (!_.isNil(customerCard)) billingMethod = 'charge_automatically'
        subscription.stripeId = await this.createStripeSubscription(customerId, planConfig.stripeId, billingMethod)
      }
      const billingObjectService = app.getService(data.billingObjectService)
      if (optionConfig) {
        const options = _.get(billingObject, 'billing.options', [])
        if (!_.find(options, { plan })) {
          options.push(subscription)
          await billingObjectService.patch(billingObjectId, { 'billing.options': options })
        }
      } else {
        await billingObjectService.patch(billingObjectId, { 'billing.subscription': subscription })
      }
      return subscription
    },
    async updateSubscription (billingObject, data) {
      const billingObjectId = billingObject._id
      const plan = _.get(data, 'plan')
      if (_.isNil(plan)) throw new BadRequest('updateSubscription: missing \'plan\' parameter')
      const planConfig = _.get(config, `plans.${plan}`)
      debug('update subscripton for ' + billingObjectId + ' to plan ' + plan)
      const customerId = _.get(billingObject, 'billing.customer.stripeId')
      const customerCard = _.get(billingObject, 'billing.customer.card')
      const subscriptionId = _.get(billingObject, 'billing.subscription.stripeId')
      if (!_.isNil(subscriptionId)) {
        if (_.isNil(customerId)) throw new BadRequest('updateSubscription: inconsistent billing perspective')
        await this.removeStripeSubscription(customerId, subscriptionId)
      }
      const subscription = { plan }
      if (!_.isNil(planConfig.stripeId)) {
        if (_.isNil(customerId)) throw new BadRequest('updateSubscription: you must create a customer before subscribing to a product')
        let billingMethod = 'send_invoice'
        if (!_.isNil(customerCard)) billingMethod = 'charge_automatically'
        subscription.stripeId = await this.createStripeSubscription(customerId, planConfig.stripeId, billingMethod)
      }
      const billingObjectService = app.getService(data.billingObjectService)
      await billingObjectService.patch(billingObjectId, { 'billing.subscription': subscription })
      return subscription
    },
    async removeSubscription (billingObject, query, patch) {
      const billingObjectId = billingObject._id
      const customerId = _.get(billingObject, 'billing.customer.stripeId')
      // If no plan given then with unsubscribe from the base plan
      const plan = _.get(query, 'plan')
      if (!plan) {
        debug('remove plan subscription from ' + billingObjectId)
        const subscriptionId = _.get(billingObject, 'billing.subscription.stripeId')
        if (!_.isNil(subscriptionId)) {
          if (_.isNil(customerId)) throw new BadRequest('removeSubscription: inconsistent billing perspective')
          await this.removeStripeSubscription(customerId, subscriptionId)
        }
        if (patch) {
          const billingObjectService = app.getService(query.billingObjectService)
          await billingObjectService.patch(billingObjectId, { 'billing.subscription': null })
        }
      } else {
        debug(`remove ${plan} option subscription from ` + billingObjectId)
        const options = _.get(billingObject, 'billing.options')
        const subscribedOption = _.find(options, { plan })
        let subscriptionId
        if (subscribedOption) {
          subscriptionId = _.get(subscribedOption, 'stripeId')
        }
        if (!_.isNil(subscriptionId)) {
          if (_.isNil(customerId)) throw new BadRequest('removeSubscription: inconsistent billing perspective')
          await this.removeStripeSubscription(customerId, subscriptionId)
        }
        if (patch) {
          const billingObjectService = app.getService(query.billingObjectService)
          _.remove(options, item => item.plan === plan)
          await billingObjectService.patch(billingObjectId, { 'billing.options': options })
        }
      }
    },
    setup (app) {
      app.use('/billing/customer', new Customer({ secretKey: config.secretKey }))
      app.service('billing/customer').hooks({ before: { all: commonHooks.disallow('external') } })
      app.use('/billing/card', new Card({ secretKey: config.secretKey }))
      app.service('billing/card').hooks({ before: { all: commonHooks.disallow('external') } })
      app.use('/billing/subscription', new Subscription({ secretKey: config.secretKey }))
      app.service('billing/subscription').hooks({ before: { all: commonHooks.disallow('external') } })
    },
    // Used to perform service actions such as create a customer/subscription.
    async create (data, params) {
      debug(`billing service called for create action=${data.action}`)
      switch (data.action) {
        case 'customer': {
          const customer = await this.createCustomer(params.billingObject, data)
          return customer
        }
        case 'subscription': {
          const subscription = await this.createSubscription(params.billingObject, data)
          return subscription
        }
      }
    },
    // Used to perform service actions such as update a customer/subscription
    async update (id, data, params) {
      debug(`billing service called for update action=${data.action}`)
      switch (data.action) {
        case 'customer': {
          const customer = await this.updateCustomer(params.billingObject, data)
          return customer
        }
        case 'subscription': {
          const subscription = await this.updateSubscription(params.billingObject, data)
          return subscription
        }
      }
    },
    // Used to perform service actions such as remove a customer/subscription
    async remove (id, params) {
      const query = params.query
      debug(`billing service called for remove action=${query.action}`)
      switch (query.action) {
        case 'customer':
          await this.removeCustomer(params.billingObject, query, _.get(params, 'patch', true))
          break
        case 'subscription':
          await this.removeSubscription(params.billingObject, query, _.get(params, 'patch', true))
          break
      }
    }
  }
}
