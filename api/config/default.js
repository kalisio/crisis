var path = require('path')
var fs = require('fs')
var winston = require('winston')
const express = require('@feathersjs/express')
var containerized = require('containerized')()

const serverPort = process.env.PORT || process.env.HTTPS_PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080
const API_PREFIX = '/api'
// Start blocking after N requests or N auth requests
let nbRequestsPerMinute = 120
let nbAuthenticationRequestsPerMinute = 10
// Global API limiter
let apiLimiter = {
  http: {
    windowMs: 60*1000, // 1 minute window
    delayAfter: nbRequestsPerMinute / 2, // begin slowing down responses after the 1/2 requests
    delayMs: 1000, // slow down subsequent responses by 1 seconds per request 
    max: nbRequestsPerMinute // start blocking after N requests
  },
  websocket: {
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
    delayAfter: nbAuthenticationRequestsPerMinute / 2, // begin slowing down responses after the 1/2 requests
    delayMs: 3000, // slow down subsequent responses by 3 seconds per request 
    max: nbAuthenticationRequestsPerMinute // start blocking after N requests
  },
  websocket: {
    tokensPerInterval: nbAuthenticationRequestsPerMinute, // start blocking after N requests
    interval: 60*1000 // 1 minute window
  }
}
let domain, topicName, weacastApi
// If we build a specific staging instance
if (process.env.NODE_APP_INSTANCE === 'dev') {
  // For benchmarking
  apiLimiter = null
  limiter = null
  domain = 'https://aktnmap.dev.kalisio.xyz'
  // For SNS topic name generation
  topicName = (object) => `aktnmap-dev-${object._id.toString()}`
} else if (process.env.NODE_APP_INSTANCE === 'test') {
  domain = 'https://aktnmap.test.kalisio.xyz'
  // For SNS topic name generation
  topicName = (object) => `aktnmap-test-${object._id.toString()}`
} else if (process.env.NODE_APP_INSTANCE === 'prod') {
  domain = 'https://app.aktnmap.com'
  // For SNS topic name generation
  topicName = (object) => `aktnmap-${object._id.toString()}`
} else {
  // Otherwise we are on a developer machine
  if (process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:' + clientPort // Akt'n'Map app client/server port = 8080/8081
  } else {
    domain = 'http://localhost:' + serverPort // Akt'n'Map app client/server port = 8081
  }
  // For SNS topic name generation
  topicName = (object) => `aktnmap-dev-${object._id.toString()}`
  // For benchmarking
  apiLimiter = null
  limiter = null
}

module.exports = {
  // Proxy your API if using any.
  // Also see /build/script.dev.js and search for "proxy api requests"
  // https://github.com/chimurai/http-proxy-middleware
  proxyTable: {},
  domain,
  host: process.env.HOSTNAME || 'localhost',
  port: serverPort,
  /* To enable HTTPS
  https: {
    key: path.join(__dirname, 'server.key'),
    cert: path.join(__dirname, 'server.crt'),
    port: serverPort
  },
  */
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
  distribution: { // Distribute no services simply use remote ones
    services: (service) => false,
    middlewares: { after: express.errorHandler() },
    key: 'aktnmap'
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
    strategies: [
      'jwt',
      'local'
    ],
    path: API_PREFIX + '/authentication',
    service: API_PREFIX + '/users',
    jwt: {
      header: { typ: 'access' }, // See https://tools.ietf.org/html/rfc7519#section-5.1
      audience: process.env.SUBDOMAIN || 'kalisio', // The resource server where the token is processed
      issuer: 'kalisio', // The issuing server, application or resource
      algorithm: 'HS256', // See https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback
      expiresIn: '1d'
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
    // Authentication limiter
    limiter,
    defaultUsers: [
      {
        email: 'kalisio@kalisio.xyz',
        password: 'Pass;word1',
        /*
        device: {
          registrationId: 'xxx',
          number: '+xxx',
          platform: 'ANDROID'
        }
        */
        name: 'Kalisio'
      }
    ],
    /* Removed from default config
    github: {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: domain + '/auth/github/callback',
      successRedirect: domain + '/',
      failureRedirect: domain + '/#/login' +
        '?error_message=An error occured while authenticating with GitHub, check you correctly authorized the application and have a valid public email in your profile'
    },
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: domain + '/auth/google/callback',
      successRedirect: domain + '/',
      failureRedirect: domain + '/#/login' +
        '?error_message=An error occured while authenticating with Google, check you correctly authorized the application and have a valid public email in your profile',
      scope: ['profile', 'email']
    },
    */
    // Required for OAuth2 to work correctly
    cookie: {
      enabled: true,
      name: 'aktnmap-jwt',
      httpOnly: false,
      secure: (process.env.NODE_ENV === 'development' ? false : true)
    }
  },
  authorisation: {
    cache: {
      maxUsers: 1000
    }
  },
  organisations: {
    // nothing for now
  },
  quotas: {
    global: {
      bronze: 1
    },
    bronze: {
      members: 10,
      // Setup some default quotas in dev so that we can perform testing more easily
      groups: (process.env.NODE_ENV === 'development' ? 5 : 1),
      events: -1,
      'event-templates': (process.env.NODE_ENV === 'development' ? 5 : 1),
      alerts: (process.env.NODE_ENV === 'development' ? 5 : 1)
    },
    silver: {
      members: 25,
      groups: 5,
      events: -1,
      'event-templates': 5,
      alerts: 5
    },
    gold: {
      members: 250,
      groups: -1,
      events: -1,
      'event-templates': -1,
      alerts: 50
    },
    diamond: {
      members: -1,
      groups: -1,
      events: -1,
      'event-templates': -1,
      alerts: -1
    }
  },
  mailer: {
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_MAIL_USER,
      pass: process.env.GOOGLE_MAIL_PASSWORD
    },
    templateDir: path.join(__dirname, 'email-templates')
  },
  pusher: {
    accessKeyId: process.env.SNS_ACCESS_KEY,
    secretAccessKey: process.env.SNS_SECRET_ACCESS_KEY,
    region: 'eu-west-1',
    apiVersion: '2010-03-31',
    platforms: {
      ANDROID: process.env.SNS_ANDROID_ARN,
      IOS: process.env.SNS_IOS_ARN
    },
    topicName,
    topics: (process.env.SNS_ANDROID_TOPIC_ARN && process.env.SNS_IOS_TOPIC_ARN ? {
      ANDROID: process.env.SNS_ANDROID_TOPIC_ARN,
      IOS: process.env.SNS_IOS_TOPIC_ARN
    } : undefined)
  },
  mapillary: {
    clientID: process.env.MAPILLARY_CLIENTID
  },
  geocoder: {
    providers: [{ provider: 'opendatafrance' }, { provider: 'openstreetmap' }]
  },
  billing: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    daysUntilInvoiceDue: 7,
    plans: {
      // First plan is the default one
      bronze: {
        color: 'light-green-4',
        default: true
      },
      silver: {
        color: 'light-green-6',
        stripeId: (process.env.NODE_APP_INSTANCE === 'prod' ? 'plan_D9lRPmBX3N4MzO' : 'plan_DHd5HGwsl31NoC')
      },
      gold: {
        color: 'light-green-8',
        stripeId: (process.env.NODE_APP_INSTANCE === 'prod' ? 'plan_D9lSeSigaoIck3' : 'plan_DHd5RMLMSlpUmQ')
      },
      diamond: {
        color: 'light-green-10',
        url: 'https://kalisio.com/contact'
      }
    },
    options: {
      archiving: {
        color: 'light-green-6',
        stripeId: (process.env.NODE_APP_INSTANCE === 'prod' ? 'price_1Gs1lWDSpJUNa66oZRWs98Lq' : 'price_1Gs1p7DSpJUNa66ohJbWnsos')
      },
      catalog: {
        color: 'light-green-6',
        stripeId: (process.env.NODE_APP_INSTANCE === 'prod' ? 'price_1Gs1lWDSpJUNa66obhxqjSph' : 'price_1Gs1p7DSpJUNa66oHtX9IDzG')
      }
    }
  },
  logs: {
    Console: {
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      level: (process.env.NODE_ENV === 'development' ? 'verbose' : 'info')
    },
    DailyRotateFile: {
      format: winston.format.json(),
      dirname: path.join(__dirname, '..', 'logs'),
      filename: 'aktnmap-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d'
    }
  },
  db: {
    adapter: 'mongodb',
    url: process.env.DB_URL || (containerized ? 'mongodb://mongodb:27017/aktnmap' : 'mongodb://127.0.0.1:27017/aktnmap')
  },
  storage: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    bucket: process.env.S3_BUCKET
  },
  sync: {
    collection: 'events'
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
