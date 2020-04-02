const website = 'https://www.kalisio.com'

const serverPort = process.env.PORT || process.env.HTTPS_PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080
const API_PREFIX = '/api'
let domain, weacastApi
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
    domain = 'http://localhost:' + clientPort // Akt'n'Map app client/server port = 8080/8081
    weacastApi = 'http://localhost:' + (Number(clientPort)+2) // Weacast app client/server port = 8082/8083
  } else {
    domain = 'http://localhost:' + serverPort // Akt'n'Map app client/server port = 8081
    weacastApi = 'http://localhost:' + (Number(serverPort)+1) // Weacast app client/server port = 8082
  }
}
// Override defaults if env provided
if (process.env.SUBDOMAIN) {
  domain = 'https://aktnmap.' + process.env.SUBDOMAIN
}
// On a developer machine will do domain = gateway = localhost
const gateway = domain.replace('kano', 'api')

let defaultMapOptions = {
  viewer: {
    minZoom: 3,
    maxZoom: 19,
    center: [47, 3],
    zoom: 6,
    maxBounds: [ [-90, -180], [90, 180] ],
    maxBoundsViscosity: 0.25
  },
  // Default GeoJSON layer style for polygons/lines
  featureStyle: {
    opacity: 1,
    color: 'red',
    'fill-opacity': 0.5,
    'fill-color': 'green'
  },
  // Default GeoJSON layer style for polygons/lines edition
  editFeatureStyle: {
    opacity: 1,
    color: 'red',
    'fill-opacity': 0.5,
    'fill-color': 'green'
  },
  // Default GeoJSON layer style for points
  pointStyle: {
    'icon-color': '#FFFFFF',
    'marker-color': '#2196f3',
    'icon-classes': 'fas fa-circle'
  },
  // Default GeoJSON layer style for points edition
  editPointStyle: {
    'marker-type': 'circleMarker',
    radius: 6,
    stroke: 'red',
    'stroke-opacity': 1,
    'fill-opacity': 0.5,
    'fill-color': 'green'
  },
  // Default GeoJSON infobox will display all properties
  popup: { pick: [] },
  infobox: {},
  cluster: { disableClusteringAtZoom: 18 },
  fileLayers: {
    fileSizeLimit : 1024 * 1024,
    formats: [ '.geojson', '.kml', '.gpx' ]
  }
}

const baseLayers = { name: 'BaseLayers', label: 'KCatalogPanel.BASE_LAYERS', icon: 'fas fa-map',
  options: { exclusive: true, filter: { type: 'BaseLayer' } } }
const businessLayers = { name: 'BusinessLayers', label: 'KCatalogPanel.BUSINESS_LAYERS', icon: 'layers',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['business'] } } } }
const overlayLayers = { name: 'OverlayLayers', label: 'KCatalogPanel.OVERLAY_LAYERS', icon: 'fas fa-map-marker',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $exists: false } } } }
const measureLayers = { name: 'MeasureLayers', label: 'KCatalogPanel.MEASURE_LAYERS', icon: 'fas fa-map-pin',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['measure'] } } } }
const meteoLayers = { name: 'MeteoLayers', label: 'KCatalogPanel.METEO_LAYERS', icon: 'wb_sunny',
  options: { exclusive: true, filter: { type: 'OverlayLayer', tags: { $in: ['weather'] } } } }

let defaultMapCatalog = {
  categories: [
    baseLayers,
    businessLayers,
    overlayLayers,
    measureLayers,
    meteoLayers
  ]
}

module.exports = {
  // Special alias to host loopback interface in cordova
  //domain: 'http://10.0.2.2:8081',
  // If using port forwarding
  //domain: 'http://localhost:8081',
  // If using local IP on WiFi router
  //domain: 'http://192.168.1.16:8081',
  domain,
  flavor: process.env.NODE_APP_INSTANCE || 'dev',
  version: require('../package.json').version,
  buildNumber: process.env.BUILD_NUMBER,
  apiPath: API_PREFIX,
  apiJwt: 'aktnmap-jwt',
  apiTimeout: 20000,
  transport: 'websocket', // Could be 'http' or 'websocket',
  gateway: 'https://api.',
  gatewayJwtField: 'jwt',
  gatewayJwt: 'kano-gateway-jwt',
  appName: 'Akt\'n\'Map',
  appLogo: 'aktnmap-logo.png',
  appWebsite: 'https://kalisio.com/solutions#aktnmap',
  publisher: 'Kalisio',
  publisherWebsite: website,
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  stripe: {
    secretKey: process.env.STRIPE_PUBLIC_KEY,
    options: {}
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
    leftDrawer: {
      behavior: 'mobile',
      component: {
        name: 'layout/KSideNav'
      }
    },
    rightDrawer: {
      behavior: 'mobile'
    }
  }, 
  appBar: {
    title: 'Akt\'n\'Map'
  },
  sideNav: {
    banner: 'aktnmap-banner.png',
    components: {
      user_identity: 'account/KIdentityPanel',
      user_dashboard: 'layout/KLinksPanel',
      user_organisation: 'team/KOrganisationsPanel',
      user_settings: 'Settings',
      app_about: 'layout/KAbout',
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
  catalog: defaultMapOptions,
  catalogCatalog: defaultMapCatalog,
  catalogActivity: {
    tools: ['track-location', 'location-bar', 'fullscreen', 'catalog'],
    actions: ['create-layer'],
    layerActions: ['zoom-to', 'save', 'edit', 'view-data', 'chart-data', 'edit-data', 'remove']
  },
  event: defaultMapOptions,
  eventCatalog: defaultMapCatalog,
  eventActivity: {
    tools: ['track-location', 'location-bar', 'fullscreen', 'catalog'],
    actions: ['probe-location'],
    layerActions: ['zoom-to'],
    timeline: { end: 2*60*60*24 } // T0 + 48H forecast
  },
  archivedEvents: defaultMapOptions,
  archivedEventsCatalog: { categories: [baseLayers, overlayLayers] },
  archivedEventsActivity: {
    tools: ['fullscreen', 'catalog'],
    actions: [],
    layerActions: ['zoom-to'],
    restore: { view: false }
  },
  routes: require('../src/router/routes')
}
