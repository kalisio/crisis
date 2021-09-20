import { expect } from 'chai'
import { core } from '@kalisio/kdk/test.client'
import { countGroups, groupExists } from './groups'

const suite = 'groups'

describe(suite, () => {
  let runner, api, client
  let page
  let user = {
    name: 'My name',
    email: 'my.name@kalisio.xyz',
    password: 'Pass;word1'
  }
  let org

  async function initialize (client) {
    const { _id } = await client.getService('users').create(user)
    // Keep track of ID
    user._id = _id
    await client.login(user)
    // Retrieve private org
    const orgs = await client.getService('organisations').find({ query: { name: user.name } })
    expect(orgs.data.length > 0).to.true
    org = orgs.data[0]
  }

  async function finalize (client) {
    await client.getService('organisations').remove(org._id)
    await client.getService('users').remove(user._id)
  }

  before(async () => {
    api = new core.Api()
    client = api.createClient()
    runner = new core.Runner(suite, {
      browser: {
        slowMo: 1,
        args: ['--lang=fr']
      }
    })
    page = await runner.start()
    await initialize(client)
  })

  beforeEach(async () => {
    runner.clearErrors()
  })

  it('create-group', async () => {
    await core.login(page, user.email, user.password)
  })

  after(async () => {
    // Cleanup
    await finalize(client)
    await runner.stop()
  })
})