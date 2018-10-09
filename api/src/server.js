import logger from 'winston'
import { kalisio } from 'kCore'

const fs = require('fs-extra')
const https = require('https')
const proxyMiddleware = require('http-proxy-middleware')

const express = require('@feathersjs/express')
const sync = require('feathers-sync')
const services = require('./services')
const middlewares = require('./app.middlewares')
const hooks = require('./app.hooks')
const channels = require('./app.channels')

export class Server {
  constructor () {
    let app = kalisio()
    const syncConfig = app.get('sync')
    if (syncConfig) {
      app.configure(sync(Object.assign({
        uri: app.get('db').url
      }, syncConfig)))
    }
    // Serve pure static assets
    if (process.env.NODE_ENV === 'production') {
      app.use('/', express.static('../dist'))
    }
    // In dev this is done by the webpack server

    // Define HTTP proxies to your custom API backend. See /config/index.js -> proxyTable
    // https://github.com/chimurai/http-proxy-middleware
    const proxyTable = app.get('proxyTable')
    Object.keys(proxyTable).forEach(context => {
      let options = proxyTable[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxyMiddleware(context, options))
    })
    this.app = app
  }

  async run () {
    let app = this.app
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
    if (httpsConfig) {
      const port = httpsConfig.port
      let server = https.createServer({
        key: fs.readFileSync(httpsConfig.key),
        cert: fs.readFileSync(httpsConfig.cert)
      }, app)
      logger.info(`Configuring HTTPS server with pid ${process.pid} at port ${port}`)
      await server.listen(port)
    } else {
      const port = app.get('port')
      logger.info(`Configuring HTTP server with pid ${process.pid} at port ${port}`)
      await app.listen(port)
    }
  }
}
