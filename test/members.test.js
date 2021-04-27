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
const organisations = new pages.Organisations()
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
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY)
  await test.wait(250)  
  await organisations.checkCount(test, 1)
  await organisations.clickAction(test, data.users[0].name, 'organisation-members')
  await test.wait(250)
  await layout.clickFab(test, pages.Members.ADD_MEMBER_ENTRY)
  await members.add(test, data.users[1].email, pages.Roles.manager)
  await members.checkCount(test, 2)
  await layout.clickFab(test, pages.Members.ADD_MEMBER_ENTRY)
  await members.add(test, data.users[2].email, pages.Roles.member)
  await members.checkCount(test, 3)
  await pages.checkNoClientError(test)
})

test('Invite guest to join the organisation', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY)
  await test.wait(250)
  await organisations.clickAction(test, data.users[0].name, 'organisation-members')
  await test.wait(250)
  await layout.clickFab(test, pages.Members.ADD_MEMBER_ENTRY)
  await members.invite(test, data.guest.email, data.guest.name, pages.Roles.manager)
  await members.checkCount(test, 4)
  await pages.checkNoClientError(test)
})

test('Tag members', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Members.OVERFLOW_MENU_ENTRY)
  await members.tag(test, data.users[1].name, 'tag1')
  await members.tag(test, data.users[2].name, 'tag2')
  await members.checkCount(test, 4)
  await layout.clickTabBar(test, pages.Tags.TAB_BAR_ENTRY)
  await tags.checkCount(test, 2)
  await tags.checkExists(test, 'tag1')
  await tags.checkCounter(test, 'tag1', 1)
  await tags.checkExists(test, 'tag2')
  await tags.checkCounter(test, 'tag2', 1)
  await pages.checkNoClientError(test)
})

test('Update tags', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Tags.OVERFLOW_MENU_ENTRY)
  await tags.checkCount(test, 2)
  await tags.edit(test, 'tag1', { name: 'tag3' })
  await tags.checkExists(test, 'tag3')
  await tags.checkCounter(test, 'tag3', 1)
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
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY)
  await test.wait(250)
  await organisations.clickAction(test, data.users[0].name, 'organisation-members')
  await test.wait(250)
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
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY)
  await test.wait(250)
  await organisations.clickAction(test, data.users[0].name, 'organisation-members')
  await test.wait(250)
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
