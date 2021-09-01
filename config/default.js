const groups = require('../src/tours/core/groups')

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
const gateway = domain.replace('aktnmap', 'api')

const contextHelp = function (tour) {
  return Object.assign({
    id: 'contextual-help', icon: 'las la-question-circle', label: 'leftPane.CONTEXTUAL_HELP', renderer: 'item'
  }, tour ? { handler: { name: 'launchTour', params: [tour] } } : { handler: 'launchTour' })
}

const leftPane = function (tour) {
  return {
    content: [
      { component: 'QImg', src: 'statics/aktnmap-banner.png' },
      { component: 'account/KIdentityPanel', class: 'full-width' },
      { id: 'my-organisations', icon: 'las la-grip-horizontal', label: 'leftPane.ORGANISATIONS', route: { name: 'organisations-activity' }, renderer: 'item' },
      { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px; max-height: 1px;' },
      { component: 'editor/KSettingsEditor' },
      { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px; max-height: 1px;' },
      { component: 'layout/KAbout' },
      { id: 'online-help', icon: 'las la-book', label: 'leftPane.ONLINE_HELP', url: onlineHelp, renderer: 'item' },
      contextHelp(tour),
      { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px; max-height: 1px;' },
      { id: 'logout', icon: 'las la-sign-out-alt', label: 'leftPane.LOGOUT', route: { name: 'logout' }, renderer: 'item' }
    ]
  }
}

const separator = { component: 'QSeparator', vertical: true, color: 'grey-5' }
const midSeparator = { component: 'QSeparator', vertical: true, inset: true, color: 'grey-5', style: 'max-width: 1px; min-width: 1px;' }

const currentActivityStamp = function (icon, text) {
  return { component: 'frame/KStamp', icon, iconSize: 'sm', text, direction: 'horizontal', class: 'text-grey-7' }
}

const gotoActivityAction = function (service, icon, label, contextId) {
  return { 
    id: service, icon, tooltip: label,
    visible: { name: '$can', params: ['service', service, `:${contextId}`] },
    route: { name: `${service}-activity`, params: { contextId: `:${contextId}` } }
  }
}

const plansAction = function (contextId = 'contextId') {
  return gotoActivityAction('plans', 'las la-stream', 'PlansActivity.PLANS_LABEL', contextId)
}

const archivedPlansAction = function (contextId = 'contextId') {
  return gotoActivityAction('archived-plans', 'las la-archive', 'ArchivedPlansActivity.ARCHIVED_PLANS_LABEL', contextId)
}

const eventsAction = function (contextId = 'contextId') {
  return { 
    id: 'events', icon: 'las la-fire', tooltip: 'EventsActivity.EVENTS_LABEL',
    visible: { name: '$can', params: ['service', 'events', `:${contextId}`] },
    route: { name: 'events-activity', params: { contextId: `:${contextId}` }, query: { plan: ':plan' } }
  }
}

const mapAction = function (contextId = 'contextId') { 
  return {
    id: 'catalog', icon: 'las la-map', tooltip: 'Context.CATALOG',
    visible: { name: '$can', params: ['update', 'catalog', `:${contextId}`] },
    route: { name: 'catalog-activity', params: { contextId: `:${contextId}` }, query: { plan: ':plan' } },    
  }
}

const archivedEventsAction = function (contextId = 'contextId') {
  return { 
    id: 'archived-events', icon: 'las la-clipboard-list', tooltip: 'Context.ARCHIVED_EVENTS',
    visible: { name: '$can', params: ['service', 'archived-events', `:${contextId}`] },
    route: { name: 'archived-events-activity', params: { contextId: `:${contextId}` }, query: { plan: ':plan' } }
  }
}

const membersAction = function (contextId = 'contextId') {
  return gotoActivityAction('members', 'las la-user-friends', 'KMembersActivity.MEMBERS_LABEL', contextId)
}

const tagsAction = function (contextId = 'contextId') {
  return gotoActivityAction('tags', 'las la-tags', 'KTagsActivity.TAGS_LABEL', contextId)
}

const groupsAction = function (contextId = 'contextId') {
  return gotoActivityAction('groups', 'las la-sitemap', 'KGroupsActivity.GROUPS_LABEL', contextId)   
}

const eventTemplatesAction = function (contextId = 'contextId') {
  return gotoActivityAction('event-templates', 'las la-fire', 'EventTemplatesActivity.EVENT_TEMPLATES_LABEL', contextId)   
}

const planTemplatesAction = function (contextId = 'contextId') {
  return gotoActivityAction('plan-templates', 'las la-stream', 'PlanTemplatesActivity.PLAN_TEMPLATES_LABEL', contextId)   
}

const editItemAction = function (tooltip, scope = undefined, properties = undefined) {
  let id = 'edit-item'
  if (scope) id += `${scope}`
  return {
    id, scope, tooltip, icon: 'las la-edit', size: 'sm',
    visible: 'canEditItem', 
    handler: { name: 'editItem', params: [scope, properties] },
  }
}

const removeItemAction = function (tooltip, scope = undefined) {
  let id = 'remove-item'
  if (scope) id += `-${scope}`
  return {
    id, scope, tooltip, icon: 'las la-trash', size: 'sm',
    visible: 'canRemoveItem',
    handler: { name: 'removeItem', params: ['confirm'] }
  }
}

const addWorkflowAction = function (tooltip) {
  return {
    id: 'add-item-workflow', scope: 'workflow', tooltip, icon: 'las la-plus-circle', size: 'sm',
    visible: ['canEditItem', '!item.workflow'],
    route: { name: 'edit-event-template-workflow', params: { contextId: ':contextId', objectId: ':item._id' } }
  }
}
const editWorkflowAction = function (tooltip) {
  return {
    id: 'edit-item-workflow', scope: 'workflow', tooltip, icon: 'las la-edit', size: 'sm',
    visible: ['canEditItem', 'item.workflow'],
    route: { name: 'edit-event-template-workflow', params: { contextId: ':contextId', objectId: ':item._id' } }
  }
}
const removeWorkflowAction = function (tooltip) {
  return {
    id: 'remove-item-workflow', scope: 'workflow', tooltip, icon: 'las la-trash', size: 'sm',
    visible: ['canEditItem', 'item.workflow'], 
    handler: { name: 'removeWorkflow' },
  }
}

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

const businessLayers = {
  name: 'KCatalogPanel.BUSINESS_LAYERS',
  icon: 'las la-briefcase',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['business'] } } }
}
const baseLayers = {
  name: 'KCatalogPanel.BASE_LAYERS',
  icon: 'las la-layer-group',
  component: 'catalog/KBaseLayersSelector',
  options: { filter: { type: 'BaseLayer' } }
}
const capturedLayers = {
  name: 'KCatalogPanel.CAPTURED_LAYERS',
  icon: 'las la-street-view',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['captured'] } } }
}
const measureLayers = {
  name: 'KCatalogPanel.MEASURE_LAYERS',
  icon: 'las la-map-pin',
  options: { exclusive: false, filter: { type: 'OverlayLayer', tags: { $in: ['measure'] } } }
}
const meteoLayers = {
  name: 'KCatalogPanel.METEO_LAYERS',
  icon: 'las la-cloud-sun-rain',
  component: 'catalog/KWeatherLayersSelector',
  options: { exclusive: true, filter: { type: 'OverlayLayer', tags: { $in: ['weather'] } } }
}

const defaultMapCatalog = {
  categories: [
    businessLayers,
    capturedLayers,
    measureLayers,
    meteoLayers,
    baseLayers
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

const layerActions = [{
  id: 'layer-actions',
  component: 'frame/KPopupAction',
  actionRenderer: 'item',
  content: [
    { id: 'zoom-to', label: 'mixins.activity.ZOOM_TO_LABEL', icon: 'las la-search-location', handler: 'onZoomToLayer' },
    { id: 'save', label: 'mixins.activity.SAVE_LABEL', icon: 'las la-save', handler: 'onSaveLayer', visible: 'isLayerStorable' },
    { id: 'filter-data', label: 'mixins.activity.FILTER_DATA_LABEL', icon: 'las la-filter', handler: 'onFilterLayerData', visible: 'isFeatureLayer' },
    { id: 'view-data', label: 'mixins.activity.VIEW_DATA_LABEL', icon: 'las la-th-list', handler: 'onViewLayerData', visible: 'isFeatureLayer' },
    { id: 'chart-data', label: 'mixins.activity.CHART_DATA_LABEL', icon: 'las la-chart-pie', handler: 'onChartLayerData', visible: 'isFeatureLayer' },
    { id: 'edit', label: 'mixins.activity.EDIT_LABEL', icon: 'las la-edit', handler: 'onEditLayer', visible: 'isLayerEditable' },
    { id: 'edit-style', label: 'mixins.activity.EDIT_LAYER_STYLE_LABEL', icon: 'las la-border-style', handler: 'onEditLayerStyle', visible: 'isLayerStyleEditable' },
    { id: 'edit-data', label: 'mixins.activity.START_EDIT_DATA_LABEL', icon: 'las la-edit', handler: 'onEditLayerData', visible: 'isLayerDataEditable',
      toggle: { icon: 'las la-edit', tooltip: 'mixins.activity.STOP_EDIT_DATA_LABEL' }, component: 'KEditLayerData' },
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
  gateway,
  gatewayJwtField: 'jwt',
  gatewayJwt: 'aktnmap-gateway-jwt',
  appName: 'Akt\'n\'Map',
  appLogo: 'aktnmap-logo.png',
  appWebsite: 'https://kalisio.com/solutions#aktnmap',
  appOnlineHelp: onlineHelp,
  publisher: 'Kalisio',
  publisherWebsite: website,
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  settings: {
    propertyMapping: {
      shortTime: 'timeFormat.time.short',
      longTime: 'timeFormat.time.long',
      shortDate: 'timeFormat.date.short',
      longDate: 'timeFormat.date.long',
      shortYear: 'timeFormat.year.short',
      longYear: 'timeFormat.year.long',
      utc: 'timeFormat.utc',
      location: 'locationFormat',
      restoreView: 'restore.view',
      restoreLayers: 'restore.layers',
      timelineStep: 'timeline.step',
      timeseriesSpan: 'timeseries.span'
    }
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
    leftPane: {
      opener: true
    },
    topPane: {
      opener: false,
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
    leftPane: leftPane(),
    topPane: {
      content: {
        profile: [
          { id: 'profile', icon: 'las la-user', color: 'primary', label: 'KAccountActivity.PROFILE', disabled: true },
          { id: 'security', icon: 'las la-shield-alt', tooltip: 'KAccountActivity.SECURITY', route: { name: 'account-activity', params: { page: 'security' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: 'KAccountActivity.DANGER_ZONE', route: { name: 'account-activity', params: { page: 'danger-zone' } } }
        ],
        security: [
          { id: 'profile', icon: 'las la-user', tooltip: 'KAccountActivity.PROFILE', route: { name: 'account-activity', params: { page: 'profile' } } },
          { id: 'security', icon: 'las la-shield-alt', color: 'primary', label: 'KAccountActivity.SECURITY', disabled: true },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', tooltip: 'KAccountActivity.DANGER_ZONE', route: { name: 'account-activity', params: { page: 'danger-zone' } } }
        ],
        'danger-zone': [
          { id: 'profile', icon: 'las la-user', tooltip: 'KAccountActivity.PROFILE', route: { name: 'account-activity', params: { page: 'profile' } } },
          { id: 'security', icon: 'las la-shield-alt', tooltip: 'KAccountActivity.SECURITY', route: { name: 'account-activity', params: { page: 'security' } } },
          { id: 'danger-zone', icon: 'las la-exclamation-triangle', color: 'primary', label: 'KAccountActivity.DANGER_ZONE', disabled: true }
        ]
      }
    },
    devices: {
      actions: [
        { id: 'remove-device', tooltip: 'KDeviceCard.UNLINK_LABEL', icon: 'phonelink_erase', handler: 'removeDevice',
          scope: 'header', visible: { name: '$can', params: ['remove', 'devices', ':contextId', ':item'] } }
      ]
    }
  },
  organisationsActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [
          currentActivityStamp('las la-grip-horizontal', 'KOrganisationsActivity.ORGANISATIONS_LABEL'),
          midSeparator,
          { id: 'organisation-sorter', component: 'collection/KSorter', tooltip: 'KOrganisationsActivity.SORT_ORGANISATIONS' },
          { id: 'search-organisation', icon: 'las la-search', tooltip: 'KOrganisationsActivity.SEARCH_ORGANISATIONS', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        'filter': contextFilter('name')
      }
    },
    fab: {
      actions: [
        { id: 'create-organisation', icon: 'las la-plus', tooltip: 'KOrganisationsActivity.CREATE_ORGANISATION_LABEL', route: { name: 'create-organisation' } }
      ]
    },
    items: {
      component: 'OrganisationCard',
      actions: [
        editItemAction('OrganisationCard.EDIT_ACTION', 'header', "name,avatar,color"),
        removeItemAction('OrganisationCard.REMOVE_ACTION', 'header'),
        editItemAction('OrganisationCard.EDIT_ACTION', 'description')
      ]
    }
  },
  plansActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [
          { component: 'OrganisationMenu', mode: 'plan' },
          separator,
          currentActivityStamp('las la-stream', 'PlansActivity.PLANS_LABEL'),
          archivedPlansAction(),
          midSeparator,
          { 
            id: 'plan-sorter',
            component: 'collection/KSorter', 
            tooltip: 'EventsActivity.SORT_EVENTS',
            options: [
              { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
              { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 }, default: true },
              { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 } },
              { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
            ]
          },
          { id: 'search-event', icon: 'las la-search', tooltip: 'EventsActivity.SEARCH_EVENTS', handler: { name: 'setTopPaneMode', params: ['filter'] } },
        ],
        'filter': contextFilter('name')
      }
    },
    items: {
      actions: [
        editItemAction('PlanCard.EDIT_ACTION', 'header', 'name'),
        removeItemAction('PlanCard.REMOVE_ACTION', 'header'),
        editItemAction('PlanCard.EDIT_ACTION', 'description'),
        // Specific case of custom objective editor
        {
          id: 'edit-objectives', icon: 'las la-edit', tooltip: 'PlanCard.EDIT_ACTION', size: 'sm', 
          visible: 'canEditItem', handler: 'editObjectives', scope: 'objectives'
        },
        editItemAction('PlanCard.EDIT_ACTION', 'location'),
        editItemAction('PlanCard.EDIT_ACTION', 'coordinators')
      ]
    }
  },
  archivedPlansActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [
          { component: 'OrganisationMenu', mode: 'plan' },
          separator,
          plansAction(),
          currentActivityStamp('las la-archive', 'ArchivedPlansActivity.ARCHIVED_PLANS_LABEL'),         
        ],
        'filter': contextFilter('name')
      }
    },
    bottomPane: {
      content: [
        { component: 'time/KTimeRange' },
        { 
          id: 'archived-plan-sorter',
          component: 'collection/KSorter', 
          tooltip: 'ArchivedPlansActivity.SORT_PLANS',
          options: [
            { icon: 'kdk:clockwise.png', value: { field: 'createdAt', order: 1 } },
            { icon: 'kdk:anticlockwise.png', value: { field: 'createdAt', order: -1 }, default: true }
          ]
        }
      ]
    },
    items: {
      actions: [{
        id: 'goto-plan-archive', icon: 'las la-clipboard-list', tooltip: 'ArchivedPlanCard.GOTO_ARCHIVED_EVENTS', 
        route: { name: 'archived-events-activity', params: { contextId: ':contextId'}, query: { plan: ':item._id'} },
        visible: { name: '$can', params: ['service', 'archived-events', ':contextId'] },
        scope: 'footer'
      }]
    }
  },
  eventsActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [
          { component: 'OrganisationMenu', mode: 'run' },
          separator,
          { component: 'PlanMenu' },
          currentActivityStamp('las la-fire', 'EventsActivity.EVENTS_LABEL'),
          mapAction(), 
          archivedEventsAction(),
          midSeparator,
          { id: 'event-sorter',
            component: 'collection/KSorter', 
            tooltip: 'EventsActivity.SORT_EVENTS',
            options: [
              { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
              { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 }, default: true },
              { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 } },
              { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
            ]
          },
          { id: 'search-event', icon: 'las la-search', tooltip: 'EventsActivity.SEARCH_EVENTS', handler: { name: 'setTopPaneMode', params: ['filter'] } },
        ],
        'filter': contextFilter('name')
      }
    },
    items: {
      actions: [
        editItemAction('EventCard.EDIT_ACTION', 'header', 'name'),
        // Specific case of event removal requiring notification
        //removeItemAction('EventCard.REMOVE_ACTION', 'header'),
        {
          id: 'remove-item-header', scope: 'header', tooltip: 'EventCard.REMOVE_ACTION',
          icon: 'las la-trash', size: 'sm', visible: 'canRemoveItem', handler: 'removeEvent'
        },
        editItemAction('EventCard.EDIT_ACTION', 'description'),
        editItemAction('EventCard.EDIT_ACTION', 'objective'),
        editItemAction('EventCard.EDIT_ACTION', 'location'),
        editItemAction('EventCard.EDIT_ACTION', 'participants'),
        editItemAction('EventCard.EDIT_ACTION', 'coordinators'),
        { 
          id: 'capture-photo', tooltip: 'EventCard.ADD_MEDIA_LABEL', icon: 'las la-camera', 
          visible: ['canCapturePhoto', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }],
          handler: 'capturePhoto', scope: 'footer'
        },
        { 
          id: 'add-media', tooltip: 'EventCard.ADD_MEDIA_LABEL', icon: 'las la-paperclip',
          visible: { name: '$can', params: ['read', 'events', ':contextId', ':item'] },
          handler:  'uploadMedia', scope: 'footer'
        },
        { 
          id: 'event-map', tooltip: 'EventCard.MAP_LABEL', icon: 'las la-map-marked-alt',
          visible: ['hasLocation', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }],
          handler:  'viewMap', scope: 'footer'
        },
        { 
          id: 'navigate', tooltip: 'EventCard.NAVIGATE_LABEL', icon: 'las la-location-arrow', 
          visible: ['hasLocation', 'canNavigate', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }],
          handler: 'launchNavigation', scope: 'footer'
        }
      ]
    }
  },
  catalogActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'run' },
          separator,
          { component: 'PlanMenu' },       
          eventsAction(),
          currentActivityStamp('las la-map', 'Context.CATALOG'),
          archivedEventsAction(),
          midSeparator,
          { component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          {
            id: 'manage-favorite-views', component: 'menu/KMenu', icon: 'star_border', persistent: true, autoClose: false, tooltip: 'KFavoriteViews.FAVORITE_VIEWS_LABEL',
            content: [
              { component: 'KFavoriteViews' }
            ]
          },
          {
            id: 'tools', component: 'menu/KMenu', icon: 'las la-wrench', tooltip: 'mixins.activity.TOOLS', actionRenderer: 'item',
            content: [
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } }
            ]
          },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: 'onToggleFullscreen' },
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
      content: [{
        component: 'catalog/KCatalog', bind: '$data'
      }, {
        component: 'QSpace'
      }, {
        component: 'frame/KPanel',
        content: [
          { id: 'manage-layer-categories', icon: 'las la-cog', label: 'KLayerCategories.LAYER_CATEGORIES_LABEL',
            route: { name: 'manage-layer-categories', params: { south: ':south', north: ':north', west: ':west', east: ':east' }, query: { layers: ':layers' } } }
        ]
      }]
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    page: {
      content: [
        { component: 'frame/KPageSticky', position: 'left', offset: [18, 0], content: [{ component: 'KColorLegend' }] }, 
        { component: 'frame/KPageSticky', position: 'top-left', offset: [18, 18], content: [{ component: 'KUrlLegend' }] }, 
        { component: 'KFeatureActionButton' }
      ]
    },
    window: {
      widgets: widgets
    },
    fab: {
      actions: [
        { id: 'add-layer', icon: 'las la-plus', label: 'mixins.activity.ADD_LAYER',
          route: { name: 'add-layer', params: { south: ':south', north: ':north', west: ':west', east: ':east' }, query: { layers: ':layers' } } },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'onProbeLocation' }
      ]
    },
    engine: defaultMapOptions,
    catalog: defaultMapCatalog,
    layers: {
      actions: layerActions
    },
    featuresChunkSize: 5000
  },
  archivedEventsActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'history': [
          { component: 'OrganisationMenu', mode: 'run' },
          separator,
          { component: 'PlanMenu' },
          eventsAction(),
          mapAction(),
          currentActivityStamp('las la-clipboard-list', 'Context.ARCHIVED_EVENTS'),
          midSeparator,
          { id: 'map-view', icon: 'las la-map-marked', tooltip: 'ArchivedEventsActivity.SHOW_MAP_LABEL', handler: 'onShowMap' },
          { id: 'chart-view', icon: 'las la-chart-pie', tooltip: 'ArchivedEventsActivity.SHOW_CHART_LABEL', handler: 'onShowChart' },
          { id: 'export-data', icon: 'las la-file-download', tooltip: 'ArchivedEventsActivity.EXPORT_DATA_LABEL', handler: 'downloadEventsData' },
        ],
        'map': [
          { id: 'history-view', icon: 'las la-arrow-left', tooltip: 'ArchivedEventsActivity.SHOW_HISTORY_LABEL', handler: 'onShowHistory' },
          midSeparator,
          { id: 'by-template', icon: 'las la-layer-group', tooltip: 'ArchivedEventsActivity.SHOW_BY_TEMPLATE_LABEL',
            toggle: { icon: 'las la-object-group', color: 'grey-9', tooltip: 'ArchivedEventsActivity.SHOW_ALL_LABEL' }, handler: 'onByTemplate' },
          { id: 'heatmap', icon: 'las la-bowling-ball', tooltip: 'ArchivedEventsActivity.SHOW_HEATMAP_LABEL',
            toggle: { icon: 'scatter_plot', color: 'grey-9', tooltip: 'ArchivedEventsActivity.SHOW_MARKERS_LABEL' }, handler: 'onHeatmap' },
          { id: 'export-data', icon: 'las la-file-download', tooltip: 'ArchivedEventsActivity.EXPORT_DATA_LABEL', handler: 'downloadEventsData' }
        ],
        'chart': [
          { id: 'history-view', icon: 'las la-arrow-left', tooltip: 'ArchivedEventsActivity.SHOW_HISTORY_LABEL', handler: 'onShowHistory' },
          midSeparator,
          { id: 'settings', icon: 'las la-cog', tooltip: 'ArchivedEventsActivity.CHART_SETTINGS_LABEL', handler: 'showChartSettings' },
          { id: 'export-data', icon: 'las la-file-download', tooltip: 'ArchivedEventsActivity.CHART_EXPORT_LABEL', handler: 'downloadChartData' }
        ]
      }
    },
    rightPane: {
      content: {
        'history': [],
        'map': [ { component: 'catalog/KCatalog', bind: '$data' } ],
        'chart': []
      }
    },
    bottomPane: {
      content: [
        { component: 'time/KTimeRange' },
        {
          id: 'archived-plan-sorter',
          component: 'collection/KSorter', 
          tooltip: 'ArchivedEventsActivity.SORT_EVENTS',
          options: [
            { icon: 'kdk:clockwise.png', value: { field: 'createdAt', order: 1 } },
            { icon: 'kdk:anticlockwise.png', value: { field: 'createdAt', order: -1 }, default: true }
          ]
        }
      ]
    },
    items: {
      actions: [
        { 
          id: 'view-map', tooltip: 'ArchivedEventCard.VIEW_MAP', icon: 'las la-map-marked-alt', handler: 'followUp',
          visible: { name: '$can', params: ['read', 'archived-events', ':contextId'] }, scope: 'footer'
        },
        { 
          id: 'browse-media', tooltip: 'ArchivedEventCard.BROWSE_MEDIA', icon: 'las la-photo-video', handler: 'browseMedia',
          visible: ['hasMedias', { name: '$can', params: ['read', 'archived-events', ':contextId'] }], scope: 'footer'
        }
      ]
    },
    engine: defaultMapOptions,
    catalog: { categories: [baseLayers] },
    layers: {
      actions: layerActions,
      filter: { id: { $in: ['layer-actions', 'zoom-to'] } }
    },
    restore: { view: false, layers: false }
  },
  membersActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          currentActivityStamp('las la-user-friends', 'KMembersActivity.MEMBERS_LABEL'),
          tagsAction(),
          groupsAction(),
          eventTemplatesAction(),
          planTemplatesAction(),
          midSeparator,
          { component: 'team/KMemberFilter' },
          { component: 'collection/KSorter', 
            id: 'member-sorter',
            tooltip: 'KMembersActivity.SORT_MEMBERS',
            options: [
              { icon: 'las la-sort-alpha-down', value: { field: 'profile.name', order: 1 }, default: true },
              { icon: 'las la-sort-alpha-up', value: { field: 'profile.name', order: -1 } }
            ]
          },
          { id: 'search-member', icon: 'las la-search', tooltip: 'KMembersActivity.SEARCH_MEMBERS', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        'filter': contextFilter('profile.name', [
          { service: 'groups', field: 'name', baseQuery: {}, icon: 'las la-sitemap' },
          { service: 'tags', field: 'value', baseQuery: {}, icon: 'las la-tag' }
        ])
      }
    },
    fab: {
      actions: [{ 
        id: 'add-member', icon: 'las la-plus', tooltip: 'KMembersActivity.ADD_USER_LABEL',
        visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] },
        route: { name: 'add-member' } 
      }]
    },
    items: {
      actions: [
        { 
          id: 'edit-member-role', icon: 'las la-graduation-cap', tooltip: 'KMemberCard.CHANGE_ROLE_ACTION', size: 'sm',
          visible: ['!item.expireAt', { name: '$can', params: ['update', 'members', ':contextId'] }],
          route: { name: 'edit-member-role', params: { contextId: ':contextId', objectId: ':item._id' } },
          scope: 'header'
        },
        { 
          id: 'remove-member', icon: 'las la-trash', tooltip: 'KMemberCard.REMOVE_ACTION', size: 'sm',
          visible: ['!item.expireAt', { name: '$can', params: ['remove', 'authorisations', ':contextId', { resource: ':contextId' }] }],
          handler: 'removeMember',
          scope: 'header'
        },
        editItemAction('KMemberCard.TAG_ACTION', 'tags'),
        { 
          id: 'join-group', icon: 'las la-plus-circle', tooltip: 'KMemberCard.JOIN_GROUP_ACTION', size: 'sm',
          visible: 'canJoinGroup', 
          route: { name: 'join-group', params: { contextId: ':contextId', objectId: ':item._id' } },
          scope: 'groups' 
        },
        { 
          id: 'reissue-invitation', icon: 'las la-envelope', tooltip: 'KMemberCard.RESEND_INVITATION_ACTION',
          visible: ['item.expireAt', { name: '$can', params: ['update', 'members', ':contextId'] }],
          handler: 'resendInvitation',
          scope: 'expiration'
        }
      ]
    }
  },
  tagsActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [      
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,          
          membersAction(),
          currentActivityStamp('las la-tags', 'KTagsActivity.TAGS_LABEL'),
          groupsAction(),
          eventTemplatesAction(),
          planTemplatesAction(),
          midSeparator,
          { component: 'collection/KSorter', 
            id: 'tag-sorter',
            tooltip: 'KTagsActivity.SORT_TAGS',
            options: [
              { icon: 'las la-sort-alpha-down', value: { field: 'value', order: 1 }, default: true },
              { icon: 'las la-sort-alpha-up', value: { field: 'value', order: -1 } }
            ]
          },
          { id: 'search-tag', icon: 'las la-search', tooltip: 'KTagsActivity.SEARCH_TAGS', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        'filter': contextFilter('value')
      }
    },
    items: {
      actions: [
        editItemAction('KTagCard.EDIT_ACTION', 'header', 'value,icon'),
        editItemAction('KTagCard.EDIT_ACTION', 'description')
      ]
    }
  },
  groupsActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          membersAction(),
          tagsAction(),
          currentActivityStamp('las la-sitemap', 'KGroupsActivity.GROUPS_LABEL'),
          eventTemplatesAction(),
          planTemplatesAction(),
          midSeparator,          
          { id: 'group-sorter', component: 'collection/KSorter', tooltip: 'KGroupsActivity.SORT_GROUPS' },
          { id: 'search-group', icon: 'las la-search', tooltip: 'KGroupsActivity.SEARCH_GROUPS', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        'filter': contextFilter('name')
      }
    },
    fab: {
      actions: [{ id: 'create-group', icon: 'las la-plus', tooltip: 'KGroupsActivity.CREATE_GROUP_LABEL',
          visible: { name: '$can', params: ['create', 'groups', ':contextId'] },
          route: { name: 'create-group', params: { contextId: ':contextId' } }
      }]
    },
    items: {
      actions: [
        editItemAction('KGroupCard.EDIT_ACTION', 'header', 'name'),
        removeItemAction('KGroupCard.REMOVE_ACTION', 'header'),
        editItemAction('KGroupCard.EDIT_ACTION', 'description')
      ]
    }
  },
  eventTemplatesActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [ 
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          membersAction(),
          tagsAction(),
          groupsAction(),
          currentActivityStamp('las la-fire', 'EventTemplatesActivity.EVENT_TEMPLATES_LABEL'),
          planTemplatesAction(),
          midSeparator,
          { id: 'event-template-sorter', component: 'collection/KSorter', tooltip: 'EventTemplatesActivity.SORT_EVENT_TEMPLATES' },
          { id: 'search-event-template', icon: 'las la-search', tooltip: 'EventTemplatesActivity.SEARCH_EVENT_TEMPLATES', handler: { name: 'setTopPaneMode', params: ['filter'] } },
        ],
        'filter': contextFilter('name')
      }
    },
    fab: {
      actions: [{
        id: 'create-event-template', icon: 'las la-plus', tooltip: 'EventTemplatesActivity.CREATE_TEMPLATE_LABEL',
        visible: { name: '$can', params: ['create', 'event-templates', ':contextId'] },
        route: { name: 'create-event-template', params: { contextId: ':contextId' } }
      }]
    },
    items: {
      actions: [
        editItemAction('EventTemplateCard.EDIT_ACTION', 'header', 'name,icon'),
        removeItemAction('EventTemplateCard.REMOVE_ACTION', 'header'),
        editItemAction('EventTemplateCard.EDIT_ACTION', 'description'),
        editItemAction('EventTemplateCard.EDIT_ACTION', 'participants'),
        editItemAction('EventTemplateCard.EDIT_ACTION', 'coordinators'),
        editItemAction('EventTemplateCard.EDIT_ACTION', 'expiryDuration'),
        addWorkflowAction('EventTemplateCard.ADD_WORKFLOW_ACTION'),
        editWorkflowAction('EventTemplateCard.EDIT_WORKFLOW_ACTION'),
        removeWorkflowAction('EventTemplateCard.REMOVE_WORKFLOW_ACTION'),
        { 
          id: 'copy-event-template', tooltip: 'EventTemplateCard.COPY_ACTION', icon: 'las la-copy',
          visible: { name: '$can', params: ['update', 'event-templates', ':contextId', ':item'] },
          route: { name: 'create-event-template', params: { contextId: ':contextId', templateId: ':item._id' } },
          scope: 'footer'
        }
      ]
    }
  },
  planTemplatesActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        'default': [ 
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          membersAction(),
          tagsAction(),
          groupsAction(),
          eventTemplatesAction(),
          currentActivityStamp('las la-stream', 'PlanTemplatesActivity.PLAN_TEMPLATES_LABEL'),
          midSeparator,
          { id: 'event-template-sorter', component: 'collection/KSorter', tooltip: 'EventTemplatesActivity.SORT_EVENT_TEMPLATES' },
          { id: 'search-event-template', icon: 'las la-search', tooltip: 'EventTemplatesActivity.SEARCH_EVENT_TEMPLATES', handler: { name: 'setTopPaneMode', params: ['filter'] } },
        ],
        'filter': contextFilter('name')
      }
    },
    fab: {
      actions: [{
        id: 'create-plan-template', icon: 'las la-plus', tooltip: 'PlanTemplatesActivity.CREATE_TEMPLATE_LABEL',
        visible: { name: '$can', params: ['create', 'plan-templates', ':contextId'] },
        route: { name: 'create-plan-template', params: { contextId: ':contextId' } }
      }]
    },
    items: {
      actions: [
        editItemAction('PlanTemplateCard.EDIT_ACTION', 'header', 'name,icon'),
        removeItemAction('PlanTemplateCard.REMOVE_ACTION', 'header'),
        editItemAction('PlanTemplateCard.EDIT_ACTION', 'description'),
        {
          id: 'edit-objectives', icon: 'las la-edit', tooltip: 'PlanTemplateCard.EDIT_ACTION', size: 'sm', 
          visible: 'canEditItem', handler: 'editObjectives', scope: 'objectives'
        },
        editItemAction('PlanTemplateCard.EDIT_ACTION', 'coordinators'),
        { 
          id: 'copy-plan-template', tooltip: 'PlanTemplateCard.COPY_ACTION', icon: 'las la-copy',
          visible: { name: '$can', params: ['update', 'plan-templates', ':contextId', ':item'] },
          route: { name: 'create-plan-template', params: { contextId: ':contextId', templateId: ':item._id' } },
          scope: 'footer'
        }
      ]
    }
  },
  eventActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        default: [
          { id: 'back', icon: 'las la-arrow-left', handler: 'goBack' },
          separator,
          { component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          {
            id: 'tools', component: 'menu/KMenu', icon: 'las la-wrench', tooltip: 'mixins.activity.TOOLS', actionRenderer: 'item',
            content: [
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } }
            ]
          },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: 'onToggleFullscreen' },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' }
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
        { id: 'add-media', label: 'EventActivity.ADD_MEDIA_LABEL', icon: 'las la-paperclip', handler: 'uploadMedia',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] } },
        { id: 'browse-media', label: 'EventActivity.BROWSE_MEDIA_LABEL', icon: 'photo_library', handler: 'browseMedia',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] } },
        { id: 'edit-event', label: 'EventActivity.EDIT_LABEL', icon: 'las la-edit',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] },
          route: { name: 'edit-map-event', params: { contextId: ':contextId', objectId: ':objectId' } } },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'onProbeLocation' }
      ]
    },
    engine: defaultMapOptions,
    catalog: defaultMapCatalog,
    layers: {
      actions: layerActions,
      filter: { id: { $in: ['layer-actions', 'zoom-to'] } }
    },
    restore: { view: false, layers: false },
    featuresChunkSize: 5000 // TODO: here or in mapEngine ?
  },
  
  routes: require('../src/router/routes')
}
