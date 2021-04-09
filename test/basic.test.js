// Page models
import * as pages from './page-models'

fixture`basic`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })
  .afterEach(async test => {
    // check for console error messages
    await pages.checkNoClientError(test)
  })

const screens = new pages.Screens()
const layout = new pages.Layout()
const tags = new pages.Tags()
const organisationSettings = new pages.OrganisationSettings()

const user = {
  email: 'kalisio@kalisio.xyz',
  password: 'Pass;word1'
}

test('Login as default user', async test => {
  await screens.login(test, user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await layout.clickOverflowMenu(test, pages.Tags.OVERFLOW_MENU_ENTRY)
   await tags.checkExists(test, 'RAD4')
  await tags.checkCounter(test, 'RAD4', 5)
  await tags.edit(test, 'RAD4', { name: 'RAD5' })
  await layout.clickOverflowMenu(test, pages.Groups.OVERFLOW_MENU_ENTRY)
  await layout.clickOverflowMenu(test, pages.EventTemplates.OVERFLOW_MENU_ENTRY)
  await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
  await layout.clickTabBar(test, pages.OrganisationSettings.BILLING_TAB)
  await organisationSettings.checkCustomerBlockDisabled(test)
  await organisationSettings.checkPlanEnabled(test, 'bronze')
  await layout.clickTabBar(test, pages.OrganisationSettings.DANGER_ZONE_TAB)
  await layout.clickLeading(test)
  
  await screens.goToLoginScreen(test)
})
