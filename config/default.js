const website = 'https://www.kalisio.com'
const onlineHelp = 'https://kalisio.github.io/aktnmap'

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
  domain = 'https://aktnmap.prod.kalisio.com'
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
    'stroke-opacity': 1,
    'stroke-color': 'red',
    'stroke-width': 3,
    'fill-opacity': 0.5,
    'fill-color': 'green'
  },
  // Default GeoJSON layer style for polygons/lines edition
  editFeatureStyle: {
    'stroke-opacity': 1,
    'stroke-color': 'red',
    'stroke-width': 3,
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
    'stroke-color': 'red',
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

const baseLayers = { name: 'BaseLayers', label: 'KCatalogPanel.BASE_LAYERS', icon: 'las la-layer-group',
  options: { exclusive: true, filter: { type: 'BaseLayer' } } }
const businessLayers = { name: 'BusinessLayers', label: 'KCatalogPanel.BUSINESS_LAYERS', icon: 'las la-briefcase',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['business'] } } } }
const capturedLayers = { name: 'CapturedLayers', label: 'KCatalogPanel.CAPTURED_LAYERS', icon: 'las la-street-view',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['captured'] } } } }
const overlayLayers = { name: 'OverlayLayers', label: 'KCatalogPanel.OVERLAY_LAYERS', icon: 'las la-map-marker',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $exists: false } } } }
const measureLayers = { name: 'MeasureLayers', label: 'KCatalogPanel.MEASURE_LAYERS', icon: 'fas la-map-pin',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['measure'] } } } }
const meteoLayers = { name: 'MeteoLayers', label: 'KCatalogPanel.METEO_LAYERS', icon: 'las la-cloud-sun-rain', component: 'catalog/KWeatherLayersSelector',
  options: { exclusive: true, filter: { type: 'OverlayLayer', tags: { $in: ['weather'] } } } }

let defaultMapCatalog = {
  categories: [
    baseLayers,
    businessLayers,
    capturedLayers,
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
  appOnlineHelp: onlineHelp,
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
    labels: ['MEMBER', 'MANAGER', 'OWNER'],
    icons: ['las la-user', 'las la-briefcase', 'las la-certificate']
  },
  context: {
    service: 'organisations'
  },
  screens: {
    banner: 'aktnmap-banner.png',
    extraLinks: [
      { label: 'screen.ABOUT_KALISIO', url: website },
      { label: 'screen.CONTACT', url: website + '/#footer' },
      { label: 'screen.TERMS_AND_POLICIES', url: domain + '/#/terms' },
    ],
    login: {
      /* Removed from default config
      providers: ['google', 'github'],
      */
      links: [
        { id: 'reset-password-link', label: 'KLogin.FORGOT_YOUR_PASSWORD_LINK', route: {name: 'send-reset-password' } },
        { id: 'register-link', label: 'KLogin.DONT_HAVE_AN_ACCOUNT_LINK', route: { name: 'register' } },
        { id: 'contextual-help', label: 'KLogin.CONTEXTUAL_HELP', route: { name: 'login', query: { tour: true } } }
      ]
    },
    logout: {
      links: [
        { id: 'login-link', label: 'KLogout.LOG_IN_AGAIN_LINK', route: { name: 'login' } },
      ]
    },
    register: {
      links: [
        { id: 'login-link', label: 'KRegister.ALREADY_HAVE_AN_ACCOUNT_LINK', route: { name: 'login' } },
        { id: 'contextual-help', label: 'KRegister.CONTEXTUAL_HELP', route: { name: 'register', query: { tour: true } } }
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
    topPane: {
      opener: true,
      visible: true
    },
    bottomPane: {
      opener: true
    },
    leftDrawer: {
      content: [
        { component: 'QImg', src: 'statics/aktnmap-banner.png' },
        { component: 'account/KIdentityPanel', class: 'full-width' },
        { component: 'Settings' },
        { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px;' },
        { component: 'layout/KAbout' },
        { id: 'contextual-help', icon: 'las la-question-circle', label: 'sideNav.CONTEXTUAL_HELP', url: onlineHelp, renderer: 'item' },
        { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px;' },
        { id: 'logout', icon: 'las la-sign-out-alt', label: 'sideNav.LOGOUT', route: { name: 'logout' }, renderer: 'item' }
      ],
      behavior: 'mobile',
      opener: true
    },
    rightDrawer: {
      behavior: 'mobile',
      opener: true
    }
  },
  accountActivity: {
    topPane: {
      content: {
        profile: [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'back' } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', color: 'primary', label: 'KAccountActivity.PROFILE', disabled: true },
          { id: 'security', icon: 'las la-shield-alt', tooltip: 'KAccountActivity.SECURITY', route: { name: 'account-activity', params: { page: 'security' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: 'KAccountActivity.DANGER_ZONE', route: { name: 'account-activity', params: { page: 'danger-zone' } } }
        ],
        security: [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'back' } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', tooltip: 'KAccountActivity.PROFILE', route: { name: 'account-activity', params: { page: 'profile' } } },
          { id: 'security', icon: 'las la-shield-alt', color: 'primary', label: 'KAccountActivity.SECURITY', disabled: true },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: 'KAccountActivity.DANGER_ZONE', route: { name: 'account-activity', params: { page: 'danger-zone' } } }
        ],
        'danger-zone': [
          { id: 'go-back', icon: 'las la-arrow-left', handler: { name: 'back' } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', tooltip: 'KAccountActivity.PROFILE', route: { name: 'account-activity', params: { page: 'profile' } } },
          { id: 'security', icon: 'las la-shield-alt', tooltip: 'KAccountActivity.SECURITY', route: { name: 'account-activity', params: { page: 'security' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', color: 'primary', label: 'KAccountActivity.DANGER_ZONE', disabled: true }
        ]
      }
    }
  },
  organisationsActivity: {
    topPane: {
      content: {
        'default': [
          { id: 'my-organisations', icon: 'las la-home', label: 'KOrganisationsActivity.MY_ORGANISATIONS', color: 'primary', disabled: true },
          { id: 'search-organisation', icon: 'las la-search', tooltip: 'KOrganisationsActivity.SEARCH_ORGANISATION', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        'filter': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true,  color: 'lightgrey' },
          { component: 'collection/KFilter' }
        ]
      }
    },
    fab: {
      actions: [
        { id: 'create-organisation', icon: 'las la-plus', tooltip: 'KOrganisationsActivity.CREATE_ORGANISATION', handler: { name: 'createOrganisation' } }
      ]
    }
  },
  eventsActivity: {
    topPane: {
      content: {
        'default': [
          { id: 'my-organisations', icon: 'las la-home', tooltip: 'EventsActivity.MY_ORGANISATIONS', route: { name: 'organisations-activity' } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'my-events', icon: 'las la-fire', label: 'EventsActivity.MY_EVENTS', color: 'primary', disabled: true },
          { id: 'filter', icon: 'las la-search', tooltip: 'EventsActivity.FILTER_EVENTS', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'configuration', icon: 'las la-grip-horizontal', tooltip: 'EventsActivity.CONFIGURATION', route: { name: 'members-activity' } },
        ],
        'filter': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true,  color: 'lightgrey' },
          { component: 'collection/KFilter' }
        ]
      }
    }
  },
  catalog: defaultMapOptions,
  catalogCatalog: defaultMapCatalog,
  catalogActivity: {
    tools: ['track-location', 'location-bar', 'fullscreen'],
    actions: ['create-layer', 'probe-location'],
    layerActions: ['zoom-to', 'save', 'edit', 'edit-style', 'filter-data', 'view-data', 'chart-data', 'edit-data', 'remove'],
    featuresChunkSize: 5000
  },
  event: defaultMapOptions,
  eventCatalog: defaultMapCatalog,
  eventActivity: {
    tools: ['track-location', 'location-bar', 'fullscreen'],
    actions: ['probe-location'],
    layerActions: ['zoom-to']
  },
  archivedEvents: defaultMapOptions,
  archivedEventsCatalog: { categories: [baseLayers, overlayLayers] },
  archivedEventsActivity: {
    tools: ['fullscreen'],
    actions: [],
    layerActions: ['zoom-to'],
    restore: { layers: false }
  },
  routes: require('../src/router/routes')
}
