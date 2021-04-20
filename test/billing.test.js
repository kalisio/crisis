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
  const organisationSettings = new pages.OrganisationSettings()
  const users = new pages.Users()

const data = {
  user: { name: 'Customer', email: 'customer@kalisio.xyz', password: 'Pass;word1' },
  customers: [
    { index: 0, description: 'A customer', vatNumber: 'KAL01'},
    { index: 0, description: 'A customer with a mastercard', vatNumber: 'KAL02', card: { brand: 'MasterCard', number: '5555555555554444', expiry: '1220', cvc: '458', postalCode: '11400' } }
  ]
}

test('Setup context', async test => {
  await users.registerUsers(test, [data.user])
  await pages.checkNoClientError(test)
})

test.skip('Check billing state for unverified user', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
  await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
  await organisationSettings.checkCustomerBlockDisabled(test)
  await organisationSettings.checkPlanDisabled(test, 'bronze')
  await organisationSettings.checkPlanDisabled(test, 'silver')
  await organisationSettings.checkPlanDisabled(test, 'gold')
  await organisationSettings.checkPlanEnabled(test, 'diamond')
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
    await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
    await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
    await organisationSettings.checkCustomerBlockEnabled(test)    
    await organisationSettings.checkPlanDisabled(test, 'bronze')
    await organisationSettings.checkPlanDisabled(test, 'silver')
    await organisationSettings.checkPlanDisabled(test, 'gold')
    await organisationSettings.checkPlanEnabled(test, 'diamond')
  }
})

test('Add payment information', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
    await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
    await organisationSettings.updateCustomer(test, data.customers[0])
    await organisationSettings.checkCustomerCard(test, false)
    await organisationSettings.checkPlanDisabled(test, 'bronze')
    await organisationSettings.checkPlanEnabled(test, 'silver')
    await organisationSettings.checkPlanEnabled(test, 'gold')
    await organisationSettings.checkPlanEnabled(test, 'diamond')
  }
})

test('Change plan to silver', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
    await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
    await organisationSettings.selectPlan(test, 'silver')
    await organisationSettings.checkPlanEnabled(test, 'bronze')
    await organisationSettings.checkPlanDisabled(test, 'silver')
    await organisationSettings.checkPlanEnabled(test, 'gold')
    await organisationSettings.checkPlanEnabled(test, 'diamond')
  }
})

test('Add payment card', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
    await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
    await organisationSettings.updateCustomer(test, data.customers[1])
    await organisationSettings.checkCustomerCard(test, true)
    await organisationSettings.checkPlanEnabled(test, 'bronze')
    await organisationSettings.checkPlanDisabled(test, 'silver')
    await organisationSettings.checkPlanEnabled(test, 'gold')
    await organisationSettings.checkPlanEnabled(test, 'diamond')
  }
})

test('Change plan to gold', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
    await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
    await organisationSettings.selectPlan(test, 'gold')
    await organisationSettings.checkPlanEnabled(test, 'bronze')
    await organisationSettings.checkPlanEnabled(test, 'silver')
    await organisationSettings.checkPlanDisabled(test, 'gold')
    await organisationSettings.checkPlanEnabled(test, 'diamond')
  }
})

test('Remove payment card', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
    await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
    await organisationSettings.clearCustomerCard(test)
    await organisationSettings.checkCustomerCard(test, false)
    await organisationSettings.checkPlanEnabled(test, 'bronze')
    await organisationSettings.checkPlanEnabled(test, 'silver')
    await organisationSettings.checkPlanDisabled(test, 'gold')
    await organisationSettings.checkPlanEnabled(test, 'diamond')
  }
})

test('Change plan to bronze', async test => {
  if (dbUrl) {
    await screens.login(test, data.user)
    await layout.closeWelcomeDialog(test)
    await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
    await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
    await organisationSettings.selectPlan(test, 'bronze')
    await organisationSettings.checkPlanDisabled(test, 'bronze')
    await organisationSettings.checkPlanEnabled(test, 'silver')
    await organisationSettings.checkPlanEnabled(test, 'gold')
    await organisationSettings.checkPlanEnabled(test, 'diamond')
  }
})

test('Delete account', async test => {
  if (dbUrl) await users.unregisterUsers(test, [data.user], true)
  await pages.checkNoClientError(test)
})
