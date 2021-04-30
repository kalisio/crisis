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

const screens = new pages.Screens()
const layout = new pages.Layout()
const organisations = new pages.Organisations()
const users = new pages.Users()
const billing = new pages.Billing()

const data = {
  user: { name: 'Customer', email: 'customer@kalisio.xyz', password: 'Pass;word1' },
  customers: [
    { index: 0, description: 'A customer', vatNumber: 'KAL01'},
    { index: 0, description: 'A customer with a mastercard', vatNumber: 'KAL02', card: { brand: 'MasterCard', number: '5555555555554444', expiry: '1222', cvc: '458', postalCode: '11400' } }
  ]
}

test('Setup billing context', async test => {
  await users.registerUsers(test, [data.user])
  await pages.checkNoClientError(test)
})

test('Check billing state for unverified user', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goTo(test, data.user.name, pages.Billing.ENTRY)
  await billing.checkCustomerBlockDisabled(test)
  await billing.checkPlanDisabled(test, 'bronze')
  await billing.checkPlanDisabled(test, 'silver')
  await billing.checkPlanDisabled(test, 'gold')
  await billing.checkPlanEnabled(test, 'diamond')
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
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickLeftOpener(test)
    await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
    await organisations.goTo(test, data.user.name, pages.Billing.ENTRY)
    await billing.checkCustomerBlockEnabled(test)    
    await billing.checkPlanDisabled(test, 'bronze')
    await billing.checkPlanDisabled(test, 'silver')
    await billing.checkPlanDisabled(test, 'gold')
    await billing.checkPlanEnabled(test, 'diamond')
  }
})

test('Add payment information', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickLeftOpener(test)
    await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
    await organisations.goTo(test, data.user.name, pages.Billing.ENTRY)
    await billing.updateCustomer(test, data.customers[0])
    await billing.checkCustomerCard(test, false)
    await billing.checkPlanDisabled(test, 'bronze')
    await billing.checkPlanEnabled(test, 'silver')
    await billing.checkPlanEnabled(test, 'gold')
    await billing.checkPlanEnabled(test, 'diamond')
  }
})

test('Change plan to silver', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickLeftOpener(test)
    await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
    await organisations.goTo(test, data.user.name, pages.Billing.ENTRY)
    await billing.selectPlan(test, 'silver')
    await billing.checkPlanEnabled(test, 'bronze')
    await billing.checkPlanDisabled(test, 'silver')
    await billing.checkPlanEnabled(test, 'gold')
    await billing.checkPlanEnabled(test, 'diamond')
  }
})

test('Add payment card', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickLeftOpener(test)
    await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
    await organisations.goTo(test, data.user.name, pages.Billing.ENTRY)
    await billing.updateCustomer(test, data.customers[1])
    await billing.checkCustomerCard(test, true)
    await billing.checkPlanEnabled(test, 'bronze')
    await billing.checkPlanDisabled(test, 'silver')
    await billing.checkPlanEnabled(test, 'gold')
    await billing.checkPlanEnabled(test, 'diamond')
  }
})

test('Change plan to gold', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickLeftOpener(test)
    await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
    await organisations.goTo(test, data.user.name, pages.Billing.ENTRY)
    await billing.selectPlan(test, 'gold')
    await billing.checkPlanEnabled(test, 'bronze')
    await billing.checkPlanEnabled(test, 'silver')
    await billing.checkPlanDisabled(test, 'gold')
    await billing.checkPlanEnabled(test, 'diamond')
  }
})

test('Remove payment card', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickLeftOpener(test)
    await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
    await organisations.goTo(test, data.user.name, pages.Billing.ENTRY)
    await billing.clearCustomerCard(test)
    await billing.checkCustomerCard(test, false)
    await billing.checkPlanEnabled(test, 'bronze')
    await billing.checkPlanEnabled(test, 'silver')
    await billing.checkPlanDisabled(test, 'gold')
    await billing.checkPlanEnabled(test, 'diamond')
  }
})

test('Change plan to bronze', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickLeftOpener(test)
    await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
    await organisations.goTo(test, data.user.name, pages.Billing.ENTRY)
    await billing.selectPlan(test, 'bronze')
    await billing.checkPlanDisabled(test, 'bronze')
    await billing.checkPlanEnabled(test, 'silver')
    await billing.checkPlanEnabled(test, 'gold')
    await billing.checkPlanEnabled(test, 'diamond')
  }
})

test('Clean billing context', async test => {
  if (dbUrl) await users.unregisterUsers(test, [data.user], true)
  await pages.checkNoClientError(test)
})
