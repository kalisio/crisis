import { MongoClient, MongoError } from 'mongodb'
// Page models
import * as pages from './page-models'

fixture`billing`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })
  // .afterEach(async test => {
  // })

  const screens = new pages.Screens()
  const layout = new pages.Layout()
  const sideNav = new pages.SideNav()
  const account = new pages.Account()
  const organisationsPanel = new pages.OrganisationsPanel()
  const organisationSettings = new pages.OrganisationSettings()

const data = {
  user: { name: 'Customer', email: 'customer@kalisio.xyz', password: 'Pass;word1' },
  customers: [
    { index: 0, description: 'A customer', vatNumber: 'KAL01'},
    { index: 0, description: 'A customer with a mastercard', vatNumber: 'KAL02', card: { brand: 'MasterCard', number: '5555555555554444', expiry: '1220', cvc: '458', postalCode: '11400' } }
  ]
}

test.page`${pages.getUrl('register')}`
('Registration', async test => {
  await app.register(test, data.user)
  await pages.checkNoClientError(test)
})

test('Check billing state for unverified user', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await organisations.selectOrganisationSettingsTab(test, data.user.name, '#billing')
  const billingState = await organisations.getOrganisationBillingState(test)
  await test.expect(billingState.isUserVerified).eql(false)
  await test.expect(billingState.customer).eql(undefined)
  await test.expect(billingState.currentPlan).eql('bronze')
  await test.expect(await organisations.canEditOrganisationCustomer(test)).notOk()
  await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).notOk()
  await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).notOk()
  await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).notOk()
  await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
})

// To update billing the user has to be verified, because it requires a manual user action (click a link in an email)
// we cannot emulate it so we need to directly patch the object in the DB to do so.
// However, depending on the deployment configuration the database could not be accessible so that we skip in this case
const dbUrl = process.env.DB_URL

test('Check billing state for verified user', async test => {
  if (dbUrl) {
    const dbClient = await MongoClient.connect(dbUrl)
    const db = dbClient.db(dbUrl.substring(dbUrl.lastIndexOf('/') + 1))
    const users = db.collection('users')
    await users.updateOne({ email: data.user.email }, { $set: { isVerified: true } })
    await dbClient.close()
    await app.login(test, data.user)
    await organisations.selectOrganisationSettingsTab(test, data.user.name, '#billing')
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.isUserVerified).eql(true)
    await test.expect(await organisations.canEditOrganisationCustomer(test)).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Add payment information', async test => {
  if (dbUrl) {
    await app.login(test, data.user)
    await organisations.updateOrganisationCustomer(test, data.user.name, data.customers[0])
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.customer.stripeId).contains('cus_')
    await test.expect(billingState.customer.email).eql(data.user.email)
    await test.expect(billingState.customer.card).eql(undefined)
    // await test.expect(billingState.customers[0].description).eql(data.customers[0].description)
    await test.expect(billingState.customer.vatNumber).eql(data.customers[0].vatNumber)
    await test.expect(billingState.currentPlan).eql('bronze')
    await test.expect(await organisations.checkOrganisationCustomer(test, data.user.email)).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Change plan to silver', async test => {
  if (dbUrl) {
    await app.login(test, data.user)
    await organisations.selectOrganisationPlan(test, data.user.name, 'silver')
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.customer.stripeId).contains('cus_')
    await test.expect(billingState.customer.email).eql(data.user.email)
    await test.expect(billingState.customer.card).eql(undefined)
    await test.expect(billingState.currentPlan).eql('silver')
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Add payment card', async test => {
  if (dbUrl) {
    await app.login(test, data.user)
    await organisations.updateOrganisationCustomer(test, data.user.name, data.customers[1])
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.customer.stripeId).contains('cus_')
    await test.expect(billingState.customer.email).eql(data.user.email)
    await test.expect(billingState.customer.vatNumber).eql(data.customers[1].vatNumber)
    await test.expect(billingState.customer.card.stripeId).contains('card_')
    await test.expect(billingState.customer.card.brand).eql(data.customers[1].card.brand)
    await test.expect(billingState.currentPlan).eql('silver')
    await test.expect(await organisations.checkOrganisationCustomer(test, data.customers[1].card.brand)).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Change plan to gold', async test => {
  if (dbUrl) {
    await app.login(test, data.user)
    await organisations.selectOrganisationPlan(test, data.user.name, 'gold')
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.customer.stripeId).contains('cus_')
    await test.expect(billingState.customer.email).eql(data.user.email)
    await test.expect(billingState.customer.vatNumber).eql(data.customers[1].vatNumber)
    await test.expect(billingState.customer.card.stripeId).contains('card_')
    await test.expect(billingState.customer.card.brand).eql(data.customers[1].card.brand)
    await test.expect(billingState.currentPlan).eql('gold')
    await test.expect(await organisations.checkOrganisationCustomer(test, data.customers[1].card.brand)).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Remove payment card', async test => {
  if (dbUrl) {
    await app.login(test, data.user)
    await organisations.clearOrganisationCustomerCard(test, data.user.name)
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.customer.stripeId).contains('cus_')
    await test.expect(billingState.customer.email).eql(data.user.email)
    await test.expect(billingState.customer.card).eql(undefined)
    // await test.expect(billingState.customers[0].description).eql(data.customers[0].description)
    await test.expect(billingState.customer.vatNumber).eql(data.customers[1].vatNumber)
    await test.expect(billingState.currentPlan).eql('gold')
    await test.expect(await organisations.checkOrganisationCustomer(test, data.user.email)).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Change plan to bronze', async test => {
  if (dbUrl) {
    await app.login(test, data.user)
    await organisations.selectOrganisationPlan(test, data.user.name, 'bronze')
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.currentPlan).eql('bronze')
    await test.expect(await organisations.checkOrganisationCustomer(test, data.user.email)).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Delete default organisation', async test => {
  if (dbUrl) await app.login(test, data.user)
  else await app.loginAndCloseSignupAlert(test, data.user)
  await organisations.deleteOrganisation(test, data.user.name)
  // We should have the deleted organisation removed from the organisations panel
  const panel = await organisations.panel.getVue()
  await test.wait(1000)
  await test.expect(panel.state.items.length).eql(0, 'Deleted organisation should be removed from the panel')
  await pages.checkNoClientError(test)
})

test('Delete account', async test => {
  if (dbUrl) await app.login(test, data.user)
  else await app.loginAndCloseSignupAlert(test, data.user)
  await account.removeAccount(test, data.user.name)
  await pages.checkNoClientError(test)
})
