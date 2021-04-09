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
const organisationSettings = new pages.OrganisationSettings()
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
  data.user.password = data.newPassword
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Account.MANAGE_ACCOUNT)
  await layout.clickLeftOpener(test)  
  await layout.clickTopPaneAction(test, pages.Account.SECURITY)  
  await account.updateEmail(test, data.newEmail, data.user.password)
  await pages.goBack()
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Layout.LOGOUT)
  await pages.checkNoClientError(test)
})

// The above changes are not effective since the user does not confirm the mail
test.skip('Ensure login with old email fails', async test => {
  await screens.login(test, data.user)
  const error = await screens.isErrorVisible()
  await test.expect(error).ok('Error should be displayed')
  data.user.email = data.newEmail
  await pages.checkClientError(test)
})

test('Delete account', async test => {
 /* data.user.email = data.newEmail
  data.user.password = data.newPassword*/
  data.user.name = data.newName
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickTopPaneMenuEntry(test, 'app-bar-overflow-menu', 'settings')
  await layout.clickTopPaneAction(test, pages.OrganisationSettings.DANGER_ZONE_TAB)
  await organisationSettings.delete(test, data.user.name)
  await layout.clickLeftOpener(test)  
  await layout.clickLeftPaneAction(test, pages.Account.MANAGE_ACCOUNT)
  await layout.clickLeftOpener(test)  
  await layout.clickTopPaneAction(test, pages.Account.DANGER_ZONE)
  await account.delete(test, data.user.name)
  await screens.goToLoginScreen(test)
  await pages.checkNoClientError(test)
})

test('Ensure login with deleted account fails', async test => {
  await screens.login(test, data.user)
  const error = await screens.isErrorVisible()
  await test.expect(error).ok('Error should be displayed')
})
