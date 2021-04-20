import path from 'path'
import * as pages from './page-models'

fixture`account`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })
  .afterEach(async test => {
    // check for console error messages
  })

const screens = new pages.Screens()
const layout = new pages.Layout()
const organisations = new pages.Organisations()
const account = new pages.Account()

const data = {
  user: { name: 'account user', email: 'account-user@kalisio.xyz', password: 'Pass;word1' },
  newName: 'account newuser',
  newPassword: 'Pass;word1-new1',
  newEmail: 'account-other@kalisio.com',
  avatar: 'avatar.png'
}

test('Create account', async test => {
  await screens.goToRegisterScreen(test)
  await screens.register(test, data.user)
  await layout.closeSignupAlert(test)  
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY)
  await organisations.checkCount(test, 1)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Layout.LOGOUT)  
  await pages.checkNoClientError(test)
})

test('Update profile', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Account.MANAGE_ACCOUNT)
  await layout.clickLeftOpener(test)  
  await account.updateProfile(test, path.join(__dirname, 'assets', data.avatar), data.newName)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Layout.LOGOUT)
  await pages.checkNoClientError(test)
})

test('Update password', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Account.MANAGE_ACCOUNT)
  await layout.clickLeftOpener(test)  
  await layout.clickTopPaneAction(test, pages.Account.SECURITY)  
  await account.updatePassword(test, data.user.password, data.newPassword)
  await pages.goBack()
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Layout.LOGOUT)
  await pages.checkNoClientError(test)
})

test('Ensure login with old password fails', async test => {
  await screens.login(test, data.user)
  const error = await screens.isErrorVisible()
  await test.expect(error).ok('Error should be displayed')
  data.user.password = data.newPassword
})

test('Update email', async test => {
  await screens.login(test, { email: data.user.email, password: data.newPassword })
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Account.MANAGE_ACCOUNT)
  await layout.clickLeftOpener(test)  
  await layout.clickTopPaneAction(test, pages.Account.SECURITY)  
  await account.updateEmail(test, data.newEmail, data.newPassword)
  await pages.goBack()
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Layout.LOGOUT)
  await pages.checkNoClientError(test)
})

// The above changes are not effective since the user does not confirm the mail
test.skip('Ensure login with old email fails', async test => {
  await screens.login(test, { email: data.user.email, password: data.newPassword })
  const error = await screens.isErrorVisible()
  await test.expect(error).ok('Error should be displayed')
  data.user.email = data.newEmail
  await pages.checkClientError(test)
})

test('Delete organisation', async test => {
  await screens.login(test, { email: data.user.email, password: data.newPassword })
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY)
  await organisations.checkCount(test, 1)
  await organisations.delete(test, data.user.name)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Layout.LOGOUT)
  await screens.goToLoginScreen(test)
  await pages.checkNoClientError(test)
})

test('Delete account', async test => {
  await screens.login(test, { email: data.user.email, password: data.newPassword })
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)  
  await layout.clickLeftPaneAction(test, pages.Account.MANAGE_ACCOUNT)
  await layout.clickTopPaneAction(test, pages.Account.DANGER_ZONE)
  await account.delete(test, data.newName)
  await screens.goToLoginScreen(test)
  await pages.checkNoClientError(test)
})

test('Ensure login with deleted account fails', async test => {
  await screens.login(test, data.user)
  const error = await screens.isErrorVisible()
  await test.expect(error).ok('Error should be displayed')
})
