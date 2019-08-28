import distribution from '@kalisio/feathers-distributed'
import { kalisio } from '@kalisio/kdk-core'

import fs from 'fs-extra'
import https from 'https'
import proxyMiddleware from 'http-proxy-middleware'

import express from '@feathersjs/express'
import sync from 'feathers-sync'
import services from './services'
import middlewares from './app.middlewares'
import hooks from './app.hooks'
import channels from './app.channels'

export class Server {
  constructor () {
    const app = kalisio()
    this.app = app

    // Listen to distributed services
    const distConfig = app.get('distribution')
    if (distConfig) app.configure(distribution(distConfig))

    const syncConfig = app.get('sync')
    if (syncConfig) {
      app.configure(sync(Object.assign({
        uri: app.get('db').url
      }, syncConfig)))
    }

    // Serve pure static assets
    if (process.env.NODE_ENV === 'production') {
      app.use('/', express.static('../dist/spa'))
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

    // Set up our services (see `services/index.js`)
    await app.configure(services)
    // Register authorisation, perspective, etc. hooks
    app.hooks(hooks)
    // Set up real-time event channels
    app.configure(channels)
    // Configure middlewares - always has to be last
    app.configure(middlewares)

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
