const website = 'https://www.kalisio.com'

const serverPort = process.env.PORT || process.env.HTTPS_PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080
const API_PREFIX = '/api'
let domain
let stripeKey
// If we build a specific staging instance
if (process.env.NODE_APP_INSTANCE === 'dev') {
  domain = 'https://aktnmap.dev.kalisio.xyz'
} else if (process.env.NODE_APP_INSTANCE === 'test') {
  domain = 'https://aktnmap.test.kalisio.xyz'
} else if (process.env.NODE_APP_INSTANCE === 'prod') {
  domain = 'https://app.aktnmap.com'
} else {
  // Otherwise we are on a developer machine
  if (process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:' + clientPort
  } else {
    domain = 'http://localhost:' + serverPort
  }
}

module.exports = {
  // Special alias to host loopback interface in cordova
  //domain: 'http://10.0.2.2:8081',
  // If using port forwarding
  //domain: 'http://localhost:8081',
  // If using local IP on WiFi router
  //domain: 'http://192.168.1.16:8081',
  domain,
  version: require('../package.json').version,
  buildNumber: process.env.BUILD_NUMBER,
  apiPath: API_PREFIX,
  apiTimeout: 20000,
  transport: 'websocket', // Could be 'http' or 'websocket',
  stripe: {
    secretKey: process.env.STRIPE_PUBLIC_KEY,
    options: {}
  },
  appName: 'Akt\'n\'Map',
  appLogo: 'aktnmap-logo.png',
  publisher: 'Kalisio',
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  roles: {
    // Member/Manager/Owner
    labels: ['MEMBER_LABEL', 'MANAGER_LABEL', 'OWNER_LABEL'],
    icons: ['person', 'work', 'verified_user']
  },
  screens: {
    banner: 'aktnmap-banner.png',
    extraLinks: [
      { label: 'screen.ABOUT_KALISIO', url: website },
      { label: 'screen.CONTACT', url: website + '/#footer' },
      { label: 'screen.TERMS_AND_POLICIES', url: domain + '/#/terms' },
    ],
    login: {
      providers: ['google', 'github'],
      links: [
        { id: 'reset-password-link', label: 'KLogin.FORGOT_YOUR_PASSWORD_LINK', route: {name: 'send-reset-password' } },
        { id: 'register-link', label: 'KLogin.DONT_HAVE_AN_ACCOUNT_LINK', route: { name: 'register' } }
      ]
    },
    logout: {
      links: [
        { id: 'login-link', label: 'KLogout.LOG_IN_AGAIN_LINK', route: { name: 'login' } },
      ]
    },
    register: {
      links: [
        { id: 'login-link', label: 'KRegister.ALREADY_HAVE_AN_ACCOUNT_LINK', route: { name: 'login' } }
      ]
    },
    changeEndpoint: {
      links: [
        { id: 'login-link', label: 'KChangeEndpoint.LOGIN_LINK', route: { name: 'login' } },
        { id: 'register-link', label: 'KChangeEndpoint.DONT_HAVE_AN_ACCOUNT_LINK', route: { name: 'register' } }
      ]
    }
  },
  layout: {
    view: 'lHh LpR lFf',
    leftBreakpoint: 9999,
    rightBreakpoint: 9999
  }, 
  appBar: {
    title: 'Akt\'n\'Map'
  },
  sideNav: {
    banner: 'aktnmap-banner.png',
    components: {
      user_identity: 'account/KIdentityPanel',
      user_dashboard: 'layout/KLinksPanel',
      user_organisation: 'KOrganisationsPanel',
      user_actions: 'layout/KLinksPanel'
    }
  },
  user_dashboard: {
    links: [
      { },
      { label: 'sideNav.DASHBOARD', icon: 'dashboard', route: { name: 'home' } }
    ]
  },
  user_organisations: {
    icon: 'domain',
    label: 'Organisations'
  },
  user_actions: {
    links: [
      { },
      { label: 'sideNav.HELP', icon: 'help', route: { name: 'help'} },
      { }, // separator
      { label: 'sideNav.LOGOUT', icon: 'exit_to_app', route: { name: 'logout' } }
    ]
  },
  context: {
    service: 'organisations',
    /* Due to complex authorisation management this is now done in the Context app component
    actions: [ ... ]
    */
  },
  mapPanel: {
    categories: [
      { name: 'BusinessLayers', label: 'LayersPanel.BUSINESS_LAYERS', icon: 'layers',
        options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['business'] } } } },
      { name: 'MeteoLayers', label: 'LayersPanel.METEO_LAYERS', icon: 'wb_sunny',
        options: { exclusive: true, filter: { type: 'OverlayLayer', tags: { $in: ['weather'] } } } },
      { name: 'MeasureLayers', label: 'LayersPanel.MEASURE_LAYERS', icon: 'fa-map-pin',
        options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['measure'] } } } },
      { name: 'OverlayLayers', label: 'LayersPanel.OVERLAY_LAYERS', icon: 'fa-map-marker',
        options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $exists: false } } } },
      { name: 'BaseLayers', label: 'LayersPanel.BASE_LAYERS', icon: 'fa-map',
        options: { exclusive: true, filter: { type: 'BaseLayer' } } }
    ]
  },
  map: {
    viewer: {
      minZoom: 3,
      maxZoom: 18,
      center: [47, 3],
      zoom: 6,
      maxBounds: [ [-90, -180], [90, 180] ],
      maxBoundsViscosity: 0.25,
      timeDimension: true,
    },
    // Default GeoJSON layer style for polygons/lines
    featureStyle: {
      opacity: 1,
      radius: 6,
      color: 'red',
      fillOpacity: 0.5,
      fillColor: 'green'
    },
    // Default GeoJSON layer style for points
    pointStyle: {
      type: 'circleMarker',
      options: {
        'radius': 6,
        'stroke': 'red',
        'stroke-opacity': 1,
        'fill-opacity': 0.5,
        'fill-color': 'green'
      }
    },
    // Default GeoJSON popup will display all properties
    popup: {},
    cluster: {},
    fileLayers: {
      fileSizeLimit : 1024 * 1024,
      formats: [ '.geojson', '.kml', '.gpx' ]
    }
  },
  routes: require('./routes')
}
