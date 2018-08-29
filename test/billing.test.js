import { MongoClient, MongoError } from 'mongodb'
// Page models
import * as pages from './page-models'

fixture`Billing`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })
  // .afterEach(async test => {
  // })

const auth = new pages.Authentication()
const account = new pages.Account(auth)
const organisations = new pages.Organisations()

const data = {
  user: { name: 'Purchaser', email: 'purchaser@kalisio.xyz', password: 'Pass;word1' },
  customer: { index: 0, description: 'A purchaser', vatNumber: 'a VAT number'}
}

test.page`${pages.getUrl('register')}`
('Registration', async test => {
  await auth.signIn(test, data.user)
  await pages.checkNoClientError(test)
})

test('Check billing state for unverified user', async test => {
  await auth.logInAndCloseSignupAlert(test, data.user)
  await organisations.selectOrganisationSettingsTab(test, data.user.name, '#billing')
  await test.wait(1000)
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
    await auth.logIn(test, data.user)
    await organisations.selectOrganisationSettingsTab(test, data.user.name, '#billing')
    await test.wait(1000)
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
    await auth.logIn(test, data.user)
    await organisations.updateOrganisationCustomer(test, data.user.name, data.customer)
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.customer.stripeId).contains('cus_')
    await test.expect(billingState.customer.email).eql(data.user.email)
    //await test.expect(billingState.customer.description).eql(data.customer.description)
    await test.expect(billingState.customer.vatNumber).eql(data.customer.vatNumber)
    await test.expect(billingState.currentPlan).eql('bronze')
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Change plan to silver', async test => {
  if (dbUrl) {
    await auth.logIn(test, data.user)
    await organisations.selectOrganisationPlan(test, data.user.name, 'silver')
    const billingState = await organisations.getOrganisationBillingState(test)
    await test.expect(billingState.currentPlan).eql('silver')
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'bronze')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'silver')).notOk()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'gold')).ok()
    await test.expect(await organisations.canSelectOrganisationPlan(test, 'diamond')).ok()
  }
})

test('Delete default organisation', async test => {
  if (dbUrl) await auth.logIn(test, data.user)
  else await auth.logInAndCloseSignupAlert(test, data.user)
  await organisations.deleteOrganisation(test, data.user.name)
  // We should have the deleted organisation removed from the organisations panel
  const panel = await organisations.panel.getVue()
  await test.wait(1000)
  await test.expect(panel.state.items.length).eql(0, 'Deleted organisation should be removed from the panel')
  await pages.checkNoClientError(test)
})

test('Delete account', async test => {
  if (dbUrl) await auth.logIn(test, data.user)
  else await auth.logInAndCloseSignupAlert(test, data.user)
  await account.removeAccount(test, data.user.name)
  await pages.checkNoClientError(test)
})
