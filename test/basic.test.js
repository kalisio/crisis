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
const sideNav = new pages.SideNav()

test('Login as default user', async test => {
  await screens.login(test, { email: 'kalisio@kalisio.xyz', password: 'Pass;word1' })
  await layout.closeSignupAlert(test)
  await layout.closeTour(test)
  console.log(pages.Members.OVERFLOW_MENU_ENTRY)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await layout.clickOverflowMenu(test, pages.Tags.OVERFLOW_MENU_ENTRY)
  await layout.clickOverflowMenu(test, pages.Groups.OVERFLOW_MENU_ENTRY)
  await layout.clickOverflowMenu(test, pages.EventTemplates.OVERFLOW_MENU_ENTRY)
  await layout.clickLeading(test)
  await sideNav.logout(test)
  await screens.goToLoginScreen(test)
})
