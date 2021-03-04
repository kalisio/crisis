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
const meteoLayers = { name: 'MeteoLayers', label: 'KCatalogPanel.METEO_LAYERS', icon: 'las la-cloud-sun-rain',
  options: { exclusive: true, filter: { type: 'OverlayLayer', tags: { $in: ['weather'] } } } }

const defaultMapCatalog = {
  categories: [
    baseLayers,
    businessLayers,
    capturedLayers,
    overlayLayers,
    measureLayers,
    meteoLayers
  ]
}

const widgets = [
  { id: 'information-box', icon: 'las la-digital-tachograph', component: 'widget/KInformationBox', bind: '$data.selection' },
  { id: 'time-series', icon: 'las la-chart-line', component: 'widget/KTimeSeries', bind: '$data' },
  { id: 'mapillary-viewer', icon: 'kdk:mapillary.png', component: 'widget/KMapillaryViewer' }
]

const contextFilter = function (field, services = []) {
  return [
    { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
    { component: 'QSeparator', vertical: true,  color: 'lightgrey' },
    { 
      component: 'collection/KFilter', field, services
    }
  ]
}

const contextHelp = {
  id: 'online-help', icon: 'las la-question-circle', tooltip: 'Context.CONTEXTUAL_HELP', handler: 'launchTour'
}

const contextMenu = function (activityName) {
  return {
    component: 'frame/KMenu',
    icon: 'las la-grip-horizontal',
    actionRenderer: 'item',
    content: [
      { 
        id: 'members', icon: 'las la-user-friends', label: 'KMembersActivity.MEMBERS_LABEL',
        visible: { name: '$can', params: ['service', 'members', ':contextId'] },
        route: { name: 'members-activity', params: { contextId: ':contextId' } },    
      },
      { 
        id: 'tags', icon: 'las la-tags', label: 'KTagsActivity.TAGS_LABEL',
        visible: { name: '$can', params: ['service', 'tags', ':contextId'] },
        route: { name: 'tags-activity', params: { contextId: ':contextId' } },    
      },
      { 
        id: 'groups', icon: 'las la-sitemap', label: 'KGroupsActivity.GROUPS_LABEL',
        visible: { name: '$can', params: ['service', 'groups', ':contextId'] },
        route: { name: 'groups-activity', params: { contextId: ':contextId' } },    
      },
      { 
        id: 'events', icon: 'las la-fire', label: 'EventsActivity.EVENTS_LABEL',
        visible: { name: '$can', params: ['service', 'events', ':contextId'] },
        route: { name: 'events-activity', params: { contextId: ':contextId' } },    
      },
      { 
        id: 'event-templates', icon: 'las la-project-diagram', label: 'EventTemplatesActivity.EVENT_TEMPLATES_LABEL',
        visible: { name: '$can', params: ['service', 'event-templates', ':contextId'] },
        route: { name: 'event-templates-activity', params: { contextId: ':contextId' } },    
      },
      { 
        id: 'archived-events', icon: 'las la-clipboard-list', label: 'Context.ARCHIVED_EVENTS',
        badge: { color: 'primary', transparent: true, label: 'beta' },
        visible: { name: '$can', params: ['read', 'archived-events', ':contextId'] },
        route: { name: 'archived-events-activity', params: { contextId: ':contextId' } },    
      },
      { 
        id: 'catalog', icon: 'las la-map', label: 'Context.CATALOG',
        badge: { color: 'primary', transparent: true, label: 'beta' },
        visible: { name: '$can', params: ['update', 'catalog', ':contextId'] },
        route: { name: 'catalog-activity', params: { contextId: ':contextId' } },    
      },
      { 
        id: 'settings', icon: 'las la-cog', label: 'Context.SETTINGS',
        visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] },
        route: { name: 'organisation-settings-activity', params: { page: 'properties', contextId: ':contextId' } },    
      },
      { 
        id: 'refresh', icon: 'las la-sync', label: 'Context.REFRESH', handler: 'refresh'
      }
    ].filter(item => !item.route || (item.route.name !== activityName))
  }
}

const layerActions = [{
  component: 'frame/KMenu',
  actionRenderer: 'item',
  content: [
    { id: 'zoom-to', label: 'mixins.activity.ZOOM_TO_LABEL', icon: 'las la-search-location', handler: 'onZoomToLayer' },
    { id: 'save', label: 'mixins.activity.SAVE_LAYER', icon: 'las la-save', handler: 'onSaveLayer', visible: 'isLayerStorable' },
    { id: 'filter-data', label: 'mixins.activity.FILTER_DATA_LABEL', icon: 'las la-filter', handler: 'onFilterLayerData', visible: 'isLayerEditable' },
    { id: 'view-data', label: 'mixins.activity.VIEW_DATA_LABEL', icon: 'las la-th-list', handler: 'onViewLayerData', visible: 'isLayerEditable' },
    { id: 'chart-data', label: 'mixins.activity.CHART_DATA_LABEL', icon: 'las la-chart-pie', handler: 'onChartLayerData', visible: 'isLayerEditable' },
    { id: 'edit', label: 'mixins.activity.EDIT_LABEL', icon: 'las la-file-alt', handler: 'onEditLayer', visible: 'isLayerEditable' },
    { id: 'edit-style', label: 'mixins.activity.EDIT_LAYER_STYLE_LABEL', icon: 'las la-border-style', handler: 'onEditLayerStyle', visible: 'isLayerStyleEditable' },
    { id: 'edit-data', label: 'mixins.activity.STOP_EDIT_DATA_LABEL', icon: 'las la-edit', handler: 'onEditLayerData', visible: 'isLayerEditable' },
    { id: 'remove', label: 'mixins.activity.REMOVE_LABEL', icon: 'las la-minus-circle', handler: 'onRemoveLayer', visible: 'isLayerRemovable' }
  ]
}]

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
    leftDrawer: {
      content: [
        { component: 'QImg', src: 'statics/aktnmap-banner.png' },
        { component: 'account/KIdentityPanel', class: 'full-width' },
        { component: 'Settings' },
        { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px;' },
        { component: 'layout/KAbout' },
        { id: 'contextual-help', icon: 'las la-question-circle', label: 'sideNav.HELP', url: onlineHelp, renderer: 'item' },
        { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px;' },
        { id: 'logout', icon: 'las la-sign-out-alt', label: 'sideNav.LOGOUT', route: { name: 'logout' }, renderer: 'item' }
      ],
      behavior: 'mobile',
      opener: true
    },
    topPane: {
      opener: true,
      visible: true
    },
    rightPane: {
      opener: true
    },
    bottomPane: {
      opener: true
    }
  },
  accountActivity: {
    topPane: {
      content: {
        profile: [
          { id: 'back', icon: 'las la-arrow-left', handler: 'goBack' },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', color: 'primary', label: 'KAccountActivity.PROFILE', disabled: true },
          { id: 'security', icon: 'las la-shield-alt', tooltip: 'KAccountActivity.SECURITY', route: { name: 'account-activity', params: { page: 'security' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: 'KAccountActivity.DANGER_ZONE', route: { name: 'account-activity', params: { page: 'danger-zone' } } },
          contextHelp
        ],
        security: [
          { id: 'back', icon: 'las la-arrow-left', handler: 'goBack' },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', tooltip: 'KAccountActivity.PROFILE', route: { name: 'account-activity', params: { page: 'profile' } } },
          { id: 'security', icon: 'las la-shield-alt', color: 'primary', label: 'KAccountActivity.SECURITY', disabled: true },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: 'KAccountActivity.DANGER_ZONE', route: { name: 'account-activity', params: { page: 'danger-zone' } } },
          contextHelp
        ],
        'danger-zone': [
          { id: 'go-back', icon: 'las la-arrow-left', handler: 'goBack' },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'profile', icon: 'las la-user', tooltip: 'KAccountActivity.PROFILE', route: { name: 'account-activity', params: { page: 'profile' } } },
          { id: 'security', icon: 'las la-shield-alt', tooltip: 'KAccountActivity.SECURITY', route: { name: 'account-activity', params: { page: 'security' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', color: 'primary', label: 'KAccountActivity.DANGER_ZONE', disabled: true },
          contextHelp
        ]
      }
    },
    devices: {
      actions: [
        { id: 'remove-device', tooltip: 'KDeviceCard.UNLINK_LABEL', icon: 'phonelink_erase', handler: 'removeDevice',
          visible: { name: '$can', params: ['remove', 'devices', ':contextId', ':item'] } }
      ]
    }
  },
  organisationsActivity: {
    topPane: {
      content: {
        'default': [
          { id: 'organisations', icon: 'las la-home', label: 'KOrganisationsActivity.ORGANISATIONS_LABEL', color: 'primary', disabled: true },
          { id: 'search-organisation', icon: 'las la-search', tooltip: 'KOrganisationsActivity.SEARCH_ORGANISATION_LABEL', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          contextHelp
        ],
        'filter': contextFilter('name')
      }
    },
    fab: {
      actions: [
        { id: 'create-organisation', icon: 'las la-plus', tooltip: 'KOrganisationsActivity.CREATE_ORGANISATION_LABEL', handler: 'createOrganisation' }
      ]
    },
    items: {
      actions: [
        { id: 'goto-organisation', icon: 'las la-sign-in-alt', route: { name: 'context', params: { contextId: ':item._id' } } }
      ]
    }
  },
  organisationSettingsActivity: {
    topPane: {
      content: {
        properties: [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'properties', icon: 'las la-file-alt', color: 'primary', label: 'OrganisationSettingsActivity.PROPERTIES_LABEL',
            visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] }, disabled: true },
          { id: 'billing', icon: 'las la-credit-card', tooltip: 'OrganisationSettingsActivity.BILLING_OPTIONS_LABEL',
            visible: { name: '$can', params: ['update', 'billing', null, { billingObject: ':contextId' }] },
            route: { name: 'organisation-settings-activity', params: { page: 'billing' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: 'OrganisationSettingsActivity.DANGER_ZONE_LABEL',
            visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] },
            route: { name: 'organisation-settings-activity', params: { page: 'danger-zone' } } },
          contextHelp
        ],
        billing: [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'properties', icon: 'las la-file-alt', tooltip: 'OrganisationSettingsActivity.PROPERTIES_LABEL',
            visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] },
            route: { name: 'organisation-settings-activity', params: { page: 'properties' } } },
          { id: 'billing', icon: 'las la-credit-card', color: 'primary', label: 'OrganisationSettingsActivity.BILLING_OPTIONS_LABEL',
            visible: { name: '$can', params: ['update', 'billing', null, { billingObject: ':contextId' }] }, disabled: true },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: 'OrganisationSettingsActivity.DANGER_ZONE_LABEL',
            visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] },
            route: { name: 'organisation-settings-activity', params: { page: 'danger-zone' } } },
          contextHelp
        ],
        'danger-zone': [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'properties', icon: 'las la-file-alt', tooltip: 'OrganisationSettingsActivity.PROPERTIES_LABEL',
            visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] },
            route: { name: 'organisation-settings-activity', params: { page: 'properties' } } },
          { id: 'billing', icon: 'las la-credit-card', tooltip: 'KAccountActivity.SECURITY',
            visible: { name: '$can', params: ['update', 'billing', null, { billingObject: ':contextId' }] },
            route: { name: 'organisation-settings-activity', params: { page: 'billing' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', color: 'primary', label: 'OrganisationSettingsActivity.DANGER_ZONE_LABEL',
            visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] }, disabled: true },
          contextHelp
        ]
      }
    }
  },
  membersActivity: {
    topPane: {
      content: {
        'default': [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'groups', icon: 'las la-user-friends', label: 'KMembersActivity.MEMBERS_LABEL', color: 'primary', disabled: true },
          { id: 'search-member', icon: 'las la-search', tooltip: 'KMembersActivity.SEARCH_MEMBER_LABEL', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          contextHelp,
          contextMenu('members-activity')
        ],
        'filter': contextFilter('profile.name', [
          { service: 'groups', field: 'name', baseQuery: {}, icon: 'las la-sitemap' },
          { service: 'tags', field: 'value', baseQuery: {}, icon: 'las la-tag' }
        ])
      }
    },
    fab: {
      actions: [
        { id: 'add-member', icon: 'las la-user-plus', tooltip: 'KMembersActivity.ADD_USER_LABEL',
          visible: { name: '$can', params: ['update', 'organisations', ':contextId'] }, route: { name: 'add-member' } },
        { id: 'invite-member', icon: 'las la-envelope', tooltip: 'KMembersActivity.INVITE_GUEST_LABEL',
          visible: { name: '$can', params: ['update', 'organisations', ':contextId'] }, route: { name: 'invite-member' } }
      ]
    },
    items: {
      actions: [
        { id: 'tag-member', icon: 'las la-tags', tooltip: 'KMemberCard.TAG_LABEL',
          route: { name: 'tag-member', params: { contextId: ':contextId', objectId: ':item._id' } },
          visible: ['!item.expireAt', { name: '$can', params: ['update', 'members', ':contextId'] }] },
        { id: 'change-role', icon: 'las la-graduation-cap', tooltip: 'KMemberCard.CHANGE_ROLE_LABEL',
          route: { name: 'change-role', params: { contextId: ':contextId', objectId: ':item._id', resource: { id: ':contextId', scope: 'organisations', service: 'organisations' } } },
          visible: ['!item.expireAt', { name: '$can', params: ['update', 'members', ':contextId'] }] },
        { id: 'reissue-invitation', icon: 'las la-envelope', tooltip: 'KMemberCard.RESEND_INVITATION_LABEL', handler: 'resendInvitation',
          visible: ['item.expireAt', { name: '$can', params: ['update', 'members', ':contextId'] }] },
        { id: 'overflow-menu', component: 'frame/KMenu', actionRenderer: 'item',
          visible: ['!item.expireAt', { name: '$can', params: ['remove', 'authorisations', ':contextId', { resource: ':contextId' }] }],
          content: [{ id: 'remove-member', icon: 'las la-minus-circle', label: 'KMemberCard.REMOVE_LABEL', handler: 'removeMember' }] }
      ]
    }
  },
  tagsActivity: {
    topPane: {
      content: {
        'default': [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'tags', icon: 'las la-tags', label: 'KTagsActivity.TAGS_LABEL', color: 'primary', disabled: true },
          { id: 'search-tag', icon: 'las la-search', tooltip: 'KTagsActivity.SEARCH_TAGS_LABEL', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          contextHelp,
          contextMenu('tags-activity')
        ],
        'filter': contextFilter('value')
      }
    },
    items: {
      actions: [
        { id: 'edit-tag', tooltip: 'KTagCard.EDIT_LABEL', icon: 'las la-file-alt',
          visible: { name: '$can', params: ['update', 'tags', ':contextId', ':item'] },
          route: { name: 'edit-tag', params: { contextId: ':contextId', objectId: ':item._id' } } },
        { id: 'list-members', tooltip: 'KTagCard.LIST_MEMBERS_LABEL', icon: 'las la-user-tag', handler: 'onListMembers' }
      ]
    }
  },
  groupsActivity: {
    topPane: {
      content: {
        'default': [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'groups', icon: 'las la-sitemap', label: 'KGroupsActivity.GROUPS_LABEL', color: 'primary', disabled: true },
          { id: 'search-group', icon: 'las la-search', tooltip: 'KGroupsActivity.SEARCH_GROUP_LABEL', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          contextHelp,
          contextMenu('groups-activity')
        ],
        'filter': contextFilter('name')
      }
    },
    fab: {
      actions: [
        { id: 'create-group', icon: 'las la-plus', tooltip: 'KGroupsActivity.CREATE_GROUP_LABEL', route: { name: 'create-group', params: { contextId: ':contextId' } } }
      ]
    },
    items: {
      actions: [
        { id: 'edit-group', tooltip: 'KGroupCard.EDIT_LABEL', icon: 'las la-file-alt',
          visible: { name: '$can', params: ['update', 'groups', ':contextId', ':item'] },
          route: { name: 'edit-group', params: { contextId: ':contextId', objectId: ':item._id' } } },
        { id: 'list-members', tooltip: 'KGroupCard.LIST_MEMBERS_LABEL', icon: 'las la-user-circle',
          visible: { name: '$can', params: ['service', 'members', ':contextId'] }, handler: 'onListMembers' },
        { id: 'remove-group', tooltip: 'KGroupCard.REMOVE_LABEL', icon: 'las la-minus-circle',
          visible: { name: '$can', params: ['remove', 'groups', ':contextId', ':item'] }, handler: 'removeGroup' }
      ]
    }
  },
  eventsActivity: {
    topPane: {
      content: {
        'default': [
          { id: 'organisations', icon: 'las la-home', tooltip: 'KOrganisationsActivity.ORGANISATIONS_LABEL', color: 'primary', route: { name: 'home' } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'events', icon: 'las la-fire', label: 'EventsActivity.EVENTS_LABEL', color: 'primary', disabled: true },
          { id: 'filter', icon: 'las la-search', tooltip: 'EventsActivity.SEARCH_EVENT', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          contextHelp,
          contextMenu('events-activity')
        ],
        'filter': contextFilter('name')
      }
    },
    items: {
      actions: [
        { id: 'capture-photo', tooltip: 'EventCard.ADD_MEDIA_LABEL', icon: 'las la-camera', handler:  'capturePhoto',
          visible: ['canCapturePhoto', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }] },
        { id: 'add-media', tooltip: 'EventCard.ADD_MEDIA_LABEL', icon: 'las la-paperclip', handler:  'uploadMedia',
          visible: { name: '$can', params: ['read', 'events', ':contextId', ':item'] } },
        { id: 'browse-media', tooltip: 'EventCard.BROWSE_MEDIA_LABEL', icon: 'las la-photo-video', handler:  'browseMedia', 
          badge: { label: 'mediasCount', floating: true },
          visible: ['hasMedias', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }] },
        { id: 'event-map', tooltip: 'EventCard.MAP_LABEL', icon: 'las la-map-marked-alt', handler:  'viewMap',
          visible: ['hasLocation', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }] },
        { id: 'navigate', tooltip: 'EventCard.NAVIGATE_LABEL', icon: 'las la-location-arrow', handler:  'launchNavigation',
          visible: ['hasLocation', 'canNavigate', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }] },
        { id: 'edit-event', tooltip: 'EventCard.EDIT_LABEL', icon: 'las la-file-alt',
          visible: ['canCapturePhoto', { name: '$can', params: ['update', 'events', ':contextId', ':item'] }],
          route: { name: 'edit-event', params: { contextId: ':contextId', objectId: ':item._id' } } },
        { id: 'remove-event', tooltip: 'EventCard.REMOVE_LABEL', icon: 'las la-minus-circle', handler: 'removeEvent',
          visible: { name: '$can', params: ['remove', 'events', ':contextId', ':item'] } }
      ]
    }
  },
  eventTemplatesActivity: {
    topPane: {
      content: {
        'default': [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'templates', icon: 'las la-project-diagram', label: 'EventTemplatesActivity.EVENT_TEMPLATES_LABEL', color: 'primary', disabled: true },
          { id: 'search-template', icon: 'las la-search', tooltip: 'KGroupsActivity.SEARCH_GROUP_LABEL', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          contextHelp,
          contextMenu('event-templates-activity')
        ],
        'filter': contextFilter('name')
      }
    },
    fab: {
      actions: [
        { id: 'create-event-template', icon: 'las la-plus', tooltip: 'EventTemplatesActivity.CREATE_TEMPLATE_LABEL',
          visible: { name: '$can', params: ['create', 'event-templates', ':contextId'] },
          route: { name: 'create-event-template', params: { contextId: ':contextId' } } }
      ]
    },
    items: {
      actions: [
        { id: 'edit-event-template', tooltip: 'EventTemplateCard.EDIT_LABEL', icon: 'las la-file-alt',
          visible: { name: '$can', params: ['update', 'event-templates', ':contextId', ':item'] },
          route: { name: 'edit-event-template', params: { contextId: ':contextId', objectId: ':item._id' } } },
        { id: 'copy-event-template', tooltip: 'EventTemplateCard.COPY_LABEL', icon: 'las la-copy',
          visible: { name: '$can', params: ['update', 'event-templates', ':contextId', ':item'] },
          route: { name: 'create-event-template', params: { contextId: ':contextId', templateId: ':item._id' } } },
        { id: 'remove-event-template', tooltip: 'EventTemplateCard.REMOVE_LABEL', icon: 'las la-minus-circle',
          visible: { name: '$can', params: ['remove', 'event-templates', ':contextId', ':item'] }, handler: 'removeEventTemplate' }
      ]
    }
  },
  archivedEventsActivity: {
    topPane: {
      content: {
        'history': [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'map-view', icon: 'scatter_plot', tooltip: 'ArchivedEventsActivity.SHOW_MAP_LABEL', handler: 'onShowMap' },
          { id: 'chart-view', icon: 'las la-chart-pie', tooltip: 'ArchivedEventsActivity.SHOW_CHART_LABEL', handler: 'onShowChart' },
          { component: 'input/KTimeRangeChooser', id: 'timerange', icon: 'las la-calendar',
            on: { event: 'time-range-choosed', listener: 'onTimeRangeChanged' } },
          { id: 'history-sort', icon: 'las la-sort-amount-down', tooltip: 'ArchivedEventsActivity.ASCENDING_SORT',
            toggle: { icon: 'las la-sort-amount-up', color: 'grey-9', tooltip: 'ArchivedEventsActivity.DESCENDING_SORT' }, handler: 'onSortOrder' },
          contextHelp
        ],
        'map': [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'history-view', icon: 'las la-history', tooltip: 'ArchivedEventsActivity.SHOW_HISTORY_LABEL', handler: 'onShowHistory' },
          { id: 'chart-view', icon: 'las la-chart-pie', tooltip: 'ArchivedEventsActivity.SHOW_CHART_LABEL', handler: 'onShowChart' },
          { id: 'heatmap', icon: 'las la-bowling-ball', tooltip: 'ArchivedEventsActivity.SHOW_HEATMAP_LABEL',
            toggle: { icon: 'scatter_plot', color: 'grey-9', tooltip: 'ArchivedEventsActivity.SHOW_MARKERS_LABEL' }, handler: 'onHeatmap' },
          { id: 'by-template', icon: 'las la-layer-group', tooltip: 'ArchivedEventsActivity.SHOW_BY_TEMPLATE_LABEL',
            toggle: { icon: 'las la-object-group', color: 'grey-9', tooltip: 'ArchivedEventsActivity.SHOW_ALL_LABEL' }, handler: 'onByTemplate' },
          contextHelp
        ],
        'chart': [
          { id: 'history-view', icon: 'las la-history', tooltip: 'ArchivedEventsActivity.SHOW_HISTORY_LABEL', handler: 'onShowHistory' },
          { id: 'map-view', icon: 'scatter_plot', tooltip: 'ArchivedEventsActivity.SHOW_MAP_LABEL', handler: 'onShowMap' }
        ]
      }
    },
    rightPane: {
      content: {
        'map': [
          { component: 'catalog/KCatalog', bind: '$data' }
        ]
      },
      mode: null // force default mode to null so that panel is hidden
    },
    items: {
      actions: [
        { id: 'view-event', tooltip: 'ArchivedEventEntry.VIEW_LABEL', icon: 'las la-file-alt',
          route: { name: 'view-event', params: { contextId: ':contextId', objectId: ':item._id' } },
          visible: { name: '$can', params: ['read', 'archived-events', ':contextId'] } },
        { id: 'locate', tooltip: 'ArchivedEventEntry.LOCATE_LABEL', icon: 'las la-map-marker', handler: 'locate',
          visible: ['hasLocation', { name: '$can', params: ['read', 'archived-events', ':contextId'] }] },
        { id: 'map', tooltip: 'ArchivedEventEntry.MAP_LABEL', icon: 'las la-map-marked-alt', handler: 'followUp',
          visible: { name: '$can', params: ['read', 'archived-events', ':contextId'] } },
        { id: 'browse-media', tooltip: 'ArchivedEventEntry.BROWSE_MEDIA_LABEL', icon: 'las la-photo-video', handler: 'browseMedia',
          visible: ['hasMedias', { name: '$can', params: ['read', 'archived-events', ':contextId'] }] }
      ]
    },
    engine: defaultMapOptions,
    catalog: { categories: [baseLayers, overlayLayers] },
    layers: {
      actions: layerActions,
      filter: { $or: [{ id: { $exists: false} }, { id: 'zoom-to' }] }
    },
    restore: { layers: false }
  },
  eventActivity: {
    topPane: {
      content: {
        default: [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          {
            component: 'frame/KMenu',
            icon: 'las la-wrench',
            tooltip: 'mixins.activity.TOOLS',
            actionRenderer: 'item',
            content: [
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } }
            ]
          },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: 'onToggleFullscreen' }
        ],
        'display-position': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KPositionIndicator' }
        ],
        'search-location': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KSearchLocation' }
        ]
      }
    },
    rightPane: {
      content: [
        { component: 'EventActivityPanel', bind: '$data' }
      ]
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    page: {
      content: [{
        component: 'frame/KPageSticky', position: 'left', offset: [18, 0], content: [{ component: 'KColorLegend' }]
      }]
    },
    window: {
      widgets: widgets
    },
    fab: {
      actions: [
        { id: 'add-media', label: 'EventActivity.ADD_MEDIA_LABEL', icon: 'add_a_photo', handler: 'uploadMedia',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] } },
        { id: 'browse-media', label: 'EventActivity.BROWSE_MEDIA_LABEL', icon: 'photo_library', handler: 'browseMedia',
          visible: { name: '$can', params: ['read', 'events', ':contextId', ':event'] } },
        { id: 'edit-event', label: 'EventActivity.EDIT_LABEL', icon: 'las la-file-alt',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] },
          route: { name: 'edit-event', params: { contextId: ':contextId', service: 'events', objectId: ':objectId' } } },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'onProbeLocation' }
      ]
    },
    engine: defaultMapOptions,
    catalog: defaultMapCatalog,
    layers: {
      actions: layerActions,
      filter: { $or: [{ id: { $exists: false} }, { id: 'zoom-to' }] }
    },
    featuresChunkSize: 5000 // TODO: here or in mapEngine ?
  },
  catalogActivity: {
    topPane: {
      content: {
        default: [
          { id: 'organisation', icon: 'las la-home', tooltip: 'Context.ORGANISATION', route: { name: 'context', params: { contextId: ':contextId' } } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          {
            component: 'frame/KMenu',
            icon: 'las la-wrench',
            tooltip: 'mixins.activity.TOOLS',
            actionRenderer: 'item',
            content: [
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } }
            ]
          },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: 'onToggleFullscreen' }
        ],
        'display-position': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KPositionIndicator' }
        ],
        'search-location': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KSearchLocation' }
        ]
      }
    },
    rightPane: {
      content: [
        { component: 'catalog/KCatalog', bind: '$data' }
      ]
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    page: {
      content: [{
        component: 'frame/KPageSticky', position: 'left', offset: [18, 0], content: [{ component: 'KColorLegend' }]
      }, {
        component: 'KFeatureActionButton'
      }]
    },
    window: {
      widgets: widgets
    },
    fab: {
      actions: [
        { id: 'create-layer', icon: 'las la-plus', label: 'mixins.activity.CREATE_LAYER', handler: 'onCreateLayer' },
        { id: 'import-layer', icon: 'las la-file-upload', label: 'mixins.activity.IMPORT_LAYER', handler: 'onImportLayer' },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'onProbeLocation' }
      ]
    },
    engine: defaultMapOptions,
    catalog: defaultMapCatalog,
    layers: {
      actions: layerActions
    },
    featuresChunkSize: 5000 // TODO: here or in mapEngine ?
  },
  
  routes: require('../src/router/routes')
}
