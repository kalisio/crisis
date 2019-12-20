import { Role } from 'testcafe'
import Application from './application'

const app = new Application()

Role('http://localhost:8080/#/login', async test => {
  await app.login(test)
})
