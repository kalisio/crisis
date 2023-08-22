import _ from 'lodash'
import fs from 'fs-extra'
import https from 'https'
import proxyMiddleware from 'http-proxy-middleware'
import express from '@feathersjs/express'
import sync from 'feathers-sync'
import distribution from '@kalisio/feathers-distributed'
import { kdk } from '@kalisio/kdk/core.api.js'
import services, { checkInactiveOrganisations } from './services/index.js'
import middlewares from './app.middlewares.js'
import hooks from './app.hooks.js'
import channels from './app.channels.js'
import webhooks from './app.webhooks.js'

export class Server {
  constructor () {
    const app = kdk()
    this.app = app

    // Listen to distributed services
    const distConfig = app.get('distribution')
    if (distConfig) app.configure(distribution(distConfig))

    const syncConfig = app.get('sync')
    if (syncConfig) {
      app.configure(sync(syncConfig))
    }

    // Serve pure static assets
    if (process.env.NODE_ENV === 'production') {
      app.use('/', express.static(app.get('distPath')))
    }
    // In dev this is done by the webpack server

    // Define HTTP proxies to your custom API backend. See /config/index.js -> proxyTable
    // https://github.com/chimurai/http-proxy-middleware
    const proxyTable = app.get('proxyTable') || {}
    Object.keys(proxyTable).forEach(context => {
      let options = proxyTable[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxyMiddleware(context, options))
    })
  }

  async run () {
    const app = this.app
    // First try to connect to DB
    await app.db.connect()
    // Then sync if enabled
    if (app.sync) {
      await app.sync.ready
      app.logger.info('Configured application synchronization')
    }
    // Set up our services (see `services/index.js`)
    await app.configure(services)
    // Register hooks
    app.hooks(hooks)
    // Set up real-time event channels
    app.configure(channels)
    // Configure middlewares - always has to be last
    app.configure(middlewares)
    // Register webhooks
    app.configure(webhooks)
    // Check for inactive organisations
    // Need to do this after all hooks have been initialized
    await checkInactiveOrganisations(app)

    // Last lauch server
    const httpsConfig = app.get('https')
    let expressServer
    if (httpsConfig) {
      const port = httpsConfig.port
      const server = https.createServer({
        key: fs.readFileSync(httpsConfig.key),
        cert: fs.readFileSync(httpsConfig.cert)
      }, app)
      app.logger.info(`Configuring HTTPS server with pid ${process.pid} at port ${port}`)
      expressServer = await server.listen(port)
    } else {
      const port = app.get('port')
      app.logger.info(`Configuring HTTP server with pid ${process.pid} at port ${port}`)
      expressServer = await app.listen(port)
    }
    return expressServer
  }
}

export function createServer () {
  const server = new Server()

  const config = server.app.get('logs')
  const logPath = _.get(config, 'DailyRotateFile.dirname')
  if (logPath) {
    // This will ensure the log directory does exist
    fs.ensureDirSync(logPath)
  }

  process.on('unhandledRejection', (reason, p) =>
    server.app.logger.error('Unhandled Rejection: ', reason)
  )

  return server
}

export async function runServer (server) {
  const expressServer = await server.run()
  server.app.logger.info(`Server with pid ${process.pid} started listening`)
  return expressServer
}
