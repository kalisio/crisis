const groups = require('../src/tours/core/groups')

const website = 'https://www.kalisio.com'
const onlineHelp = 'https://kalisio.github.io/aktnmap'

const serverPort = process.env.PORT || process.env.HTTPS_PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080
const API_PREFIX = '/api'
let domain
let shortName = 'Akt\'n\'Map'
let stripeKey
// If we build a specific staging instance
if (process.env.NODE_APP_INSTANCE === 'dev') {
  domain = 'https://aktnmap.dev.kalisio.xyz'
  shortName = 'Akt\'n\'Map Dev'
} else if (process.env.NODE_APP_INSTANCE === 'test') {
  domain = 'https://aktnmap.test.kalisio.xyz'
  shortName = 'Akt\'n\'Map Test'
} else if (process.env.NODE_APP_INSTANCE === 'prod') {
  domain = 'https://aktnmap.prod.kalisio.com'
} else {
  // Otherwise we are on a developer machine
  if (process.env.NODE_ENV === 'development') {
    domain = 'http://localhost:' + clientPort // Akt'n'Map app client/server port = 8080/8081
  } else {
    domain = 'http://localhost:' + serverPort // Akt'n'Map app client/server port = 8081
  }
}
// Override defaults if env provided
if (process.env.SUBDOMAIN) {
  // In prod we use a generic domain which is routed towards the actual domain,
  // e.g. aktnmap.kalisio.com => aktnmap.prod.kalisio.com
  // This allow us to switch our production domain transparently (blue/green deployment)
  // notably because the app domain is "hardcoded" in the mobile app configuration
  if (process.env.NODE_APP_INSTANCE === 'prod') {
    domain = 'https://aktnmap.kalisio.com'
  } else {
    domain = 'https://aktnmap.' + process.env.SUBDOMAIN
  }
}
// On a developer machine will do domain = gateway = localhost
const gateway = (process.env.API_GATEWAY_URL ? process.env.API_GATEWAY_URL : domain.replace('aktnmap', 'api'))

const contextHelp = function (tour) {
  return Object.assign({
    id: 'contextual-help', icon: 'las la-question-circle', label: 'leftPane.CONTEXTUAL_HELP', renderer: 'item'
  }, tour ? { handler: { name: 'launchTour', params: [tour] } } : { handler: 'launchTour' })
}

// Left pane
const leftPane = function (tour) {
  return {
    content: [
      { component: 'KLogo' },
      { component: 'account/KIdentityPanel', class: 'full-width' },
      { id: 'my-organisations', icon: 'las la-grip-horizontal', label: 'leftPane.ORGANISATIONS', route: { name: 'organisations-activity' }, renderer: 'item' },
      { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px; max-height: 1px;' },
      { id: 'settings', icon: 'las la-cog', label: 'SETTINGS', renderer: 'item', dialog: {
          component: 'app/KSettings', title: 'SETTINGS', cancelAction: 'CANCEL', okAction: {
            id: 'apply-settings', label: 'APPLY', handler: 'apply'
          }
        }
      },
      { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px; max-height: 1px;' },
      { id: 'about', icon: 'las la-info', label: 'ABOUT', renderer: 'item', dialog: { 
        component: 'app/KAbout', title: 'ABOUT', okAction: 'CLOSE' } 
      },
      { id: 'online-help', icon: 'las la-book', label: 'leftPane.ONLINE_HELP', url: onlineHelp, renderer: 'item' },
      contextHelp(tour),
      { component: 'QSeparator', color: 'lightgrey', style: 'min-height: 1px; max-height: 1px;' },
      { id: 'logout', icon: 'las la-sign-out-alt', label: 'leftPane.LOGOUT', route: { name: 'logout' }, renderer: 'item' }
    ]
  }
}

// top widgets
const topWidgets = [{ 
  id: 'information-box', label: 'KInformationBox.LABEL', icon: 'las la-digital-tachograph', scrollable: true,
  content: { component: 'widget/KInformationBox' },
  header: [{
    id: 'center-view',
    icon: 'las la-eye',
    tooltip: 'KInformationBox.CENTER_ON',
    visible: 'hasFeature',
    handler: 'onCenterOn'
  }, {
    id: 'copy-properties',
    icon: 'las la-clipboard',
    tooltip: 'KInformationBox.COPY_PROPERTIES',
    visible: 'hasProperties',
    handler: 'onCopyProperties'
  }, {
    id: 'export-feature',
    icon: 'kdk:json.svg',
    tooltip: 'KInformationBox.EXPORT_FEATURE',
    visible: 'hasFeature',
    handler: 'onExportFeature'
  }] 
}, {
  id: 'time-series', label: 'KTimeSeries.LABEL', icon: 'las la-chart-line', 
  content: { component: 'widget/KTimeSeries' },
  header: [{
    id: 'absolute-time-range',
    component: 'time/KAbsoluteTimeRange'
  }, {
    id: 'restore-time-range',
    icon: 'las la-undo',
    tooltip: 'KTimeSeries.RESTORE_TIME_RANGE',
    visible: 'hasZoomHistory',
    handler: 'onZoomRestored'
  }, {
    id: 'relative-time-ranges',
    component: 'menu/KMenu',
    icon: 'las la-history',
    content: [{
      component: 'time/KRelativeTimeRanges',
      ranges: ['last-hour', 'last-2-hours', 'last-3-hours', 'last-6-hours',
        'last-12-hours', 'last-day', 'last-2-days', 'last-3-days', 'last-week',
        'next-12-hours', 'next-day', 'next-2-days', 'next-3-days']
    }]
  }, {
    id: 'center-view',
    icon: 'las la-eye',
    tooltip: 'KTimeSeries.CENTER_ON',
    visible: 'probedVariables',
    handler: 'onCenterOn'
  }, {
    id: 'export-feature',
    icon: 'las la-file-download',
    tooltip: 'KTimeSeries.EXPORT_SERIES',
    visible: 'probedVariables',
    handler: 'onExportSeries'
  }]
}, { 
  id: 'mapillary-viewer', label: 'KMapillaryViewer.LABEL', icon: 'kdk:mapillary.png',  
  content: { component: 'widget/KMapillaryViewer' },
  header: [{
    id: 'center',
    icon: 'las la-eye',
    tooltip: 'KMapillaryViewer.CENTER_ON',
    visible: 'hasImage',
    handler: 'centerMap'
  }]
}]

// Catalog tababr
function catalogTabbar (views, activeView) {
  const tabbar = {
    id: 'catalog-tabbar', component: 'KPanel', class: 'q-pa-sm', actionRenderer: 'tab', content: []
  }
  if (views.includes('event-participants')) tabbar.content.push({
    id: 'event-participant-tab', label: 'EventActivityPanel.PARTICIPANTS_LABEL', color: 'grey-7', toggle: { color: 'primary' },
    toggled: activeView === 'event-participants' ? true : false,
    handler: { name: 'setRightPaneMode', params: ['event-participants'] } 
  })
  if (views.includes('user-layers')) tabbar.content.push({
    id: 'user-layers', label: 'LAYERS_LABEL', color: 'grey-7', toggle: { color: 'primary' }, 
    toggled: activeView === 'user-layers' ? true : false,
    handler: { name: 'setRightPaneMode', params: ['user-layers'] } 
  })
  if (views.includes('user-views')) tabbar.content.push({
    id: 'user-views-tab', label: 'VIEWS_LABEL', color: 'grey-7', toggle: { color: 'primary' },
    toggled: activeView === 'user-views' ? true : false,
    handler: { name: 'setRightPaneMode', params: ['user-views'] } 
  })
  if (views.includes('catalog-layers')) tabbar.content.push({
    id: 'catalog-layers-tab', label: 'CATALOG_LABEL', color: 'grey-7', toggle: { color: 'primary' },
    toggled: activeView === 'catalog-layers' ? true : false,
    handler: { name: 'setRightPaneMode', params: ['catalog-layers'] } 
  })
  return tabbar
}

const separator = { component: 'QSeparator', vertical: true, color: 'grey-5' }
const midSeparator = { component: 'QSeparator', vertical: true, inset: true, color: 'grey-5', style: 'max-width: 1px; min-width: 1px;' }

const currentActivityStamp = function (id, icon, text) {
  return { id, component: 'KStamp', icon, iconSize: 'sm', text, direction: 'horizontal', class: 'text-grey-7' }
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
  if (scope) id += `-${scope}`
  return {
    id, scope, tooltip, icon: 'las la-edit', size: 'sm',
    visible: 'canEditItem', 
    handler: { name: 'editItem', params: [scope, properties] },
  }
}

const removeItemAction = function (tooltip, scope = undefined, prompt = 'confirm') {
  let id = 'remove-item'
  if (scope) id += `-${scope}`
  return {
    id, scope, tooltip, icon: 'las la-trash', size: 'sm',
    visible: 'canRemoveItem',
    handler: { name: 'removeItem', params: [prompt] }
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
  component: 'menu/KMenu',
  dropdownIcon: 'las la-ellipsis-v',
  actionRenderer: 'item',
  propagate: false,
  content: [
    { id: 'zoom-to-layer', label: 'mixins.activity.ZOOM_TO_LABEL', icon: 'las la-search-location', handler: 'onZoomToLayer', visible: ':isVisible' },
    { id: 'save-layer', label: 'mixins.activity.SAVE_LABEL', icon: 'las la-save', handler: 'onSaveLayer', visible: 'isLayerStorable' },
    { id: 'filter-layer-data', label: 'mixins.activity.FILTER_DATA_LABEL', icon: 'las la-filter', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      route: { name: 'map-layer-filter', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } } },
    { id: 'view-layer-data', label: 'mixins.activity.VIEW_DATA_LABEL', icon: 'las la-th-list', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      route: { name: 'map-layer-table', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } } },
    { id: 'chart-layer-data', label: 'mixins.activity.CHART_DATA_LABEL', icon: 'las la-chart-pie', visible: ['isFeatureLayer', 'hasFeatureSchema'],
      route: { name: 'map-layer-chart', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } } },
    { id: 'edit-layer', label: 'mixins.activity.EDIT_LABEL', icon: 'las la-file-alt', visible: 'isLayerEditable',
      route: { name: 'edit-map-layer', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } } },
    { id: 'edit-layer-style', label: 'mixins.activity.EDIT_LAYER_STYLE_LABEL', icon: 'las la-border-style', visible: 'isLayerStyleEditable',
      route: { name: 'edit-map-layer-style', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } } },
    { id: 'edit-layer-data', label: 'mixins.activity.START_EDIT_DATA_LABEL', icon: 'las la-edit', handler: 'onEditLayerData', visible: 'isLayerDataEditable',
      toggle: { icon: 'las la-edit', tooltip: 'mixins.activity.STOP_EDIT_DATA_LABEL' }, component: 'KEditLayerData' },
    { id: 'remove-layer', label: 'mixins.activity.REMOVE_LABEL', icon: 'las la-trash', handler: 'onRemoveLayer', visible: 'isLayerRemovable' }
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
  shortName,
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
  terms: 'aktnmap-terms',
  appWebsite: 'https://kalisio.com/solutions#aktnmap',
  appOnlineHelp: onlineHelp,
  publisher: 'Kalisio',
  publisherWebsite: website,
  locale: {
    // If you'd like to force locale otherwise it is retrieved from browser
    // default: 'en',
    fallback: 'en'
  },
  logs: {
    level: (process.env.NODE_ENV === 'development' ? 'debug' : 'info')
  },
  units: {
    // Nothing specific, use defaults
  },
  settings: {
    propertyMapping: {
      // Nothing specific, use defaults
    }
  },
  storage: {
    useProxy: true
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
    actions: [{ 
      id: 'terms-policies', 
      label: 'screen.TERMS_AND_POLICIES', 
      dialog: {
        component: 'app/KTerms'
      }
    }],
    login: {
      actions: [
        { id: 'reset-password-link', label: 'KLoginScreen.FORGOT_YOUR_PASSWORD_LABEL', route: {name: 'send-reset-password' } },
        { id: 'register-link', label: 'KLoginScreen.DONT_HAVE_AN_ACCOUNT_LABEL', route: { name: 'register' } },
        { id: 'contextual-help', label: 'KLoginScreen.CONTEXTUAL_HELP', route: { name: 'login', query: { tour: true } } }
      ]
    },
    logout: {
      actions: [
        { id: 'login-link', label: 'KLogoutScreen.LOG_IN_AGAIN_LABEL', route: { name: 'login' } }
      ]
    },
    register: {
      actions: [
        { id: 'login-link', label: 'KRegisterScreen.ALREADY_HAVE_AN_ACCOUNT_LABEL', route: { name: 'login' } },
        { id: 'contextual-help', label: 'KRegisterScreen.CONTEXTUAL_HELP', route: { name: 'register', query: { tour: true } } }
      ]
    },
    endpoint: {
      actions: [
        { id: 'login-link', label: 'KEndpointScreen.LOG_IN_LABEL', route: { name: 'login' } },
        { id: 'register-link', label: 'KEndpointScreen.DONT_HAVE_AN_ACCOUNT_LABEL', route: { name: 'register' } }
      ]
    }
  },
  layout: {
    view: 'lHh LpR lFf',
    page: { visible: true },
    panes: {
      left: { opener: true },
      top: { opener: true, visible: true },
      right: { opener: true },
      bottom: { opener: true }
    },
    fab: { visible: true }
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
      },
      mode: 'profile'
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
        default: [
          currentActivityStamp('organisations', 'las la-grip-horizontal', 'KOrganisationsActivity.ORGANISATIONS_LABEL'),
          midSeparator,
          { id: 'organisation-sorter', component: 'collection/KSorter', tooltip: 'KOrganisationsActivity.SORT_ORGANISATIONS' },
          { id: 'search-organisation', icon: 'las la-search', tooltip: 'KOrganisationsActivity.SEARCH_ORGANISATIONS', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        filter: contextFilter('name')
      },
      mode: 'default'
    },
    fab: {
      content: [
        { id: 'create-organisation', icon: 'las la-plus', tooltip: 'KOrganisationsActivity.CREATE_ORGANISATION_LABEL', route: { name: 'create-organisation' } }
      ]
    },
    items: {
      component: 'OrganisationCard',
      actions: [
        editItemAction('OrganisationCard.EDIT_ACTION', 'header', "name,avatar,color"),
        removeItemAction('OrganisationCard.REMOVE_ACTION', 'header', 'input'),
        editItemAction('OrganisationCard.EDIT_ACTION', 'description')
      ]
    }
  },
  plansActivity: {
    leftPane: leftPane(),
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'plan' },
          separator,
          currentActivityStamp('plans', 'las la-stream', 'PlansActivity.PLANS_LABEL'),
          archivedPlansAction(),
          midSeparator,
          { 
            id: 'plan-sorter',
            component: 'collection/KSorter', 
            tooltip: 'PlansActivity.SORT_PLANS',
            options: [
              { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
              { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 }, default: true },
              { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 } },
              { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
            ]
          },
          { id: 'search-plan', icon: 'las la-search', tooltip: 'PlansActivity.SEARCH_PLANS', handler: { name: 'setTopPaneMode', params: ['filter'] } },
        ],
        filter: contextFilter('name')
      },
      mode: 'default'
    },
    items: {
      actions: [
        editItemAction('PlanCard.EDIT_ACTION', 'header', 'name'),
        {
          id: 'remove-item-header', scope: 'header', tooltip: 'PlanCard.REMOVE_ACTION',
          icon: 'las la-check-circle', size: 'sm', visible: 'canRemoveItem', handler: { name: 'removeItem', params: ['confirm'] }
        },
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
        default: [
          { component: 'OrganisationMenu', mode: 'plan' },
          separator,
          plansAction(),
          currentActivityStamp('archived-plans', 'las la-archive', 'ArchivedPlansActivity.ARCHIVED_PLANS_LABEL'),         
        ],
        filter: contextFilter('name')
      },
      mode: 'default'
    },
    bottomPane: {
      content: [
        { id: 'absolute-time-range', component: 'time/KAbsoluteTimeRange', class: 'q-pa-sm text-body1' },
        midSeparator,
        {
          id: 'relative-time-ranges',
          component: 'menu/KMenu',
          icon: 'las la-history',
          content: [{
            component: 'time/KRelativeTimeRanges',
            ranges: ['last-day', 'last-2-days', 'last-3-days', 'last-week', 'last-2-weeks', 'last-month', 'last-2-months', 'last-3-months', 'last-6-months', 'last-year']
          }]
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
          currentActivityStamp('events', 'las la-fire', 'EventsActivity.EVENTS_LABEL'),
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
      },
      mode: 'default'
    },
    items: {
      actions: [
        editItemAction('EventCard.EDIT_ACTION', 'header', 'name'),
        {
          id: 'remove-item-header', scope: 'header', tooltip: 'EventCard.REMOVE_ACTION',
          icon: 'las la-check-circle', size: 'sm', visible: 'canRemoveItem', handler: 'removeEvent'
        },
        editItemAction('EventCard.EDIT_ACTION', 'description'),
        {
          id: 'goto-plan', scope: 'plan', tooltip: 'EventCard.PLAN_ACTION', icon: 'las la-arrow-alt-circle-right', size: 'sm',
          visible: ['item.plan._id'],
          route: { name: 'events-activity', params: { contextId: ':contextId' }, query: { plan: ':item.plan._id' } }
        },
        editItemAction('EventCard.EDIT_ACTION', 'objective'),
        editItemAction('EventCard.EDIT_ACTION', 'location'),
        editItemAction('EventCard.EDIT_ACTION', 'participants'),
        editItemAction('EventCard.EDIT_ACTION', 'coordinators'),
        { 
          id: 'event-map', tooltip: 'EventCard.MAP_LABEL', icon: 'las la-map-marked-alt',
          visible: ['hasAnyLocation', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }],
          handler:  'viewMap', scope: 'footer'
        },
        { 
          id: 'navigate', tooltip: 'EventCard.NAVIGATE_LABEL', icon: 'las la-location-arrow', 
          visible: ['hasAnyLocation', 'canNavigate', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }],
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
          currentActivityStamp('catalog', 'las la-map', 'Context.CATALOG'),
          archivedEventsAction(),
          midSeparator,
          { component: 'KLocateUser' },
          { id: 'search-location', icon: 'las la-search-location', tooltip: 'mixins.activity.SEARCH_LOCATION', handler: { name: 'setTopPaneMode', params: ['search-location'] } },
          {
            id: 'tools', component: 'menu/KMenu', icon: 'las la-wrench', tooltip: 'mixins.activity.TOOLS', actionRenderer: 'item',
            content: [
              { id: 'measure-tool', icon: 'las la-ruler-combined', label: 'KMeasureTool.TOOL_BUTTON_LABEL', handler: { name: 'setTopPaneMode', params: ['measure-tool'] } },
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } }
            ]
          },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', visible: '$q.screen.gt.md',
            toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: 'onToggleFullscreen'
          }
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
        ],
        'edit-layer-data': [
          { id: 'accept', icon: 'las la-arrow-left', handler: { name: 'onEndLayerEdition', params: ['accept'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KLayerEditionToolbar' }
        ],
        'measure-tool': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KMeasureTool' }
        ]
      },
      mode: 'default'
    },
    rightPane: {
      content: {
        'user-layers': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers'], 'user-layers'),
          { id: 'user-layers', component: 'catalog/KLayersPanel',
            layers: ':layers', layerCategories: ':layerCategories',
            layersFilter: { scope: { $in: ['user', 'activity'] } }, layerCategoriesFilter: { _id: { $exists: true } } },
          { component: 'QSpace' },
          { id: 'catalog-footer', component: 'KPanel', content: [{
              id: 'manage-layer-categories',
              icon: 'las la-cog',
              label: 'KLayerCategories.LAYER_CATEGORIES_LABEL',
              route: { name: 'manage-layer-categories' } 
            }]
          }
        ],
        'user-views': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers'], 'user-views'),
          { id: 'user-views', component: 'catalog/KViewsPanel' },
        ],
        'catalog-layers': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers'], 'catalog-layers'),
          { id: 'catalog-layers', component: 'catalog/KLayersPanel',
            layers: ':layers', layerCategories: ':layerCategories',
            layersFilter: { scope: { $nin: ['user', 'system', 'activity'] } }, layerCategoriesFilter: { _id: { $exists: false } },
            forecastModels: ':forecastModels' }
        ]
      },
      mode: 'user-layers'
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    page: {
      content: [
        { component: 'layout/KPageSticky', position: 'left', offset: [18, 0], content: [{ component: 'KColorLegend' }] }, 
        { component: 'layout/KPageSticky', position: 'top-left', offset: [18, 18], content: [{ component: 'KUrlLegend' }] }, 
        { component: 'KFeatureActionButton' }
      ]
    },
    windows: {
      top: { content: topWidgets }
    },
    fab: {
      content: [
        { id: 'create-view', icon: 'las la-star', label: 'mixins.activity.CREATE_VIEW', route: { name: 'create-map-view' } },
        { id: 'add-layer', icon: 'las la-plus', label: 'mixins.activity.ADD_LAYER', route: { name: 'add-map-layer' } },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'probeAtLocation' }
      ]
    },
    engine: defaultMapOptions,
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
          currentActivityStamp('archived-events', 'las la-clipboard-list', 'Context.ARCHIVED_EVENTS'),
          midSeparator,
          { component: 'EventFilter' },
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
      },
      mode: 'history'
    },
    rightPane: {
      content: {
        'history': [],
        'user-layers': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers'], 'user-layers'),
          { id: 'user-layers', component: 'catalog/KLayersPanel',
            layers: ':layers', layerCategories: ':layerCategories',
            layersFilter: { scope: { $in: ['user', 'activity'] } }, layerCategoriesFilter: { _id: { $exists: true } } }
        ],
        'user-views': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers'], 'user-views'),
          { id: 'user-views', component: 'catalog/KViewsPanel' },
        ],
        'catalog-layers': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers'], 'catalog-layers'),
          { id: 'catalog-layers', component: 'catalog/KLayersPanel',
            layers: ':layers', layerCategories: ':layerCategories',
            layersFilter: { scope: { $nin: ['user', 'system', 'activity'] } }, layerCategoriesFilter: { _id: { $exists: false } },
            forecastModels: ':forecastModels' }
        ],
        'chart': []
      },
      mode: 'history'
    },
    bottomPane: {
      content: [
        { id: 'absolute-time-range', component: 'time/KAbsoluteTimeRange', class: 'q-pa-sm text-body1' },
        midSeparator,
        {
          id: 'relative-time-ranges',
          component: 'menu/KMenu',
          icon: 'las la-history',
          content: [{
            component: 'time/KRelativeTimeRanges',
            ranges: ['last-hour', 'last-2-hours', 'last-3-hours', 'last-6-hours', 'last-12-hours', 'last-day', 'last-week', 'last-month', 'last-3-months', 'last-6-months', 'last-year']
          }]
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
          id: 'goto-plan', scope: 'plan', tooltip: 'ArchivedEventCard.PLAN_ACTION', icon: 'las la-arrow-alt-circle-right', size: 'sm',
          visible: ['item.plan._id'],
          route: { name: 'archived-events-activity', params: { contextId: ':contextId' }, query: { plan: ':item.plan._id' } }
        },
        { 
          id: 'browse-media', tooltip: 'ArchivedEventCard.BROWSE_MEDIA', icon: 'las la-photo-video', handler: 'browseMedia',
          visible: ['hasMedias', { name: '$can', params: ['read', 'archived-events', ':contextId'] }], scope: 'footer'
        }
      ]
    },
    engine: defaultMapOptions,
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
          currentActivityStamp('members', 'las la-user-friends', 'KMembersActivity.MEMBERS_LABEL'),
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
          { service: 'groups', field: 'name', baseQuery: {}, icon: { name: 'las la-sitemap' } },
          { service: 'tags', field: 'value', baseQuery: {}, icon: { name: 'las la-tag' } }
        ])
      },
      mode: 'default'
    },
    fab: {
      content: [{ 
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
          currentActivityStamp('tags', 'las la-tags', 'KTagsActivity.TAGS_LABEL'),
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
      },
      mode: 'default'
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
          currentActivityStamp('groups', 'las la-sitemap', 'KGroupsActivity.GROUPS_LABEL'),
          eventTemplatesAction(),
          planTemplatesAction(),
          midSeparator,          
          { id: 'group-sorter', component: 'collection/KSorter', tooltip: 'KGroupsActivity.SORT_GROUPS' },
          { id: 'search-group', icon: 'las la-search', tooltip: 'KGroupsActivity.SEARCH_GROUPS', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        'filter': contextFilter('name')
      },
      mode: 'default'
    },
    fab: {
      content: [{ id: 'create-group', icon: 'las la-plus', tooltip: 'KGroupsActivity.CREATE_GROUP_LABEL',
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
          currentActivityStamp('event-templates', 'las la-fire', 'EventTemplatesActivity.EVENT_TEMPLATES_LABEL'),
          planTemplatesAction(),
          midSeparator,
          { id: 'event-template-sorter', component: 'collection/KSorter', tooltip: 'EventTemplatesActivity.SORT_EVENT_TEMPLATES' },
          { id: 'search-event-template', icon: 'las la-search', tooltip: 'EventTemplatesActivity.SEARCH_EVENT_TEMPLATES', handler: { name: 'setTopPaneMode', params: ['filter'] } },
        ],
        'filter': contextFilter('name')
      },
      mode: 'default'
    },
    fab: {
      content: [{
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
        editItemAction('EventTemplateCard.EDIT_ACTION', 'permission'),
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
          currentActivityStamp('plan-templates', 'las la-stream', 'PlanTemplatesActivity.PLAN_TEMPLATES_LABEL'),
          midSeparator,
          { id: 'event-template-sorter', component: 'collection/KSorter', tooltip: 'EventTemplatesActivity.SORT_EVENT_TEMPLATES' },
          { id: 'search-event-template', icon: 'las la-search', tooltip: 'EventTemplatesActivity.SEARCH_EVENT_TEMPLATES', handler: { name: 'setTopPaneMode', params: ['filter'] } },
        ],
        'filter': contextFilter('name')
      },
      mode: 'default'
    },
    fab: {
      content: [{
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
        editItemAction('EventTemplateCard.EDIT_ACTION', 'permission'),
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
              { id: 'measure-tool', icon: 'las la-ruler-combined', label: 'KMeasureTool.TOOL_BUTTON_LABEL', handler: { name: 'setTopPaneMode', params: ['measure-tool'] } },
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } }
            ]
          },
          { id: 'toggle-fullscreen', icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', visible: '$q.screen.gt.md',
            toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' }, handler: 'onToggleFullscreen'
          },
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
        ],
        'measure-tool': [
          { id: 'accept', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          { component: 'QSeparator', vertical: true, color: 'lightgrey' },
          { component: 'KMeasureTool' }
        ]
      },
      mode: 'default'
    },
    rightPane: {
      content: {
        'event-participants': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers', 'event-participants'], 'event-participants'),
          { id: 'event-participants', component: 'EventActivityPanel', participants: ':participants' }
        ],
        'user-layers': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers', 'event-participants'], 'user-layers'),
          { id: 'user-layers', component: 'catalog/KLayersPanel',
            layers: ':layers', layerCategories: ':layerCategories',
            layersFilter: { scope: { $in: ['user', 'activity'] } }, layerCategoriesFilter: { _id: { $exists: true } } }
        ],
        'user-views': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers', 'event-participants'], 'user-views'),
          { id: 'user-views', component: 'catalog/KViewsPanel' },
        ],
        'catalog-layers': [
          catalogTabbar(['user-layers', 'user-views', 'catalog-layers', 'event-participants'], 'catalog-layers'),
          { id: 'catalog-layers', component: 'catalog/KLayersPanel',
            layers: ':layers', layerCategories: ':layerCategories',
            layersFilter: { scope: { $nin: ['user', 'system', 'activity'] } }, layerCategoriesFilter: { _id: { $exists: false } },
            forecastModels: ':forecastModels' }
        ]
      },
      mode: 'event-participants'
    },
    bottomPane: {
      content: [
        { component: 'KTimeline' }
      ]
    },
    page: {
      content: [{
        component: 'layout/KPageSticky', position: 'left', offset: [18, 0], content: [{ component: 'KColorLegend' }]
      }]
    },
    windows: {
      top: { content: topWidgets }
    },
    fab: {
      content: [
        { id: 'add-media', label: 'EventActivity.ADD_MEDIA_LABEL', icon: 'las la-paperclip', handler: 'uploadMedia',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] } },
        { id: 'browse-media', label: 'EventActivity.BROWSE_MEDIA_LABEL', icon: 'photo_library', handler: 'browseMedia',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] } },
        { id: 'edit-event', label: 'EventActivity.EDIT_LABEL', icon: 'las la-edit',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] },
          route: { name: 'edit-map-event', params: { contextId: ':contextId', objectId: ':objectId' } } },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'probeAtLocation' }
      ]
    },
    engine: defaultMapOptions,
    layers: {
      actions: layerActions,
      filter: { id: { $in: ['layer-actions', 'zoom-to'] } }
    },
    restore: { view: false, layers: false },
    featuresChunkSize: 5000 
  },
  
  routes: require('../src/router/routes')
}
