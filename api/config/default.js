var path = require('path')
var fs = require('fs')
var containerized = require('containerized')()
const layers = require('./layers')

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
  weacastApi = 'https://weacast.dev.kalisio.xyz'
  // For SNS topic name generation
  topicName = (object) => `aktnmap-dev-${object._id.toString()}`
} else if (process.env.NODE_APP_INSTANCE === 'test') {
  domain = 'https://app.test.aktnmap.xyz'
  weacastApi = 'https://weacast.test.kalisio.xyz'
  // For SNS topic name generation
  topicName = (object) => `aktnmap-test-${object._id.toString()}`
} else if (process.env.NODE_APP_INSTANCE === 'prod') {
  domain = 'https://app.aktnmap.com'
  weacastApi = 'https://weacast.kalisio.xyz'
  // For SNS topic name generation
  topicName = (object) => `aktnmap-${object._id.toString()}`
} else {
  // Otherwise we are on a developer machine
  if (process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:' + clientPort // Akt'n'Map app client/server port = 8080/8081
    weacastApi = 'http://localhost:' + (clientPort+2) // Weacast app client/server port = 8082/8083
  } else {
    domain = 'http://localhost:' + serverPort // Akt'n'Map app client/server port = 8081
    weacastApi = 'http://localhost:' + (serverPort+1) // Weacast app client/server port = 8082
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
  paginate: {
    default: 20,
    max: 50
  },
  // Global API limiter
  apiLimiter,
  authentication: {
    secret: process.env.APP_SECRET,
    strategies: [
      'jwt',
      'local'
    ],
    path: API_PREFIX + '/authentication',
    service: API_PREFIX + '/users',
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
      scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
    },
    // Required for OAuth2 to work correctly
    cookie: {
      enabled: true,
      name: 'feathers-jwt',
      httpOnly: false,
      secure: (process.env.NODE_ENV === 'development' ? false : true)
    }
  },
  authorisation: {
    cache: {
      maxUsers: 1000
    }
  },
  quotas: {
    global: {
      bronze: 1
    },
    bronze: {
      members: 25,
      groups: 5,
      events: -1,
      'event-templates': 5
    },
    silver: {
      members: 50,
      groups: 10,
      events: -1,
      'event-templates': -1
    },
    gold: {
      members: 250,
      groups: -1,
      events: -1,
      'event-templates': -1
    },
    diamond: {
      members: -1,
      groups: -1,
      events: -1,
      'event-templates': -1
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
    topicName
  },
  geocoder: {
    provider: 'opendatafrance'
  },
  catalog: {
    layers,
    paginate: {
      default: 100,
      max: 100
    }
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
        stripeId: (process.env.NODE_APP_INSTANCE === 'prod' ? 'plan_D9lRPmBX3N4MzO' : 'plan_DHd5HGwsl31NoC'),
      },
      gold: {
        color: 'light-green-8',
        stripeId: (process.env.NODE_APP_INSTANCE === 'prod' ? 'plan_D9lSeSigaoIck3' : 'plan_DHd5RMLMSlpUmQ'),
      },
      diamond: {
        color: 'light-green-10',
        url: 'https://aktnmap.com/#footer'
      }
    }
  },
  logs: {
    Console: {
      colorize: true,
      level: (process.env.NODE_ENV === 'development' ? 'verbose' : 'info')
    },
    DailyRotateFile: {
      dirname: path.join(__dirname, '..', 'logs'),
      filename: 'aktnmap-',
      datePattern: 'yyyy-MM-dd.log',
      maxDays: 30
      /* Possible in next version of the logger : see https://github.com/winstonjs/winston-daily-rotate-file/pull/45
      filename: path.join(__dirname, '..', 'logs'),
      datePattern: '/yyyy/MM/dd.log',
      createTree: true
      */
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
