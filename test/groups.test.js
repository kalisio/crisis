// Page models
import * as pages from './page-models'
import { Organisations } from './page-models'

fixture`groups`// declare the fixture
  .page`${pages.getUrl()}`  // specify the start page
  // test.before/test.after overrides fixture.beforeEach/fixture.afterEach hook,
  // so implement one in your test if you'd like another behaviour
  .beforeEach(async test => {
    // mock geolocation
    await pages.mockLocationAPI()
  })
  .afterEach(async test => {
  })

  const screens = new pages.Screens()
  const layout = new pages.Layout()
  const users = new pages.Users()
  const organisations = new pages.Organisations()
  const members = new pages.Members()
  const groups = new pages.Groups()

const data = {
  users: [
    { name: 'Groups owner', email: 'groups-owner@kalisio.xyz', password: 'Pass;word1' },
    { name: 'Groups manager 1', email: 'groups-manager1@kalisio.xyz', password: 'Pass;word1' },
    { name: 'Groups member 1', email: 'groups-member1@kalisio.xyz', password: 'Pass;word1' },
    { name: 'Groups member 2', email: 'groups-member2@kalisio.xyz', password: 'Pass;word1' }
  ],
  groups: [
    { name: 'Groups 1', description: 'A first group' },
    { name: 'Groups 2', description: 'A second group' }
  ]
}

test('Setup groups context', async test => {
  await users.registerUsers(test, data.users)
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goToMembers(test, data.users[0].name)
  await members.add(test, data.users[1].email, pages.Roles.member)
  await members.add(test, data.users[2].email, pages.Roles.manager)
  await members.add(test, data.users[3].email, pages.Roles.member)
  await pages.checkNoClientError(test)
})

test('Create groups', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goToGroups(test, data.users[0].name)
  for (let i in data.groups) {
    await groups.create(test, data.groups[i])
  }
  await groups.checkCount(test, data.groups.length)
  await pages.checkNoClientError(test)
})

test('Edit group', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goToGroups(test, data.users[0].name)
  const newGroupData = { name: 'Group 1 edited', description: 'A new description for group 1'}
  await groups.edit(test, data.groups[0].name, newGroupData)
  data.groups[0] = newGroupData
  await pages.checkNoClientError(test)
})

test('Add members to groups', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goToMembers(test, data.users[0].name)
  await members.joinGroup(test, data.users[1].name, data.groups[0].name, pages.Roles.manager)
  await members.joinGroup(test, data.users[2].name, data.groups[0].name, pages.Roles.member)
  await members.joinGroup(test, data.users[2].name, data.groups[1].name, pages.Roles.manager)
  await members.joinGroup(test, data.users[3].name, data.groups[1].name, pages.Roles.manager)
  await pages.checkNoClientError(test)
})

test('Check group count', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goToGroups(test, data.users[0].name)
  await groups.checkCount(test, 2)
  await pages.checkNoClientError(test)
})

test('Remove member from group', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goToMembers(test, data.users[0].name)
  await members.leaveGroup(test, data.users[1].name, data.groups[0].name)
  await members.leaveGroup(test, data.users[2].name, data.groups[0].name)
  await members.leaveGroup(test, data.users[2].name, data.groups[1].name)
  await members.leaveGroup(test, data.users[3].name, data.groups[1].name)
  await pages.checkNoClientError(test)
})

test('Delete group', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goToGroups(test, data.users[0].name)
  for (let i in data.groups) await groups.delete(test, data.groups[i].name)
  await pages.checkNoClientError(test)
})

test('Clear groups context', async test => {
  await users.unregisterUsers(test, data.users)
  await pages.checkNoClientError(test)
})