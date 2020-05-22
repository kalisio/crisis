// Page models
import * as pages from './page-models'

fixture`organisations`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })

const app = new pages.Application()
const account = new pages.Account(app)
const organisations = new pages.Organisations()

const data = {
  user: { name: 'Organisations owner', email: 'organisations-owner@kalisio.xyz', password: 'Pass;word1' },
  organisation: { name: 'Test Organisation', description: 'An organisation test' }
}

test.page`${pages.getUrl('register')}`
('Registration', async test => {
  await app.register(test, data.user)
  await pages.checkNoClientError(test)
})

test('Default organisation', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  // We should have at least the private organisation
  await organisations.checkOrganisationCount(test, 1)
  await pages.checkNoClientError(test)
})

test('Forbid additional free org creation', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  // Cannot remove the account because the user is still owning an organisation
  await organisations.createOrganisation(test, data.organisation)
  await test.expect(app.isErrorVisible()).ok('Forbidden error should be displayed')
  await pages.checkClientError(test)
})

test('Delete default organisation', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await organisations.deleteOrganisation(test, data.user.name)
  // We should have the deleted organisation removed from the organisations panel
  await organisations.checkOrganisationCount(test, 0)
  await pages.checkNoClientError(test)
})

test('Create organisation', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await organisations.createOrganisation(test, data.organisation)
  // We should have the created organisation in the organisations panel
  // FIXME: innerText contains an additionnal \n which makes the test fail
  await test.expect(organisations.appBarTitle.innerText).eql(data.organisation.name, 'AppBar title should be the organisation name')
  await organisations.checkOrganisationCount(test, 1)
  await pages.checkNoClientError(test)
})

test('Forbid account deletion', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  // Cannot remove the account because the user is still owning an organisation
  await account.removeAccount(test, data.user.name)
  const error = await organisations.isErrorVisible()
  await test.expect(error).ok('Forbidden error should be displayed')
  await pages.checkClientError(test)
})

test('Delete created organisation', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await organisations.deleteOrganisation(test, data.organisation.name)
  // We should have the deleted organisation removed from the organisations panel
  await organisations.checkOrganisationCount(test, 0)
  await pages.checkNoClientError(test)
})

test('Delete account', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await account.removeAccount(test, data.user.name)
  await pages.checkNoClientError(test)
})
