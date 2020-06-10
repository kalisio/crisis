import path from 'path'
import chai, { util, expect, assert } from 'chai'
import chailint from 'chai-lint'
import core, { kalisio, hooks, permissions } from '@kalisio/kdk/core.api'
import * as billingPermissions from '../src/permissions'
import * as billingHooks from '../src/hooks'

describe('billing', () => {
  let app, server, port,
    userService, userObject, billingService, customerService, cardService,
    subscriptionService, customerObject, subscriptionObject, stripeCustomer, stripeCard, stripeSubscription

  before(() => {
    chailint(chai, util)

    // Register all default hooks for authorisation
    // Default rules for all users
    permissions.defineAbilities.registerHook(permissions.defineUserAbilities)
    
    app = kalisio()
    // Register authorisation/log hook
    app.hooks({
      before: { all: [hooks.authorise] },
      error: { all: hooks.log }
    })
    port = app.get('port')
    // Register authorisation hook
    /* app.hooks({
      before: { all: [hooks.authorise] }
    }) */
    return app.db.connect()
  })

  it('registers the services', (done) => {
    app.configure(core)
    userService = app.getService('users')
    userService.hooks({
      after: {
        remove: [billingHooks.removeBilling]
      }
    })
    expect(userService).toExist()
    app.createService('billing', { servicesPath: path.join(__dirname, '..', 'src', 'services') })
    billingService = app.getService('billing')
    expect(billingService).toExist()
    // Now app is configured launch the server
    server = app.listen(port)
    server.once('listening', _ => done())
    // Retrieve feathers-strip services
    customerService = app.service('billing/customer')
    expect(customerService).toExist()
    cardService = app.service('billing/card')
    expect(cardService).toExist()
    subscriptionService = app.service('billing/subscription')
    expect(subscriptionService).toExist()
  })

  it('creates a test user', () => {
    return userService.create({ email: 'test-user@test.org', name: 'test-user' }, { checkAuthorisation: true })
      .then(user => {
        userObject = user
        return userService.find({ query: { 'profile.name': 'test-user' }, user: userObject, checkAuthorisation: true })
      })
      .then(users => {
        expect(users.data.length > 0).beTrue()
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('can subscribe to a free plan without customer data', async () => {
    subscriptionObject = await billingService.create({
      action: 'subscription',
      plan: 'bronze',
      billingObject: userObject._id,
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.subscription.plan).to.equal('bronze')
    expect(userObject.billing.subscription.stripeId).to.equal(undefined)
  })
  // Let enough time to process
    .timeout(10000)

  it('cannot subscribe to a paying plan without customer data', (done) => {
    billingService.update(userObject._id, {
      action: 'subscription',
      plan: 'silver',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
      .catch(error => {
        expect(error).toExist()
        expect(error.name).to.equal('BadRequest')
        done()
      })
  })
  // Let enough time to process
    .timeout(10000)

  it('unsubscribe from the plan', async () => {
    await billingService.remove(userObject._id, {
      query: {
        action: 'subscription',
        billingObjectService: 'users'
      }
    })
    userObject = await userService.get(userObject._id)
    assert.isNull(userObject.billing.subscription)
  })
  // Let enough time to process
    .timeout(10000)

  it('create a customer without card', async () => {
    customerObject = await billingService.create({
      action: 'customer',
      email: 'customer@kalisio.xyz',
      description: 'A customer',
      billingObject: userObject._id,
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.stripeId === customerObject.stripeId)
    expect(userObject.billing.customer.email === customerObject.email)
    expect(userObject.billing.customer.description = customerObject.description)
    // Check Stripe
    stripeCustomer = await customerService.get(userObject.billing.customer.stripeId)
    expect(stripeCustomer).toExist()
    const stripeCards = await cardService.find({ customer: userObject.billing.customer.stripeId })
    expect(stripeCards.data.length).to.equals(0)
  })
  // Let enough time to process
    .timeout(10000)

  it('update a customer with a visa card', async () => {
    customerObject = await billingService.update(userObject._id, {
      action: 'customer',
      email: 'visa@kalisio.xyz',
      description: 'A visa purchaser',
      token: 'tok_visa',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.email).to.equal('visa@kalisio.xyz')
    expect(userObject.billing.customer.card.stripeId === customerObject.card.stripeId)
    expect(userObject.billing.customer.card.last4 === customerObject.card.last4)
    // Check Stripe
    stripeCard = await cardService.get(userObject.billing.customer.card.stripeId, { customer: userObject.billing.customer.stripeId })
    expect(stripeCard).toExist()
  })
  // Let enough time to process
    .timeout(10000)

  it('remove the card from the customer', async () => {
    customerObject = await billingService.update(userObject._id, {
      action: 'customer',
      email: 'no-card@kalisio.xyz',
      description: 'A no card purchaser',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.email).to.equal('no-card@kalisio.xyz')
    assert.isUndefined(userObject.billing.customer.card)
    // Check Stripe
    const stripeCards = await cardService.find({ customer: userObject.billing.customer.stripeId })
    expect(stripeCards.data.length).to.equals(0)
  })
  // Let enough time to process
    .timeout(10000)

  it('update a customer with a mastercard', async () => {
    customerObject = await billingService.update(userObject._id, {
      action: 'customer',
      email: 'mastercard@kalisio.xyz',
      description: 'A mastercard purchaser',
      token: 'tok_mastercard',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.email).to.equal('mastercard@kalisio.xyz')
    expect(userObject.billing.customer.card.stripeId === customerObject.card.stripeId)
    expect(userObject.billing.customer.card.last4 === customerObject.card.last4)
    // Check Stripe
    const stripeCards = await cardService.find({ customer: userObject.billing.customer.stripeId })
    expect(stripeCards.data.length).to.equals(1)
  })
  // Let enough time to process
    .timeout(10000)

  it('subscribe to the silver plan', async () => {
    subscriptionObject = await billingService.create({
      action: 'subscription',
      plan: 'silver',
      billingObject: userObject._id,
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.subscription.stripeId === subscriptionObject.stripeId)
    expect(userObject.billing.subscription.plan).to.equal('silver')
    // Check Stripe
    stripeSubscription = await subscriptionService.get(userObject.billing.subscription.stripeId)
    expect(stripeSubscription).toExist()
    expect(stripeSubscription.billing).to.equal('charge_automatically')
    expect(stripeSubscription.plan.id).to.equal('plan_DHd5HGwsl31NoC')
  })
  // Let enough time to process
    .timeout(10000)

  it('update the subscription to the gold plan', async () => {
    subscriptionObject = await billingService.update(userObject._id, {
      action: 'subscription',
      plan: 'gold',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.subscription.plan).to.equal('gold')
    expect(userObject.billing.subscription.stripeId === subscriptionObject.stripeId)
    // Check Stripe
    stripeSubscription = await subscriptionService.get(userObject.billing.subscription.stripeId)
    expect(stripeSubscription).toExist()
    expect(stripeSubscription.billing).to.equal('charge_automatically')
    expect(stripeSubscription.plan.id).to.equal('plan_DHd5RMLMSlpUmQ')
  })
  // Let enough time to process
    .timeout(10000)

  it('update the subscription to the bronze plan', async () => {
    subscriptionObject = await billingService.update(userObject._id, {
      action: 'subscription',
      plan: 'bronze',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.subscription.plan).to.equal('bronze')
    expect(userObject.billing.subscription.stripeId).to.equal(undefined)
  })
  // Let enough time to process
    .timeout(10000)

  it('unsubscribe a customer from the plan', async () => {
    await billingService.remove(userObject._id, {
      query: {
        action: 'subscription',
        billingObjectService: 'users',
        billingPerspective: 'billing'
      }
    })
    userObject = await userService.get(userObject._id)
    assert.isNull(userObject.billing.subscription)
    // Check Stripe
    const stripeSubscriptions = await subscriptionService.find({ query: { customer: userObject.billing.customer.stripeId } })
    expect(stripeSubscriptions.data.length).to.equals(0)
  })
  // Let enough time to process
    .timeout(10000)

  it('remove the card from the customer', async () => {
    customerObject = await billingService.update(userObject._id, {
      action: 'customer',
      email: 'no-card@kalisio.xyz',
      description: 'A no card purchaser',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.email).to.equal('no-card@kalisio.xyz')
    assert.isUndefined(userObject.billing.customer.card)
    // Check Stripe
    const stripeCards = await cardService.find({ customer: userObject.billing.customer.stripeId })
    expect(stripeCards.data.length).to.equals(0)
  })
  // Let enough time to process
    .timeout(10000)

  it('subscribe a customer to a plan', async () => {
    subscriptionObject = await billingService.create({
      action: 'subscription',
      plan: 'gold',
      billing: 'send_invoice',
      billingObject: userObject._id,
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    userObject = await userService.get(userObject._id)
    expect(subscriptionObject.stripeId === userObject.billing.subscription.stripeId)
    expect(userObject.billing.subscription.plan).to.equal('gold')
    // Check Stripe
    const stripeSubscriptions = await subscriptionService.find({ query: { customer: userObject.billing.customer.stripeId } })
    expect(stripeSubscriptions.data.length).to.equals(1)
    expect(stripeSubscriptions.data[0].billing).to.equal('send_invoice')
  })
  // Let enough time to process
    .timeout(10000)

  it('update a customer with an american express', async () => {
    customerObject = await billingService.update(userObject._id, {
      action: 'customer',
      email: 'amex@kalisio.xyz',
      description: 'A anmerican express purchaser',
      token: 'tok_amex',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.email).to.equal('amex@kalisio.xyz')
    expect(userObject.billing.customer.card.stripeId === customerObject.card.stripeId)
    expect(userObject.billing.customer.card.last4 === customerObject.card.last4)
    // Check Stripe
    const stripeCards = await cardService.find({ customer: userObject.billing.customer.stripeId })
    expect(stripeCards.data.length).to.equals(1)
    const stripeSubscriptions = await subscriptionService.find({ query: { customer: userObject.billing.customer.stripeId } })
    expect(stripeSubscriptions.data.length).to.equals(1)
    expect(stripeSubscriptions.data[0].billing).to.equal('charge_automatically')
  })
  // Let enough time to process
    .timeout(10000)

  it('update a customer with a mastercard', async () => {
    customerObject = await billingService.update(userObject._id, {
      action: 'customer',
      email: 'mastercard@kalisio.xyz',
      description: 'A mastercard purchaser',
      token: 'tok_mastercard',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.email).to.equal('mastercard@kalisio.xyz')
    expect(userObject.billing.customer.card.stripeId === customerObject.card.stripeId)
    expect(userObject.billing.customer.card.last4 === customerObject.card.last4)
    // Check Stripe
    const stripeCards = await cardService.find({ customer: userObject.billing.customer.stripeId })
    expect(stripeCards.data.length).to.equals(1)
    const stripeSubscriptions = await subscriptionService.find({ query: { customer: userObject.billing.customer.stripeId } })
    expect(stripeSubscriptions.data.length).to.equals(1)
    expect(stripeSubscriptions.data[0].billing).to.equal('charge_automatically')
  })
  // Let enough time to process
    .timeout(10000)

  it('remove the card from the customer', async () => {
    customerObject = await billingService.update(userObject._id, {
      action: 'customer',
      email: 'no-card@kalisio.xyz',
      description: 'A no card purchaser',
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.email).to.equal('no-card@kalisio.xyz')
    assert.isUndefined(userObject.billing.customer.card)
    // Check Stripe
    const stripeCards = await cardService.find({ customer: userObject.billing.customer.stripeId })
    expect(stripeCards.data.length).to.equals(0)
    const stripeSubscriptions = await subscriptionService.find({ query: { customer: userObject.billing.customer.stripeId } })
    expect(stripeSubscriptions.data.length).to.equals(1)
    expect(stripeSubscriptions.data[0].billing).to.equal('send_invoice')
  })
  // Let enough time to process
    .timeout(10000)

  it('removes the customer', async () => {
    await billingService.remove(userObject._id, {
      query: {
        action: 'customer',
        billingObjectService: 'users',
        billingPerspective: 'billing'
      }
    })
    // Check user
    userObject = await userService.get(userObject._id)
    assert.isNull(userObject.billing.subscription)
    assert.isNull(userObject.billing.customer)
    // Check Stripe
    const stripeCustomers = await customerService.find({ query: { email: customerObject.email } })
    expect(stripeCustomers.data.length).to.equals(0)
  })
  // Let enough time to process
    .timeout(10000)

  it('create a new customer with card', async () => {
    customerObject = await billingService.create({
      action: 'customer',
      email: 'new-customer@kalisio.xyz',
      token: 'tok_visa_debit',
      description: 'A new customer',
      billingObject: userObject._id,
      billingObjectService: 'users',
      billingPerspective: 'billing'
    })
    // Check user
    userObject = await userService.get(userObject._id)
    expect(userObject.billing.customer.stripeId === customerObject.stripeId)
    expect(userObject.billing.customer.email === customerObject.email)
    expect(userObject.billing.customer.description = customerObject.description)
    // Check Stripe
    stripeCustomer = await customerService.get(userObject.billing.customer.stripeId)
    expect(stripeCustomer).toExist()
    stripeCard = await cardService.get(userObject.billing.customer.card.stripeId, { customer: userObject.billing.customer.stripeId })
    expect(stripeCard).toExist()
  })
  // Let enough time to process
    .timeout(10000)

  it('removes the test user', async () => {
    await userService.remove(userObject._id, {
      user: userObject,
      checkAuthorisation: true
    })
    // Check user
    /* let users = await userService.find({ query: { name: 'test-user' } })
    expect(users.data.length === 0).beTrue()
    // Check Stripe
    let stripeCustomers = await customerService.find({query: {email: customerObject.email}})
    expect(stripeCustomers.data.length).to.equals(0) */
  })
  // Let enough time to process
    .timeout(10000)

  // Cleanup
  after(async () => {
    if (server) await server.close()
    await userService.Model.drop()
    await app.db.instance.dropDatabase()
    await app.db.disconnect()
  })
})
