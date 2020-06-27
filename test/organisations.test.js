// Page models
import * as pages from './page-models'
import { SideNav } from './page-models'

fixture`organisations`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })

const screens = new pages.Screens()
const layout = new pages.Layout()
const sideNav = new pages.SideNav()
const account = new pages.Account()
const organisationsPanel = new pages.OrganisationsPanel()
const organisationSettings = new pages.OrganisationSettings()

const data = {
  user: { name: 'Organisations owner', email: 'organisations-owner@kalisio.xyz', password: 'Pass;word1' },
  organisation: { name: 'Test Organisation', description: 'An organisation test' }
}

test('Create user and check default organisation', async test => {
  await screens.goToRegisterScreen(test)
  await screens.register(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.clickLeading(test)
  await organisationsPanel.checkCount(test, 1)
  await pages.checkNoClientError(test)
})

test('Forbid additional free org creation', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.clickLeading(test)
  await organisationsPanel.create(test, data.organisation.name, data.organisation.description)
  const error = await organisationsPanel.isErrorVisible()
  await test.expect(error).ok('Forbidden error should be displayed')
  await pages.checkClientError(test)
})

test('Delete default organisation', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.clickOverflowMenu(test, pages.OrganisationSettings.OVERFLOW_MENU_ENTRY)
  await layout.clickTabBar(test, pages.OrganisationSettings.DANGER_ZONE_TAB)
  await organisationSettings.delete(test, data.user.name)
  await layout.clickLeading(test)
  await organisationsPanel.checkCount(test, 0)
  await pages.checkNoClientError(test)
})

test.skip('Create organisation', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await organisations.createOrganisation(test, data.organisation)
  await test.expect(organisations.appBarTitle.innerText).eql(data.organisation.name, 'AppBar title should be the organisation name')
  await organisations.checkOrganisationCount(test, 1)
  await pages.checkNoClientError(test)
})

test.skip('Forbid account deletion', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  // Cannot remove the account because the user is still owning an organisation
  await account.removeAccount(test, data.user.name)
  const error = await organisations.isErrorVisible()
  await test.expect(error).ok('Forbidden error should be displayed')
  await pages.checkClientError(test)
})

test.skip('Delete created organisation', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await organisations.deleteOrganisation(test, data.organisation.name)
  // We should have the deleted organisation removed from the organisations panel
  await organisations.checkOrganisationCount(test, 0)
  await pages.checkNoClientError(test)
})

test('Delete user', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.clickLeading(test)
  await sideNav.clickIdentity(test)
  await layout.clickTabBar(test, pages.Account.DANGER_ZONE_TAB)
  await account.delete(test, data.user.name)
  await pages.checkNoClientError(test)
})
