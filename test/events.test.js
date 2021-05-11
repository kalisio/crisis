// Page models
import { Selector } from 'testcafe'
import * as pages from './page-models'
import _ from 'lodash'
import { SideNav } from './page-models'

fixture`events`// declare the fixture
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
  const users = new pages.Users()
  const members = new pages.Members()
  const groups = new pages.Groups()
  const organisations = new pages.Organisations()
  const eventTemplates = new pages.EventTemplates()
  const events = new pages.Events()

const data = {
  users: [
    { name: 'Events owner', email: 'events-owner@kalisio.xyz', password: 'Pass;word1' },
    { name: 'Events manager', email: 'events-manager@kalisio.xyz', password: 'Pass;word1' },
    { name: 'Events member', email: 'events-member@kalisio.xyz', password: 'Pass;word1' }
  ],
  group: { name: 'Events group', description: 'A group' },
  eventTemplates: [
    { name: 'Event template 1', description: 'A first event template' },
    { name: 'Event template 2', description: 'A second event template' }
  ],
  events: [
    { template: 'Event template 1', name: 'Events member', participants: 'Events manager' },
    { template: 'Event template 1', name: 'Events group', participants: 'Events group' },
    { template: 'Event template 2', name: 'Events tag', participants: 'fireman' }
  ]
}

test('Setup events context', async test => {
  await users.registerUsers(test, data.users)
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickLeftOpener(test)
  await layout.clickLeftPaneAction(test, pages.Organisations.ENTRY, pages.Organisations.LONG_WAIT)
  await organisations.goToMembers(test, data.users[0].name)
  await members.add(test, data.users[1].name, pages.Roles.manager)
  await members.tag(test, data.users[1].name, 'fireman')
  await members.add(test, data.users[2].name, pages.Roles.member)
  await layout.clickTopPaneAction(test, 'groups')
  await groups.create(test, data.group)
  await layout.clickTopPaneAction(test, 'event-templates')
  for (let i in data.eventTemplates) {
    await eventTemplates.create(test, data.eventTemplates[i])
  }
})

test('Create events', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  for (let i in data.events) {
    const entry = '#create-' + _.kebabCase(data.events[i].template)
    await layout.openAndClickFab(test, entry)
    await events.create(test, data.events[i])
  }
  await events.checkCount(test, data.events.length)
})

test('Delete event', async test => {
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  for (let i in data.events) await events.delete(test, data.events[i].name)
  await events.checkCount(test, 0)
})

test('Clear events context', async test => {
  // Remove the created group
  await screens.login(test, data.users[0])
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickOverflowMenu(test, pages.Groups.OVERFLOW_MENU_ENTRY)
  await groups.delete(test, data.group.name)
  await layout.clickLeading(test)
  await sideNav.logout(test)
  await screens.goToLoginScreen(test)
  // Unregister the users
  await users.unregisterUsers(test, data.users)
})
