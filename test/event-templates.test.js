// Page models
import * as pages from './page-models'

fixture`event-templates`// declare the fixture
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
const eventTemplates = new pages.EventTemplates()

const data = {
  user: { name: 'Templates owner', email: 'templates-owner@kalisio.xyz', password: 'Pass;word1' },
  templates: [
    { name: 'Template 1', description: 'A first template without a workflow' },
    { name: 'Copy of Template 1', description: 'A copy of template one' },
    { name: 'Template 2', description: 'A second template with a workflow' }
  ]
}

test('Setup context', async test => {
  await users.registerUsers(test, [data.user])
})

test('Create template', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickTabBar(test, pages.EventTemplates.TAB_BAR_ENTRY)
  await layout.clickFab(test)
  await eventTemplates.create(test, data.templates[0])
  await eventTemplates.checkCount(test, 1)
})

test('Copy template', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickTabBar(test, pages.EventTemplates.TAB_BAR_ENTRY)
  await eventTemplates.copy(test, data.templates[0].name, data.templates[1])
  await eventTemplates.checkCount(test, 2)
})

test('Edit template description', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickTabBar(test, pages.EventTemplates.TAB_BAR_ENTRY)
  await eventTemplates.edit(test, data.templates[1].name,  data.templates[2])
})

test('Delete template', async test => {
  await screens.login(test, data.user)
  await layout.closeSignupAlert(test)
  await layout.closeWelcomeDialog(test)
  await layout.clickTabBar(test, pages.EventTemplates.TAB_BAR_ENTRY)
  await eventTemplates.delete(test, data.templates[0].name)
  await eventTemplates.checkCount(test, 1)
})

test('Unregisters user', async test => {
  await users.unregisterUsers(test, [data.user])
})
