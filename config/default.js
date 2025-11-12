const helpers = require('./kdk/helpers.js')
const leftPane = require('./kdk/panes.left.js')
const panesTop = require('./kdk/panes.top.js')
const topPane = require('./kdk/panes.top.js')
const widgetsLeft = require('./kdk/widgets.left.js')
const widgetsTop = require('./kdk/widgets.top.js')

const website = 'https://www.kalisio.com'
const onlineHelp = 'https://doc.planet.kalisio.com'
const changelog = onlineHelp + '/quickstart/history.html'

const serverPort = process.env.PORT || process.env.HTTPS_PORT || 8081
// Required to know webpack port so that in dev we can build correct URLs
const clientPort = process.env.CLIENT_PORT || process.env.HTTPS_CLIENT_PORT || 8080
const APP_SLUG = 'crisis'
const API_PREFIX = '/api'
const appName = 'Kalisio Crisis'
let pwaAppName = appName
let pwaShortName = appName

// If we build a specific staging instance
if (process.env.NODE_APP_INSTANCE === 'dev') {
  pwaAppName += ' (dev)'
  pwaShortName += ' (dev)'
} else if (process.env.NODE_APP_INSTANCE === 'test') {
  pwaAppName += ' (test)'
  pwaShortName += ' (test)'
} else if (process.env.NODE_APP_INSTANCE === 'prod') {
  // Nothing to do
} else {
  // Otherwise we are on a developer machine
  pwaAppName += ' (localhost)'
  pwaShortName += ' (localhost)'
}

// Left pane
const LEFT_PANE = {
  content: [
    { component: 'account/KProfile', class: 'full-width' },
    { id: 'my-organisations', icon: 'las la-grip-horizontal', label: 'leftPane.ORGANISATIONS', route: { name: 'organisations-activity' }, renderer: 'item' },
    helpers.horizontalSeparator(),
    leftPane.settings(),
    helpers.horizontalSeparator(),
    leftPane.about(),
    leftPane.onlineHelp({ url: onlineHelp }),
    leftPane.contextualHelp(),
    helpers.horizontalSeparator(),
    leftPane.logout()
  ]
}
const mapTools = () => {
  return [
    {
      id: 'map-tools',
      component: 'menu/KMenu',
      icon: 'las la-wrench',
      tooltip: 'mixins.activity.TOOLS',
      actionRenderer: 'item',
      content: [
        topPane.activeMeasureToolMode(),
        topPane.toggleLegend(),
        topPane.togglePosition(),
        topPane.toggleNorthArrow(),
        helpers.horizontalSeparator(),
        topPane.toggleFullscreen()
      ]
    }
  ]
}
// Left window
const leftWidgets = [widgetsLeft.LEGEND]

// top widgets
const topWidgets = [widgetsTop.INFORMATION_BOX, widgetsTop.TIME_SERIES, widgetsTop.MAPILLARY_VIEWER]

// Catalog tababr
function catalogTabbar (views, activeView) {
  const tabbar = {
    id: 'catalog-tabbar', component: 'KPanel', class: 'q-pa-sm justify-center', actionRenderer: 'tab', content: []
  }
  if (views.includes('event-participants')) {
    tabbar.content.push({
      id: 'event-participant-tab',
      label: 'EventActivityPanel.PARTICIPANTS_LABEL',
      color: 'grey-7',
      toggle: { color: 'primary' },
      toggled: activeView === 'event-participants',
      handler: { name: 'setRightPaneMode', params: ['event-participants'] }
    })
  }
  if (views.includes('user-layers')) {
    tabbar.content.push({
      id: 'user-layers',
      label: 'LAYERS_LABEL',
      color: 'grey-7',
      toggle: { color: 'primary' },
      toggled: activeView === 'user-layers',
      handler: { name: 'setRightPaneMode', params: ['user-layers'] }
    })
  }
  if (views.includes('user-views')) {
    tabbar.content.push({
      id: 'user-views-tab',
      label: 'VIEWS_LABEL',
      color: 'grey-7',
      toggle: { color: 'primary' },
      toggled: activeView === 'user-views',
      handler: { name: 'setRightPaneMode', params: ['user-views'] }
    })
  }
  if (views.includes('catalog-layers')) {
    tabbar.content.push({
      id: 'catalog-layers-tab',
      label: 'CATALOG_LABEL',
      color: 'grey-7',
      toggle: { color: 'primary' },
      toggled: activeView === 'catalog-layers',
      handler: { name: 'setRightPaneMode', params: ['catalog-layers'] }
    })
  }
  return tabbar
}

const separator = helpers.verticalSeparator()
const midSeparator = helpers.verticalSeparator({ inset: true, style: 'max-width: 1px; min-width: 1px;' })

const plansAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('plans', 'las la-stream', 'PlansActivity.PLANS_LABEL', { contextId: `:${contextId}` }),
    visible: { name: '$can', params: ['service', 'plans', `:${contextId}`] }
  }
}

const archivedPlansAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('archived-plans', 'las la-archive', 'ArchivedPlansActivity.ARCHIVED_PLANS_LABEL', { contextId: `:${contextId}` }),
    visible: { name: '$can', params: ['service', 'archived-plans', `:${contextId}`] }
  }
}

const eventsAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('events', 'las la-fire', 'EventsActivity.EVENTS_LABEL', { contextId: `:${contextId}` }, { plan: ':plan' }),
    visible: { name: '$can', params: ['service', 'events', `:${contextId}`] }
  }
}

const mapAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('map', 'las la-map', 'Context.MAP', { contextId: `:${contextId}` }, { plan: ':plan' }),
    visible: { name: '$can', params: ['read', 'catalog', `:${contextId}`] }
  }
}

const catalogAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('catalog', 'las la-map', 'Context.CATALOG', { contextId: `:${contextId}` }, { plan: ':plan' }),
    visible: { name: '$can', params: ['update', 'catalog', `:${contextId}`] }
  }
}

const archivedEventsAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('archived-events', 'las la-clipboard-list', 'Context.ARCHIVED_EVENTS', { contextId: `:${contextId}` }, { plan: ':plan' }),
    visible: { name: '$can', params: ['service', 'archived-events', `:${contextId}`] }
  }
}

const membersAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('members', 'las la-user-friends', 'KMembersActivity.MEMBERS_LABEL', { contextId: `:${contextId}` }),
    visible: { name: '$can', params: ['service', 'members', `:${contextId}`] }
  }
}

const tagsAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('tags', 'las la-tags', 'KTagsActivity.TAGS_LABEL', { contextId: `:${contextId}` }),
    visible: { name: '$can', params: ['service', 'tags', `:${contextId}`] }
  }
}

const groupsAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('groups', 'las la-sitemap', 'KGroupsActivity.GROUPS_LABEL', { contextId: `:${contextId}` }),
    visible: { name: '$can', params: ['service', 'groups', `:${contextId}`] }
  }
}

const eventTemplatesAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('event-templates', 'las la-fire', 'EventTemplatesActivity.EVENT_TEMPLATES_LABEL', { contextId: `:${contextId}` }),
    visible: { name: '$can', params: ['service', 'event-templates', `:${contextId}`] }
  }
}

const planTemplatesAction = function (contextId = 'contextId') {
  return {
    ...panesTop.activityLink('plan-templates', 'las la-stream', 'PlanTemplatesActivity.PLAN_TEMPLATES_LABEL', { contextId: `:${contextId}` }),
    visible: { name: '$can', params: ['service', 'plan-templates', `:${contextId}`] }
  }
}

const editItemAction = function (tooltip, scope = undefined, properties = undefined) {
  let id = 'edit-item'
  if (scope) id += `-${scope}`
  return {
    id,
    scope,
    tooltip,
    icon: 'las la-edit',
    size: 'sm',
    visible: 'canEditItem',
    handler: { name: 'editItem', params: [scope, properties] }
  }
}

const removeItemAction = function (tooltip, scope = undefined, prompt = 'confirm', nameField = 'name') {
  let id = 'remove-item'
  if (scope) id += `-${scope}`
  return {
    id,
    scope,
    tooltip,
    icon: 'las la-trash',
    size: 'sm',
    visible: 'canRemoveItem',
    handler: { name: 'removeItem', params: [prompt, nameField] }
  }
}

const addWorkflowAction = function (tooltip) {
  return {
    id: 'add-item-workflow',
    scope: 'workflow',
    tooltip,
    icon: 'las la-plus-circle',
    size: 'sm',
    visible: ['canEditItem', '!item.workflow'],
    route: { name: 'edit-event-template-workflow', params: { contextId: ':contextId', objectId: ':item._id' } }
  }
}
const editWorkflowAction = function (tooltip) {
  return {
    id: 'edit-item-workflow',
    scope: 'workflow',
    tooltip,
    icon: 'las la-edit',
    size: 'sm',
    visible: ['canEditItem', 'item.workflow'],
    route: { name: 'edit-event-template-workflow', params: { contextId: ':contextId', objectId: ':item._id' } }
  }
}
const removeWorkflowAction = function (tooltip) {
  return {
    id: 'remove-item-workflow',
    scope: 'workflow',
    tooltip,
    icon: 'las la-trash',
    size: 'sm',
    visible: ['canEditItem', 'item.workflow'],
    handler: { name: 'removeWorkflow' }
  }
}

const mapEngine = {
  viewer: {
    minZoom: 3,
    maxZoom: 19,
    center: [47, 3],
    zoom: 6,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 0.25
  },
  // COLORS USED IN STYLES SHOULD BE PART OF THE QUASAR PALETTE NOT RANDOM RGB COLORS
  // THIS IS DUE TO KDK EDITING COMPONENTS ONLY SUPPORTING COLORS FROM PALETTE NOW
  // Default GeoJSON layer style for polygons/lines
  style: {
    point: { shape: 'circle', color: 'red' },
    line: { color: 'red', width: 3 },
    polygon: {
      color: 'red',
      opacity: 0.5,
      stroke:
      { color: 'red', opacity: 0.5 }
    },
    location: {
      point: {
        shape: 'marker-pin',
        color: 'primary',
        size: [20, 30],
        icon:
        { classes: 'fas fa-circle', color: 'white', size: 12, translation: ['-50%', '-90%'] }
      },
      line: { color: 'primary', width: 3 },
      polygon: {
        color: 'primary',
        opacity: 0.5,
        stroke:
        { color: 'primary' }
      }
    },
    edition: {
      point: {
        shape: 'circle',
        color: 'yellow',
        stroke:
        { color: 'red', width: 3, dashArray: '0 5 0' }
      },
      line: { color: 'red', width: 3, dashArray: '0 5 0' },
      polygon: {
        color: 'yellow',
        opacity: 0.5,
        stroke:
        { color: 'red', width: 3, dashArray: '0 5 0' }
      }
    },
    selection: {
      point: {
        shape: 'circle',
        color: 'primary',
        opacity: 0.5,
        radius: 10,
        stroke:
        { color: 'dark', width: 1 }
      },
      line: { color: 'primary', opacity: 0.25, width: 10 },
      polygon: {
        color: 'primary',
        opacity: 0.25,
        stroke:
        { color: 'primary', opacity: 0.25, width: 10 }
      }
    }
  },
  // Default GeoJSON infobox will display all properties
  popup: { pick: [] },
  infobox: {},
  cluster: { disableClusteringAtZoom: 18 },
  fileLayers: {
    fileSizeLimit: 1024 * 1024,
    formats: ['.geojson', '.kml', '.gpx']
  }
}

const contextFilter = function (field, services = []) {
  return [
    { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
    helpers.verticalSeparator(),
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
    {
      id: 'filter-layer-data',
      label: 'mixins.activity.FILTER_DATA_LABEL',
      icon: 'las la-filter',
      visible: ['isFeatureLayer', 'hasFeatureSchema'],
      route: { name: 'map-layer-filter', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } }
    },
    {
      id: 'view-layer-data',
      label: 'mixins.activity.VIEW_DATA_LABEL',
      icon: 'las la-th-list',
      visible: ['isFeatureLayer', 'hasFeatureSchema'],
      route: { name: 'map-layer-table', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } }
    },
    {
      id: 'chart-layer-data',
      label: 'mixins.activity.CHART_DATA_LABEL',
      icon: 'las la-chart-pie',
      visible: ['isFeatureLayer', 'hasFeatureSchema'],
      route: { name: 'map-layer-chart', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } }
    },
    {
      id: 'edit-layer',
      label: 'mixins.activity.EDIT_LABEL',
      icon: 'las la-file-alt',
      visible: 'isLayerEditable',
      route: { name: 'edit-map-layer', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } }
    },
    {
      id: 'edit-layer-style',
      label: 'mixins.activity.EDIT_LAYER_STYLE_LABEL',
      icon: 'las la-border-style',
      visible: 'isLayerStyleEditable',
      route: { name: 'edit-map-layer-style', params: { contextId: ':contextId', layerId: ':_id', layerName: ':name' } }
    },
    {
      id: 'edit-layer-data',
      label: 'mixins.activity.START_EDIT_DATA_LABEL',
      icon: 'las la-edit',
      handler: 'onEditLayerData',
      visible: 'isLayerDataEditable',
      toggle: { icon: 'las la-edit', tooltip: 'mixins.activity.STOP_EDIT_DATA_LABEL' },
      component: 'KEditLayerData'
    },
    { id: 'remove-layer', label: 'mixins.activity.REMOVE_LABEL', icon: 'las la-trash', handler: 'onRemoveLayer', visible: 'isLayerRemovable' }
  ]
}]

module.exports = {
  appName,
  appSlug: APP_SLUG,
  pwaAppName,
  pwaShortName,
  buildMode: process.env.BUILD_MODE === 'pwa' ? 'pwa' : 'spa',
  appLogo: `${APP_SLUG}-logo-color-384x192.png`,
  appChangelog: changelog,
  appOnlineHelp: onlineHelp,
  flavor: process.env.NODE_APP_INSTANCE || 'dev',
  version: require('../package.json').version,
  buildNumber: process.env.BUILD_NUMBER,
  apiPath: API_PREFIX,
  apiJwt: `${APP_SLUG}-jwt`,
  apiTimeout: 20000,
  transport: 'websocket', // Could be 'http' or 'websocket',
  gatewayJwtField: 'jwt',
  gatewayJwt: `${APP_SLUG}-gateway-jwt`,
  planets: {
    'kalisio-planet': {
      apiJwt: 'kalisio-planet-jwt',
      gatewayJwtField: 'jwt',
      gatewayJwt: 'kalisio-planet-gateway-jwt',
      project: {
        default: { identifier: APP_SLUG }
      }
    }
  },
  terms: 'crisis-terms',
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
  roles: {
    // Member/Manager/Owner
    labels: ['MEMBER', 'MANAGER', 'OWNER'],
    icons: ['las la-user', 'las la-briefcase', 'las la-certificate']
  },
  context: {
    service: 'organisations'
  },
  about: {
    actions: [
      leftPane.platformInfo(),
      leftPane.reportBug(),
      {
        id: 'view-changelog',
        icon: 'las la-history',
        label: 'KAbout.VIEW_CHANGELOG',
        stack: true,
        url: changelog
      }
    ]
  },
  profile: {
    header: 'account/ProfileHeader'
  },
  screens: {
    actions: [{
      id: 'terms-policies',
      label: 'screen.TERMS_AND_POLICIES',
      dialog: {
        component: 'document/KDocument',
        url: 'crisis-terms.md'
      }
    }],
    login: {
      actions: [
        { id: 'reset-password-link', label: 'KLoginScreen.FORGOT_YOUR_PASSWORD_LABEL', route: { name: 'send-reset-password' } },
        { id: 'register-link', label: 'KLoginScreen.DONT_HAVE_AN_ACCOUNT_LABEL', route: { name: 'register' } }
        // { id: 'contextual-help', label: 'KLoginScreen.CONTEXTUAL_HELP', route: { name: 'login', query: { tour: true } } }
      ]
    },
    logout: {
      actions: [
        { id: 'login-link', label: 'KLogoutScreen.LOG_IN_AGAIN_LABEL', route: { name: 'login' } }
      ]
    },
    register: {
      actions: [
        { id: 'login-link', label: 'KRegisterScreen.ALREADY_HAVE_AN_ACCOUNT_LABEL', route: { name: 'login' } }
        // { id: 'contextual-help', label: 'KRegisterScreen.CONTEXTUAL_HELP', route: { name: 'register', query: { tour: true } } }
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
  account: {
    sections: [
      { title: 'PasswordManager.TITLE', component: 'account/PasswordManager', id: 'password-manager' },
      { title: 'EmailManager.TITLE', component: 'account/EmailManager', id: 'email-manager' },
      {
        title: 'KSubscriptionsManager.TITLE',
        component: 'account/KSubscriptionsManager',
        id: 'subscriptions-manager',
        actions: [
          { id: 'unsubscribe', tooltip: 'KSubscription.UNSUBSCRIBE_LABEL', icon: 'phonelink_erase', handler: 'unsubscribe' }
        ]
      }
    ],
    deletable: true
  },
  engines: {
    leaflet: mapEngine
  },
  readers: {
    core: [
      { mimeTypes: '.json', reader: 'JSONReader' },
      { mimeTypes: '.csv', reader: 'CSVReader' }
    ],
    map: [
      { mimeTypes: '.geojson', reader: 'GEOJSONReader' },
      { mimeTypes: '.gpx', reader: 'GPXReader' },
      { mimeTypes: '.kml', reader: 'KMLReader' },
      { mimeTypes: '.shp', reader: 'SHPReader' }
    ]
  },
  organisationsActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          topPane.activityStamp('organisations', 'las la-grip-horizontal', 'KOrganisationsActivity.ORGANISATIONS_LABEL'),
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
        editItemAction('OrganisationCard.EDIT_ACTION', 'header', 'name,avatar,color'),
        removeItemAction('OrganisationCard.REMOVE_ACTION', 'header', 'input'),
        editItemAction('OrganisationCard.EDIT_ACTION', 'description')
      ]
    }
  },
  plansActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'plan' },
          separator,
          topPane.activityStamp('plans', 'las la-stream', 'PlansActivity.PLANS_LABEL'),
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
          { id: 'search-plan', icon: 'las la-search', tooltip: 'PlansActivity.SEARCH_PLANS', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        filter: contextFilter('name')
      },
      mode: 'default'
    },
    items: {
      actions: [
        editItemAction('PlanCard.EDIT_ACTION', 'header', 'name'),
        {
          id: 'remove-item-header',
          scope: 'header',
          tooltip: 'PlanCard.REMOVE_ACTION',
          icon: 'las la-check-circle',
          size: 'sm',
          visible: 'canRemoveItem',
          handler: { name: 'removeItem', params: ['confirm'] }
        },
        editItemAction('PlanCard.EDIT_ACTION', 'description'),
        // Specific case of custom objective editor
        {
          id: 'edit-objectives',
          icon: 'las la-edit',
          tooltip: 'PlanCard.EDIT_ACTION',
          size: 'sm',
          visible: 'canEditItem',
          handler: 'editObjectives',
          scope: 'objectives'
        },
        editItemAction('PlanCard.EDIT_ACTION', 'location'),
        editItemAction('PlanCard.EDIT_ACTION', 'coordinators')
      ]
    }
  },
  archivedPlansActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'plan' },
          separator,
          plansAction(),
          topPane.activityStamp('archived-plans', 'las la-archive', 'ArchivedPlansActivity.ARCHIVED_PLANS_LABEL')
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
        id: 'goto-plan-archive',
        icon: 'las la-clipboard-list',
        tooltip: 'ArchivedPlanCard.GOTO_ARCHIVED_EVENTS',
        route: { name: 'archived-events-activity', params: { contextId: ':contextId' }, query: { plan: ':item._id' } },
        visible: { name: '$can', params: ['service', 'archived-events', ':contextId'] },
        scope: 'footer'
      }]
    }
  },
  eventsActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'run' },
          separator,
          { component: 'PlanMenu' },
          topPane.activityStamp('events', 'las la-fire', 'EventsActivity.EVENTS_LABEL'),
          mapAction(),
          archivedEventsAction(),
          midSeparator,
          {
            id: 'event-sorter',
            component: 'collection/KSorter',
            tooltip: 'EventsActivity.SORT_EVENTS',
            options: [
              { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
              { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 }, default: true },
              { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 } },
              { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
            ]
          },
          { id: 'search-event', icon: 'las la-search', tooltip: 'EventsActivity.SEARCH_EVENTS', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        filter: contextFilter('name')
      },
      mode: 'default'
    },
    items: {
      actions: [
        editItemAction('EventCard.EDIT_ACTION', 'header', 'name'),
        {
          id: 'remove-item-header',
          scope: 'header',
          tooltip: 'EventCard.REMOVE_ACTION',
          icon: 'las la-check-circle',
          size: 'sm',
          visible: 'canRemoveItem',
          handler: 'removeEvent'
        },
        editItemAction('EventCard.EDIT_ACTION', 'description'),
        {
          id: 'goto-plan',
          scope: 'plan',
          tooltip: 'EventCard.PLAN_ACTION',
          icon: 'las la-arrow-alt-circle-right',
          size: 'sm',
          visible: ['item.plan._id'],
          route: { name: 'events-activity', params: { contextId: ':contextId' }, query: { plan: ':item.plan._id' } }
        },
        editItemAction('EventCard.EDIT_ACTION', 'objective'),
        editItemAction('EventCard.EDIT_ACTION', 'location'),
        editItemAction('EventCard.EDIT_ACTION', 'participants'),
        editItemAction('EventCard.EDIT_ACTION', 'coordinators'),
        {
          id: 'event-map',
          tooltip: 'EventCard.MAP_LABEL',
          icon: 'las la-map-marked-alt',
          visible: ['hasAnyLocation', { name: '$can', params: ['read', 'events', ':contextId', ':item'] }],
          handler: 'viewMap',
          scope: 'footer'
        },
        {
          id: 'navigate-menu',
          scope: 'footer',
          component: 'menu/KMenu',
          icon: 'las la-location-arrow',
          tooltip: 'EventCard.NAVIGATE_LABEL',
          actionRenderer: 'item',
          dense: true,
          visible: 'hasAnyLocation',
          content: [
            { id: 'navigate-google-maps', icon: 'fab fa-google', label: 'EventCard.GOOGLE_MAPS_LABEL', handler: 'launchGoogleMaps' },
            { id: 'navigate-apple-plans', icon: 'fab fa-apple', label: 'EventCard.APPLE_PLANS_LABEL', handler: 'launchApplePlans' },
            { id: 'navigate-waze-map', icon: 'fab fa-waze', label: 'EventCard.WAZE_LABEL', handler: 'launchWaze' }
          ]
        }
      ]
    }
  },
  catalogActivity: {
    padding: false,
    leftPane: LEFT_PANE,
    mode: 'default'
  },
  mapActivity: {
    padding: false,
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'run' },
          separator,
          { component: 'PlanMenu' },
          eventsAction(),
          topPane.activityStamp('catalog', 'las la-map', 'Context.MAP'),
          archivedEventsAction(),
          midSeparator,
          topPane.locateUser(),
          topPane.activeLocationSearchMode(),
          ...mapTools()
        ],
        'display-position': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          helpers.verticalSeparator(),
          { component: 'KPositionIndicator' }
        ],
        'search-location': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          helpers.verticalSeparator(),
          { component: 'tools/KSearchTool', geocoders: null }
        ],
        'edit-layer-data': [
          { id: 'accept', icon: 'las la-arrow-left', handler: { name: 'onEndLayerEdition', params: ['accept'] } },
          helpers.verticalSeparator(),
          { component: 'KLayerEditionToolbar' }
        ],
        'measure-tool': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          helpers.verticalSeparator(),
          { component: 'KMeasureTool' }
        ]
      },
      mode: 'default'
    },
    rightPane: {
      content: [{
        component: 'KTab',
        content: {
          'user-layers': [
            {
              id: 'user-layers',
              component: 'catalog/KLayersPanel',
              layers: ':layers',
              layerCategories: ':layerCategories',
              layersFilter: { scope: { $in: ['user', 'activity'] } },
              layerCategoriesFilter: { _id: { $exists: true } }
            }
          ],
          'user-views': [
            { id: 'user-views', component: 'catalog/KViewsPanel', suspense: true }
          ],
          'catalog-layers': [
            {
              id: 'catalog-layers',
              component: 'catalog/KLayersPanel',
              layers: ':layers',
              layerCategories: ':layerCategories',
              layersFilter: { scope: { $nin: ['user', 'system', 'activity'] } },
              layerCategoriesFilter: { _id: { $exists: false } },
              forecastModels: ':forecastModels'
            }
          ]
        },
        labels: ['LAYERS_LABEL', 'VIEWS_LABEL', 'CATALOG_LABEL'],
        mode: 'user-layers'
      }],
      state: 'responsive'
    },
    bottomPane: {
      content: [
        { component: 'time/KTimeControl' }
      ]
    },
    page: {
      content: [
        { component: 'KFeatureActionButton' }
      ]
    },
    windows: {
      left: { content: leftWidgets },
      top: { content: topWidgets }
    },
    fab: {
      content: [
        { id: 'create-view', icon: 'las la-star', label: 'mixins.activity.CREATE_VIEW', route: { name: 'create-map-view' } },
        { id: 'add-layer', icon: 'las la-plus', label: 'mixins.activity.ADD_LAYER', route: { name: 'add-map-layer' } },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'probeAtLocation' }
      ]
    },
    layers: {
      actions: layerActions
    },
    featuresChunkSize: 5000
  },
  archivedEventsActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        history: [
          { component: 'OrganisationMenu', mode: 'run' },
          separator,
          { component: 'PlanMenu' },
          eventsAction(),
          mapAction(),
          topPane.activityStamp('archived-events', 'las la-clipboard-list', 'Context.ARCHIVED_EVENTS'),
          midSeparator,
          { component: 'EventFilter' },
          { id: 'map-view', icon: 'las la-map-marked', tooltip: 'ArchivedEventsActivity.SHOW_MAP_LABEL', handler: 'onShowMap' },
          { id: 'chart-view', icon: 'las la-chart-pie', tooltip: 'ArchivedEventsActivity.SHOW_CHART_LABEL', handler: 'onShowChart' },
          { id: 'export-data', icon: 'las la-file-download', tooltip: 'ArchivedEventsActivity.EXPORT_DATA_LABEL', handler: 'exportEvents' }
        ],
        map: [
          { id: 'history-view', icon: 'las la-arrow-left', tooltip: 'ArchivedEventsActivity.SHOW_HISTORY_LABEL', handler: 'onShowHistory' },
          midSeparator,
          {
            id: 'by-template',
            icon: 'las la-layer-group',
            tooltip: 'ArchivedEventsActivity.SHOW_BY_TEMPLATE_LABEL',
            toggle: { icon: 'las la-object-group', color: 'grey-9', tooltip: 'ArchivedEventsActivity.SHOW_ALL_LABEL' },
            handler: 'onByTemplate'
          },
          {
            id: 'heatmap',
            icon: 'las la-bowling-ball',
            tooltip: 'ArchivedEventsActivity.SHOW_HEATMAP_LABEL',
            toggle: { icon: 'scatter_plot', color: 'grey-9', tooltip: 'ArchivedEventsActivity.SHOW_MARKERS_LABEL' },
            handler: 'onHeatmap'
          },
          { id: 'export-data', icon: 'las la-file-download', tooltip: 'ArchivedEventsActivity.EXPORT_DATA_LABEL', handler: 'exportEvents' }
        ],
        chart: [
          { id: 'history-view', icon: 'las la-arrow-left', tooltip: 'ArchivedEventsActivity.SHOW_HISTORY_LABEL', handler: 'onShowHistory' },
          midSeparator,
          { id: 'settings', icon: 'las la-cog', tooltip: 'ArchivedEventsActivity.CHART_SETTINGS_LABEL', handler: 'showChartSettings' },
          { id: 'export-data', icon: 'las la-file-download', tooltip: 'ArchivedEventsActivity.CHART_EXPORT_LABEL', handler: 'downloadChartData' }
        ]
      },
      mode: 'history'
    },
    rightPane: {
      content: [{
        component: 'KTab',
        content: {
          history: [],
          'user-layers': [
            {
              id: 'user-layers',
              component: 'catalog/KLayersPanel',
              layers: ':layers',
              layerCategories: ':layerCategories',
              layersFilter: { scope: { $in: ['user', 'activity'] } },
              layerCategoriesFilter: { _id: { $exists: true } }
            }
          ],
          'user-views': [
            { id: 'user-views', component: 'catalog/KViewsPanel', suspense: true }
          ],
          'catalog-layers': [
            {
              id: 'catalog-layers',
              component: 'catalog/KLayersPanel',
              layers: ':layers',
              layerCategories: ':layerCategories',
              layersFilter: { scope: { $nin: ['user', 'system', 'activity'] } },
              layerCategoriesFilter: { _id: { $exists: false } },
              forecastModels: ':forecastModels'
            }
          ],
          chart: []
        },
        mode: 'history',
        labels: ['HISTORY', 'LAYERS_LABEL', 'VIEWS_LABEL', 'CATALOG_LABEL', 'CHART'],
        mode: 'history'
      }],
      state: 'responsive'
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
          id: 'view-map',
          tooltip: 'ArchivedEventCard.VIEW_MAP',
          icon: 'las la-map-marked-alt',
          handler: 'followUp',
          visible: { name: '$can', params: ['read', 'archived-events', ':contextId'] },
          scope: 'footer'
        },
        {
          id: 'goto-plan',
          scope: 'plan',
          tooltip: 'ArchivedEventCard.PLAN_ACTION',
          icon: 'las la-arrow-alt-circle-right',
          size: 'sm',
          visible: ['item.plan._id'],
          route: { name: 'archived-events-activity', params: { contextId: ':contextId' }, query: { plan: ':item.plan._id' } }
        },
        {
          id: 'browse-media',
          tooltip: 'ArchivedEventCard.BROWSE_MEDIA',
          icon: 'las la-photo-video',
          handler: 'browseMedia',
          visible: ['hasMedias', { name: '$can', params: ['read', 'archived-events', ':contextId'] }],
          scope: 'footer'
        }
      ]
    },
    layers: {
      actions: layerActions,
      filter: { id: { $in: ['layer-actions', 'zoom-to'] } }
    },
    restore: { view: false, layers: false }
  },
  membersActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          topPane.activityStamp('members', 'las la-user-friends', 'KMembersActivity.MEMBERS_LABEL'),
          tagsAction(),
          groupsAction(),
          eventTemplatesAction(),
          planTemplatesAction(),
          catalogAction(),
          midSeparator,
          { component: 'team/KMemberFilter' },
          {
            component: 'collection/KSorter',
            id: 'member-sorter',
            tooltip: 'KMembersActivity.SORT_MEMBERS',
            options: [
              { icon: 'las la-sort-alpha-down', value: { field: 'profile.name', order: 1 }, default: true },
              { icon: 'las la-sort-alpha-up', value: { field: 'profile.name', order: -1 } }
            ]
          },
          { id: 'search-member', icon: 'las la-search', tooltip: 'KMembersActivity.SEARCH_MEMBERS', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { id: 'export-members', icon: 'las la-download', tooltip: 'KMembersActivity.EXPORT_MEMBERS', handler: 'exportMembers' }
        ],
        filter: contextFilter('profile.name', [
          { service: 'groups', field: 'name', baseQuery: {}, icon: { name: 'las la-sitemap' } },
          { service: 'tags', field: 'value', baseQuery: {}, icon: { name: 'las la-tag' } }
        ])
      },
      mode: 'default'
    },
    fab: {
      content: [{
        id: 'add-member',
        icon: 'las la-plus',
        tooltip: 'KMembersActivity.ADD_USER_LABEL',
        visible: { name: '$can', params: ['update', 'organisations', null, { _id: ':contextId' }] },
        route: { name: 'add-member' }
      }]
    },
    items: {
      actions: [
        {
          id: 'edit-member-role',
          icon: 'las la-graduation-cap',
          tooltip: 'KMemberCard.CHANGE_ROLE_ACTION',
          size: 'sm',
          visible: ['!item.expireAt', { name: '$can', params: ['update', 'members', ':contextId'] }],
          route: { name: 'edit-member-role', params: { contextId: ':contextId', objectId: ':item._id' } },
          scope: 'header'
        },
        {
          id: 'remove-member',
          icon: 'las la-trash',
          tooltip: 'KMemberCard.REMOVE_ACTION',
          size: 'sm',
          visible: ['!item.expireAt', { name: '$can', params: ['remove', 'authorisations', ':contextId', { resource: ':contextId' }] }],
          handler: 'removeMember',
          scope: 'header'
        },
        {
          id: 'add-tag',
          icon: 'las la-plus-circle',
          tooltip: 'KMemberCard.TAG_ACTION',
          size: 'sm',
          visible: 'canEditItem',
          route: { name: 'add-tag', params: { contextId: ':contextId', objectId: ':item._id' } },
          scope: 'tags'
        },
        {
          id: 'join-group',
          icon: 'las la-plus-circle',
          tooltip: 'KMemberCard.JOIN_GROUP_ACTION',
          size: 'sm',
          visible: 'canJoinGroup',
          route: { name: 'join-group', params: { contextId: ':contextId', objectId: ':item._id' } },
          scope: 'groups'
        },
        {
          id: 'reissue-invitation',
          icon: 'las la-envelope',
          tooltip: 'KMemberCard.RESEND_INVITATION_ACTION',
          visible: ['item.expireAt', { name: '$can', params: ['update', 'members', ':contextId'] }],
          handler: 'resendInvitation',
          scope: 'expiration'
        }
      ]
    }
  },
  tagsActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          membersAction(),
          topPane.activityStamp('tags', 'las la-tags', 'KTagsActivity.TAGS_LABEL'),
          groupsAction(),
          eventTemplatesAction(),
          planTemplatesAction(),
          catalogAction(),
          midSeparator,
          {
            component: 'collection/KSorter',
            id: 'tag-sorter',
            tooltip: 'KTagsActivity.SORT_TAGS',
            options: [
              { icon: 'las la-sort-alpha-down', value: { field: 'value', order: 1 }, default: true },
              { icon: 'las la-sort-alpha-up', value: { field: 'value', order: -1 } }
            ]
          },
          { id: 'search-tag', icon: 'las la-search', tooltip: 'KTagsActivity.SEARCH_TAGS', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { id: 'export-tags', icon: 'las la-download', tooltip: 'KTagsActivity.EXPORT_TAGS', handler: 'exportTags' }
        ],
        filter: contextFilter('value')
      },
      mode: 'default'
    },
    fab: {
      content: [{
        id: 'create-tag',
        icon: 'las la-plus',
        tooltip: 'KTagsActivity.CREATE_TAG_LABEL',
        visible: { name: '$can', params: ['create', 'tags', ':contextId'] },
        route: { name: 'create-tag', params: { contextId: ':contextId' } }
      }]
    },
    items: {
      actions: [
        editItemAction('KTagCard.EDIT_ACTION', 'header', 'value,icon'),
        removeItemAction('KTagCard.REMOVE_ACTION', 'header', 'confirm', 'value'),
        editItemAction('KTagCard.EDIT_ACTION', 'description')
      ]
    }
  },
  groupsActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          membersAction(),
          tagsAction(),
          topPane.activityStamp('groups', 'las la-sitemap', 'KGroupsActivity.GROUPS_LABEL'),
          eventTemplatesAction(),
          planTemplatesAction(),
          catalogAction(),
          midSeparator,
          { id: 'group-sorter', component: 'collection/KSorter', tooltip: 'KGroupsActivity.SORT_GROUPS' },
          { id: 'search-group', icon: 'las la-search', tooltip: 'KGroupsActivity.SEARCH_GROUPS', handler: { name: 'setTopPaneMode', params: ['filter'] } },
          { id: 'export-groups', icon: 'las la-download', tooltip: 'KGroupsActivity.EXPORT_GROUPS', handler: 'exportGroups' }
        ],
        filter: contextFilter('name')
      },
      mode: 'default'
    },
    fab: {
      content: [{
        id: 'create-group',
        icon: 'las la-plus',
        tooltip: 'KGroupsActivity.CREATE_GROUP_LABEL',
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
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          membersAction(),
          tagsAction(),
          groupsAction(),
          topPane.activityStamp('event-templates', 'las la-fire', 'EventTemplatesActivity.EVENT_TEMPLATES_LABEL'),
          planTemplatesAction(),
          catalogAction(),
          midSeparator,
          { id: 'event-template-sorter', component: 'collection/KSorter', tooltip: 'EventTemplatesActivity.SORT_EVENT_TEMPLATES' },
          { id: 'search-event-template', icon: 'las la-search', tooltip: 'EventTemplatesActivity.SEARCH_EVENT_TEMPLATES', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        filter: contextFilter('name')
      },
      mode: 'default'
    },
    fab: {
      content: [{
        id: 'create-event-template',
        icon: 'las la-plus',
        tooltip: 'EventTemplatesActivity.CREATE_TEMPLATE_LABEL',
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
          id: 'copy-event-template',
          tooltip: 'EventTemplateCard.COPY_ACTION',
          icon: 'las la-copy',
          visible: { name: '$can', params: ['update', 'event-templates', ':contextId', ':item'] },
          route: { name: 'create-event-template', params: { contextId: ':contextId', templateId: ':item._id' } },
          scope: 'footer'
        }
      ]
    }
  },
  planTemplatesActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { component: 'OrganisationMenu', mode: 'admin' },
          separator,
          membersAction(),
          tagsAction(),
          groupsAction(),
          eventTemplatesAction(),
          topPane.activityStamp('plan-templates', 'las la-stream', 'PlanTemplatesActivity.PLAN_TEMPLATES_LABEL'),
          catalogAction(),
          midSeparator,
          { id: 'event-template-sorter', component: 'collection/KSorter', tooltip: 'EventTemplatesActivity.SORT_EVENT_TEMPLATES' },
          { id: 'search-event-template', icon: 'las la-search', tooltip: 'EventTemplatesActivity.SEARCH_EVENT_TEMPLATES', handler: { name: 'setTopPaneMode', params: ['filter'] } }
        ],
        filter: contextFilter('name')
      },
      mode: 'default'
    },
    fab: {
      content: [{
        id: 'create-plan-template',
        icon: 'las la-plus',
        tooltip: 'PlanTemplatesActivity.CREATE_TEMPLATE_LABEL',
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
          id: 'edit-objectives',
          icon: 'las la-edit',
          tooltip: 'PlanTemplateCard.EDIT_ACTION',
          size: 'sm',
          visible: 'canEditItem',
          handler: 'editObjectives',
          scope: 'objectives'
        },
        editItemAction('PlanTemplateCard.EDIT_ACTION', 'coordinators'),
        editItemAction('EventTemplateCard.EDIT_ACTION', 'permission'),
        {
          id: 'copy-plan-template',
          tooltip: 'PlanTemplateCard.COPY_ACTION',
          icon: 'las la-copy',
          visible: { name: '$can', params: ['update', 'plan-templates', ':contextId', ':item'] },
          route: { name: 'create-plan-template', params: { contextId: ':contextId', templateId: ':item._id' } },
          scope: 'footer'
        }
      ]
    }
  },
  eventActivity: {
    leftPane: LEFT_PANE,
    topPane: {
      content: {
        default: [
          { id: 'back', icon: 'las la-arrow-left', handler: 'goBack' },
          separator,
          topPane.locateUser(),
          topPane.activeLocationSearchMode(),
          {
            id: 'tools',
            component: 'menu/KMenu',
            icon: 'las la-wrench',
            tooltip: 'mixins.activity.TOOLS',
            actionRenderer: 'item',
            content: [
              topPane.activeMeasureToolMode(),
              { id: 'display-position', icon: 'las la-plus', label: 'mixins.activity.DISPLAY_POSITION', handler: { name: 'setTopPaneMode', params: ['display-position'] } },
              { id: 'display-legend', icon: 'las la-list', label: 'mixins.activity.DISPLAY_LEGEND', handler: { name: 'openWidget', params: ['legend-widget'] } }
            ]
          },
          {
            ...topPane.toggleFullscreen(),
            visible: '$q.screen.gt.md'
          },
          helpers.verticalSeparator()
        ],
        'display-position': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          helpers.verticalSeparator(),
          { component: 'KPositionIndicator' }
        ],
        'search-location': [
          { id: 'back', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          helpers.verticalSeparator(),
          { component: 'tools/KSearchTool', geocoders: null }
        ],
        'measure-tool': [
          { id: 'accept', icon: 'las la-arrow-left', handler: { name: 'setTopPaneMode', params: ['default'] } },
          helpers.verticalSeparator(),
          { component: 'KMeasureTool' }
        ]
      },
      mode: 'default'
    },
    rightPane: {
      content: [{
        component: 'KTab',
        content: {
          'event-participants': [
            { id: 'event-participants', component: 'EventActivityPanel', event: ':event', participants: ':participants' }
          ],
          'user-layers': [
            {
              id: 'user-layers',
              component: 'catalog/KLayersPanel',
              layers: ':layers',
              layerCategories: ':layerCategories',
              layersFilter: { scope: { $in: ['user', 'activity'] } },
              layerCategoriesFilter: { _id: { $exists: true } }
            }
          ],
          'user-views': [
            { id: 'user-views', component: 'catalog/KViewsPanel', suspense: true }
          ],
          'catalog-layers': [
            {
              id: 'catalog-layers',
              component: 'catalog/KLayersPanel',
              layers: ':layers',
              layerCategories: ':layerCategories',
              layersFilter: { scope: { $nin: ['user', 'system', 'activity'] } },
              layerCategoriesFilter: { _id: { $exists: false } },
              forecastModels: ':forecastModels'
            }
          ],
          mode: 'event-participants'
        },
        labels: ['EventActivityPanel.PARTICIPANTS_LABEL', 'LAYERS_LABEL', 'VIEWS_LABEL', 'CATALOG_LABEL']
      }],
      state: 'responsive'
    },
    bottomPane: {
      content: [
        { component: 'time/KTimeControl' }
      ]
    },
    page: {
      content: []
    },
    windows: {
      left: { content: leftWidgets },
      top: { content: topWidgets }
    },
    fab: {
      content: [
        {
          id: 'browse-media',
          label: 'EventActivity.BROWSE_MEDIA_LABEL',
          icon: 'las la-photo-video',
          handler: 'browseMedia',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] }
        },
        {
          id: 'edit-event',
          label: 'EventActivity.EDIT_LABEL',
          icon: 'las la-edit',
          visible: { name: '$can', params: ['update', 'events', ':contextId', ':event'] },
          route: { name: 'edit-map-event', params: { contextId: ':contextId', objectId: ':objectId' } }
        },
        { id: 'probe-location', icon: 'las la-eye-dropper', label: 'mixins.activity.PROBE', handler: 'probeAtLocation' }
      ]
    },
    layers: {
      actions: layerActions,
      filter: { id: { $in: ['layer-actions', 'zoom-to'] } }
    },
    restore: { view: false, layers: false },
    featuresChunkSize: 5000
  },

  routes: require('../src/router/routes')
}
