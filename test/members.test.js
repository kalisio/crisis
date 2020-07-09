// Page models
import * as pages from './page-models'

fixture`members`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })
  .afterEach(async test => {
    // check for console error messages
  })

const screens = new pages.Screens()
const layout = new pages.Layout()
const users = new pages.Users()
const members = new pages.Members()
const tags = new pages.Tags()

const data = {
  users: [
    { name: 'Members owner', email: 'members-owner@kalisio.xyz', password: 'Pass;word1' },
    { name: 'Members manager', email: 'members-manager@kalisio.xyz', password: 'Pass;word1' },
    { name: 'Members member', email: 'members-member@kalisio.xyz', password: 'Pass;word1' }
  ],
  guest: { name: 'Members guest', email: 'test-guest@kalisio.xyz' }
}

test('Registers users', async test => {
  await users.registerUsers(test, data.users)
})

test('Add users to organisation', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await members.checkCount(test, 1)
  await layout.openAndClickFab(test, pages.Members.ADD_MEMBER_FAB_ENTRY)
  await members.add(test, data.users[1].name, pages.Roles.manager)
  await members.checkCount(test, 2)
  await layout.openAndClickFab(test, pages.Members.ADD_MEMBER_FAB_ENTRY)
  await members.add(test, data.users[2].name, pages.Roles.member)
  await members.checkCount(test, 3)
  await pages.checkNoClientError(test)
})

test('Invite guest to join the organisation', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await layout.openAndClickFab(test, pages.Members.INVITE_MEMBER_FAB_ENTRY)
  await members.invite(test, data.guest.name, data.guest.email, pages.Roles.manager)
  await members.checkCount(test, 4)
  await pages.checkNoClientError(test)
})

test('tag member', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await members.tag(test, data.users[1].name, 'skill')
  await members.checkCount(test, 4)
  await layout.clickTabBar(test, pages.Tags.TAB_BAR_ENTRY)
  await tags.checkCount(test, 1)
  await pages.checkNoClientError(test)
})

test('Change member role', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await members.changeRole(test, data.users[2].name, pages.Roles.manager)
  await members.checkCount(test, 4)
  await pages.checkNoClientError(test)
})

test('Cannot delete owner', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await members.delete(test, data.users[0].name)
  await test.wait(500)
  const error = await members.isErrorVisible()
  await test.expect(error).ok('Error should be displayed')
  await pages.checkClientError(test)
})

test('Delete members from organisation', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await members.delete(test, data.users[1].name)
  await members.checkCount(test, 3)
  await members.delete(test, data.users[2].name)
  await members.checkCount(test, 2)
  await pages.checkNoClientError(test)
})

test('Clean registrated users', async test => {
  await users.unregisterUsers(test, data.users)
  await pages.checkNoClientError(test)
})