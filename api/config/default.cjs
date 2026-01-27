const path = require('path')
const fs = require('fs')
var winston = require('winston')
const express = require('@feathersjs/express')
const containerized = require('containerized')()

const N = parseInt(process.env.NODE_APP_NB_INSTANCES)
const serverPort = process.env.PORT || process.env.HTTPS_PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080
const API_PREFIX = '/api'
// Start blocking after N requests or N auth requests
const nbRequestsPerMinute = 240
const nbAuthenticationRequestsPerMinute = 10
// Whitelist features services from rate limiting as they use a lot of concurrent requests
const apiLimiterWhitelist = (service) => (service.path && service.path.includes('features')) || (service.key === 'kano') || (service.key === 'weacast')
// Global API limiter
let apiLimiter = {
  http: {
    services: apiLimiterWhitelist,
    windowMs: 60 * 1000, // 1 minute window
    max: nbRequestsPerMinute // start blocking after N requests
  },
  websocket: {
    services: apiLimiterWhitelist,
    tokensPerInterval: nbRequestsPerMinute, // start blocking after N requests
    interval: 60*1000 // 1 minute window
    /*
    maxConcurrency: 500, // Number of simultaneous connections globally allowed, 0 means no limit
    concurrency: 10 // Number of simultaneous connections allowed per IP, 0 means no limit
    */
  }
}
// Authentication limiter
let limiter = {
  http: {
    windowMs: 60*1000, // 1 minute window
    max: nbAuthenticationRequestsPerMinute // start blocking after N requests
  },
  websocket: {
    tokensPerInterval: nbAuthenticationRequestsPerMinute, // start blocking after N requests
    interval: 60*1000 // 1 minute window
  }
}
let domain, weacastApi
// If we build a specific staging instance
if (process.env.NODE_APP_INSTANCE === 'dev') {
  // For benchmarking
  apiLimiter = null
  limiter = null
  domain = 'https://crisis.dev.kalisio.xyz'
} else if (process.env.NODE_APP_INSTANCE === 'test') {
  domain = 'https://crisis.test.kalisio.xyz'
} else if (process.env.NODE_APP_INSTANCE === 'prod') {
  domain = 'https://crisis.planet.kalisio.com'
} else {
  // Otherwise we are on a developer machine
  if (process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:' + clientPort // Crisis app client/server port = 8080/8081
  } else {
    domain = 'http://localhost:' + serverPort // Crisis app client/server port = 8081
  }
  // For benchmarking
  //apiLimiter = null
  //limiter = null
}
// Override defaults if env provided
if (process.env.SUBDOMAIN) {
  domain = 'https://crisis.' + process.env.SUBDOMAIN
}

module.exports = {
  // Proxy your API if using any.
  // Also see /build/script.dev.js and search for "proxy api requests"
  // https://github.com/chimurai/http-proxy-middleware
  proxyTable: {},
  domain,
  host: process.env.HOSTNAME || 'localhost',
  port: serverPort,
  distPath: fs.existsSync(path.join(__dirname, '../../dist/pwa')) ? path.join(__dirname, '../../dist/pwa') : path.join(__dirname, '../../dist/spa'),
  /* To enable HTTPS
  https: {
    key: path.join(__dirname, 'server.key'),
    cert: path.join(__dirname, 'server.crt'),
    port: serverPort
  },
  */
  planets: {
    'kalisio-planet': {
      domain: process.env.KALISIO_PLANET_KANO_URL || domain.replace('crisis', 'kano'),
      gateway: process.env.KALISIO_PLANET_GATEWAY_URL || domain.replace('crisis', 'api')
    }
  },
  planetTokens: {
    'kalisio-planet': process.env.KALISIO_PLANET_KANO_JWT
  },
  apiPath: API_PREFIX,
  socketio: {
    // This avoid the issue of disconnecting the socket when sending a large amout of data
    // See https://github.com/socketio/socket.io/issues/2666, https://github.com/socketio/socket.io/issues/2769
    pingTimeout: 30000,
    // Used to avoid DoS by limiting max message size
    maxHttpBufferSize: 10 * 1024 * 1024 // 10MB
  },
  bodyParser: {
    json: { limit: 10 * 1024 * 1024 } // 10MB
  },
  distribution: { // Distribute organisation services
    services: (service) => service.path.includes('organisation') ||
                           service.path.includes('configurations') ||
                           service.path.includes('catalog') ||
                           service.path.includes('features') ||
                           service.path.includes('projects') ||
                           service.path.includes('styles') ||
                           service.path.includes('alerts'),
    remoteServices: (service) => (service.key === 'weacast') || (service.key === 'kano'),
    middlewares: { after: express.errorHandler() },
    // When called internally from remote service do not authenticate,
    // this assumes a gateway scenario where authentication is performed externally
    authentication: false,
    key: 'crisis',
    healthcheckPath: API_PREFIX + '/distribution/',
    // Increase default timeout due to possible large data volume
    timeout: process.env.DISTRIBUTION_TIMEOUT ? parseInt(process.env.DISTRIBUTION_TIMEOUT) : 60000
  },
  paginate: {
    default: 20,
    max: 50
  },
  // Global API limiter
  apiLimiter,
  authentication: {
    secret: process.env.APP_SECRET,
    appId: process.env.APP_ID,
    path: API_PREFIX + '/authentication',
    service: API_PREFIX + '/users',
    entity: 'user',
    authStrategies: [
      'jwt',
      'local'
    ],
    local: {
      usernameField: 'email',
      passwordField: 'password'
    },
    jwtOptions: {
      header: {
        type: 'access' // See https://tools.ietf.org/html/rfc7519#section-5.1
      },
      audience: process.env.SUBDOMAIN || 'kalisio', // The resource server where the token is processed
      issuer: 'kalisio', // The issuing server, application or resource
      algorithm: 'HS256', // See https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
      expiresIn: '7d'
    },
    oauth: {
      redirect: domain + '/',
      defaults: {
        origin: domain
      }
    },
    passwordPolicy: {
      minLength: 8,
      maxLength: 128,
      uppercase: true,
      lowercase: true,
      digits: true,
      symbols: true,
      prohibited: fs.readFileSync(path.join(__dirname, '10k_most_common_passwords.txt')).toString().split('\n'),
      history: 5
    },
    invitationExpireAfter: 7 * 24 * 60 * 60, // 7 days in seconds
    // Authentication limiter
    limiter,
    defaultUsers: [
      {
        email: 'kalisio@kalisio.xyz',
        password: 'Pass;word1',
        name: 'Kalisio'
      }
    ]
  },
  authorisation: {
    cache: {
      maxUsers: 100000
    }
  },
  defaultConfigurations: [{
    name: 'userCategoriesOrder',
    value: []
  }, {
    name: 'defaultCategoriesOrder',
    value: [
      "Categories.LAB_LAYERS",
      "Categories.ADMINISTRATIVE_LAYERS",
      "Categories.ATMOSPHERIC_LAYERS",
      "Categories.BUSINESS_LAYERS",
      "Categories.HYDROGRAPHY_LAYERS",
      "Categories.INFRASTRUCTURE_LAYERS",
      "Categories.RADIOACTIVITY_LAYERS",
      "Categories.SENSOR_LAYERS",
      "Categories.SHOT_LAYERS",
      "Categories.WEATHER_MEASURE_LAYERS",
      "Categories.WEATHER_FORECAST_LAYERS",
      "Categories.TERRAIN_LAYERS",
      "Categories.BASE_LAYERS",
    ],
  }, {
    name: 'userOrphanLayersOrder',
    value: []
  }],
  organisations: {
    inactivityDuration: (process.env.NODE_ENV === 'development' ? 'P-7D' : 'P-1Y')
  },
  quotas: {
    // Setup some default quotas in dev so that we can perform testing more easily
    organisations: (process.env.NODE_ENV === 'development' ? 2 : 1),
    members: 10,
    groups: (process.env.NODE_ENV === 'development' ? 5 : 1),
    tags: (process.env.NODE_ENV === 'development' ? 10 : 5),
    events: -1,
    'event-templates': (process.env.NODE_ENV === 'development' ? 5 : 1),
    'archived-events': (process.env.NODE_ENV === 'development' ? -1 : 0),
    plans: (process.env.NODE_ENV === 'development' ? 5 : 0),
    'plan-templates': (process.env.NODE_ENV === 'development' ? 5 : 0),
    'archived-plans': (process.env.NODE_ENV === 'development' ? -1 : 0),
    catalog: (process.env.NODE_ENV === 'development' ? -1 : 0),
    alerts: (process.env.NODE_ENV === 'development' ? 5 : 1)
  },
  mailer: {
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_MAIL_USER,
      // Not required anymore for OAuth2
      //pass: process.env.GOOGLE_MAIL_PASSWORD
      serviceClient: process.env.GOOGLE_MAIL_CLIENT_ID,
      // New lines in env var causes some problems and raises the following error
      // Uncaught Error: error:0909006C:PEM routines:get_name:no start line
      privateKey: process.env.GOOGLE_MAIL_PRIVATE_KEY
    },
    templateDir: path.join(__dirname, 'email-templates')
  },
  mapillary: {
    token: process.env.MAPILLARY_TOKEN
  },
  logs: {
    Console: {
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      level: (process.env.NODE_ENV === 'development' ? 'verbose' : 'info')
    },
    DailyRotateFile: {
      format: winston.format.json(),
      dirname: path.join(__dirname, '..', 'logs'),
      filename: 'crisis-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    }
  },
  db: {
    adapter: 'mongodb',
    url: process.env.DB_URL || (containerized ? 'mongodb://mongodb:27017/crisis' : 'mongodb://127.0.0.1:27017/crisis')
  },
  storage: (process.env.S3_BUCKET ? {
    s3Client: {
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY || process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
      },
      endpoint: process.env.S3_ENDPOINT,
      region: process.env.S3_REGION,
      signatureVersion: 'v4'
    },
    bucket: process.env.S3_BUCKET
  } : undefined),
  'import-export': {
    s3Options: {
      s3Client: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY || process.env.S3_ACCESS_KEY_ID,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
        },
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION,
        signatureVersion: 'v4'
      },
      bucket: process.env.S3_BUCKET,
      prefix: 'tmp'
    },
    workingDir: process.env.TMP_DIR || 'tmp',
    allowedServicePaths: ['^api/[a-f0-9]{24}/archived-events', '^api/[a-f0-9]{24}/groups', '^api/[a-f0-9]{24}/members', '^api/[a-f0-9]{24}/tags']
  },
  // When multiple instances are running we need to sync them
  sync: ((N > 1) || process.env.REDIS_URL ? {
    // When using mubsub, now deprecated see https://github.com/feathersjs-ecosystem/feathers-sync/pull/135
    //collection: 'events'
    // When using redis
    uri: process.env.REDIS_URL || (containerized ? 'redis://redis:6379' : 'redis://localhost:6379')
  } : false),
  push: {
    vapidDetails: {
      subject: process.env.VAPID_SUBJECT,
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY
    }
  }
}

/*
 * proxyTable example:
 *
   proxyTable: {
      // proxy all requests starting with /api
      '/api': {
        target: 'https://some.address.com/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
 */
