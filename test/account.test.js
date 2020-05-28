import path from 'path'
// Page models
import * as pages from './page-models'

fixture`account`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })
  .afterEach(async test => {
    // check for console error messages
    // FIXME: Storage error
    // await pages.checkNoClientError(test)
  })

const app = new pages.Application()
const organisations = new pages.Organisations()
const account = new pages.Account()

const data = {
  user: { name: 'account user', email: 'account-user@kalisio.xyz', password: 'Pass;word1' },
  newName: 'account newuser',
  newPassword: 'Pass;word1-new1',
  newEmail: 'kalisio@kalisio.com'
}

test.page`${pages.getUrl('register')}`
('Registration', async test => {
  await app.register(test, data.user)
})

test('Edit profile', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await account.editProfile(test, { name: data.newName, avatar: path.join(__dirname, 'assets', 'avatar.png') })
  data.user.name = data.newName
  await account.checkIdentity(test, data.user.name)
})

test('Edit password', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await account.updatePassword(test, { password: data.user.password, newPassword: data.newPassword })
  await pages.goBack()
  await app.logout(test)
  // We should login with new credentials
  await test.navigateTo(pages.getUrl('login'))
  data.user.password = data.newPassword
  await app.login(test, data.user)
})

test('Edit email', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await account.updateEmail(test, { password: data.user.password, newEmail: data.newEmail })
  await pages.goBack()
  await app.logout(test)
  // We should not be able to login with new email because it requires validation
  await test.navigateTo(pages.getUrl('login'))
  await app.login(test, { email: data.newEmail, password: data.newPassword })
  await test.expect(app.isErrorVisible()).ok('Error should be displayed')
  // FIXME: how could we validate the change ?
})

test('Delete account', async test => {
  await app.loginAndCloseSignupAlert(test, data.user)
  await organisations.deleteOrganisation(test, 'account user')  // old name
  await account.removeAccount(test, data.user.name)
  // And we cannot login anymore
  await test.navigateTo(pages.getUrl('login'))
  await app.login(test, data.user)
  await test.expect(app.isErrorVisible()).ok('Error should be displayed')
})
