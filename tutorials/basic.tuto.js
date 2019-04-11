// Page models
import * as pages from '../test/page-models'
import Subtitle from './subtitle'

fixture`Basic`// declare the fixture
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

const app = new pages.ApplicationLayout()
const auth = new pages.Authentication()
const org = new pages.Organisations()
const subtitle =  new Subtitle()

test('Login as default user', async test => {
    await test.setTestSpeed(0.3)

    subtitle.initStart()
    subtitle.startRecord("Authentification")
    await auth.logInAndCloseSignupAlert(test, { email: 'kalisio@kalisio.xyz', password: 'Pass;word1' })
    subtitle.stopRecord()

    subtitle.startRecord("Select Orga")
    await app.openSideNav(test)
    await org.selectOrganisation(test, 'test')
    subtitle.stopRecord()

    subtitle.startRecord("Click member")
    await app.clickToolbar(test, '#members')
    subtitle.stopRecord()
    
    subtitle.startRecord("Click group")
    await app.clickTabBar(test, '#groups')
    subtitle.stopRecord()
    
    subtitle.startRecord("create group")
    await app.clickFab(test, '#create-group')
    subtitle.stopRecord()

    subtitle.exportLogs('Basic');
})