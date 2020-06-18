import path from 'path'
import _ from 'lodash'
import makeDebug from 'debug'
import kCore from '@kalisio/kdk/core.api'
import kMap, {
  createFeaturesService, removeFeaturesService,
  createCatalogService, removeCatalogService,
  createAlertsService, removeAlertsService
} from '@kalisio/kdk/map.api'
import packageInfo from '../../package.json'

const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')
const debug = makeDebug('aktnmap:services')

export function createEventService (options = {}) {
  const app = this

  debug('Creating events service with options', options)
  app.createService('events', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removeEventService (options) {
  // TODO
}

export function createEventTemplateService (options = {}) {
  const app = this

  debug('Creating event templates service with options', options)
  app.createService('event-templates', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removeEventTemplateService (options) {
  // TODO
}

export function createEventLogService (options = {}) {
  const app = this

  debug('Creating event logs service with options', options)
  app.createService('event-logs', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 500, max: 500 }
  }, options))
}

export function removeEventLogService (options) {
  // TODO
}

export function createArchivedEventService (options = {}) {
  const app = this

  debug('Creating archived events service with options', options)
  app.createService('archived-events', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 20, max: 5000 }
  }, options))
}

export function removeArchivedEventService (options) {
  // TODO
}

export function createArchivedEventLogService (options = {}) {
  const app = this

  debug('Creating archived event logs service with options', options)
  app.createService('archived-event-logs', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 500, max: 500 }
  }, options))
}

export function removeArchivedEventLogService (options) {
  // TODO
}

export function createOrganisationServices (organisation, db) {
  const app = this
  createCatalogService.call(app, { context: organisation, db })
  createFeaturesService.call(app, { collection: 'features', context: organisation, db })
  createAlertsService.call(app, { context: organisation, db })
  createEventService.call(app, { context: organisation, db })
  createEventTemplateService.call(app, { context: organisation, db })
  createEventLogService.call(app, { context: organisation, db })
  createArchivedEventService.call(app, { context: organisation, db })
  createArchivedEventLogService.call(app, { context: organisation, db })
}

export function removeOrganisationServices (organisation) {
  const app = this
  removeFeaturesService.call(app, { collection: 'features', context: organisation })
  removeCatalogService.call(app, { context: organisation })
  removeAlertsService.call(app, { context: organisation })
  removeEventService.call(app, { context: organisation })
  removeEventTemplateService.call(app, { context: organisation })
  removeEventLogService.call(app, { context: organisation })
  removeArchivedEventService.call(app, { context: organisation })
  removeArchivedEventLogService.call(app, { context: organisation })
}

export function createEventOnAlert (organisation) {
  return async function (alert) {
    const app = this
    const isActive = _.get(alert, 'status.active')
    const checkedAt = _.get(alert, 'status.checkedAt')
    const triggeredAt = _.get(alert, 'status.triggeredAt')
    const label = _.get(alert, 'featureLabel', _.get(alert, 'feature'))
    const templateId = _.get(alert, 'eventTemplate._id')
    // Only on first activation
    if (isActive && templateId && (checkedAt === triggeredAt)) {
      const eventTemplatesService = app.getService('event-templates', organisation)
      // Get template to be used, which will become the new event
      const template = await eventTemplatesService.get(templateId)
      // Remove id so that event has its own
      const event = _.omit(template, ['_id'])
      // Keep track of template based on its name for statistics
      // We don't keep ref/link for simplicity and making archived events will be self-consistent
      // No need to keep track of templates that have been removed, etc.
      event.template = template.name
      _.set(event, 'location.name', label ? `${alert.layer} - ${label}` : `${alert.layer}`)
      _.set(event, 'location.longitude', _.get(alert, 'geometry.coordinates[0]'))
      _.set(event, 'location.latitude', _.get(alert, 'geometry.coordinates[1]'))
      const eventsService = app.getService('events', organisation)
      await eventsService.create(event)
    }
  }
}

export function setupArchiveListeners (service) {
  const app = this
  service.on('created', async object => {
    try {
      app.getService(`archived-${service.name}`, service.context).create(object)
    } catch (error) { app.logger.error(error.message) }
  })
  service.on('updated', async object => {
    try {
      app.getService(`archived-${service.name}`, service.context).update(object._id, object)
    } catch (error) { app.logger.error(error.message) }
  })
  service.on('patched', async object => {
    try {
      app.getService(`archived-${service.name}`, service.context).update(object._id, object)
    } catch (error) { app.logger.error(error.message) }
  })
  service.on('deleted', async object => {
    try {
      app.getService(`archived-${service.name}`, service.context).patch(object._id, { deletedAt: new Date() })
    } catch (error) { app.logger.error(error.message) }
  })
}

export default async function () {
  const app = this

  // Set up our plugin services
  try {
    app.use(app.get('apiPath') + '/capabilities', (req, res, next) => {
      const response = {
        name: 'aktnmap',
        domain: app.get('domain'),
        version: packageInfo.version,
        plans: _.get(app.get('billing'), 'plans'),
        options: _.get(app.get('billing'), 'options'),
        quotas: app.get('quotas'),
        mapillary: app.get('mapillary')
      }
      if (process.env.BUILD_NUMBER) {
        response.buildNumber = process.env.BUILD_NUMBER
      }
      res.json(response)
    })
    app.on('service', service => {
      // Add app-specific hooks to required services initialized externally
      if (service.name === 'users' ||
          service.name === 'authorisations' ||
          service.name === 'organisations' ||
          service.name === 'groups' ||
          service.name === 'members' ||
          service.name === 'tags' ||
          service.name === 'storage' ||
          service.name === 'devices' ||
          service.name === 'features' ||
          service.name === 'alerts') {
        app.configureService(service.name, service, servicesPath)
        if (service.name === 'alerts') {
          // Create related event whenever an alert is activated
          service.on('patched', createEventOnAlert(service.getContextId()).bind(app))
        }
      }
      // Add event/logs archiving feature
      if ((service.name === 'events') || (service.name === 'event-logs')) {
        // This is only in dev/preprod mode, in prod this feature is managed by MongoDB Stitch
        if (process.env.NODE_APP_INSTANCE !== 'prod') {
          setupArchiveListeners.call(app, service)
        }
      }
    })
    await app.configure(kCore)
    // This one is created by feathers under the hood so we cannot configure using the previous event listener,
    // which will only emit our own services
    app.configureService('authentication', app.getService('authentication'), servicesPath)
    await app.configure(kMap)
    app.createService('billing', { servicesPath })

    const orgsService = app.getService('organisations')
    // Register services hook for organisations
    orgsService.registerOrganisationServicesHook({
      createOrganisationServices, removeOrganisationServices
    })
    // Reinstanciated app services for all axisting organisations
    await orgsService.configureOrganisations()
  } catch (error) {
    app.logger.error(error.message)
  }

  const usersService = app.getService('users')
  const pusherService = app.getService('pusher')
  const defaultUsers = app.get('authentication').defaultUsers
  // Do not use exposed passwords on staging/prod environments
  if (defaultUsers && !process.env.NODE_APP_INSTANCE) {
    // Create default users if not already done
    const users = await usersService.find({ paginate: false })
    for (let i = 0; i < defaultUsers.length; i++) {
      const defaultUser = defaultUsers[i]
      const createdUser = _.find(users, user => user.email === defaultUser.email)
      if (!createdUser) {
        app.logger.info('Initializing default user (email = ' + defaultUser.email + ', password = ' + defaultUser.password + ')')
        const user = await usersService.create(_.omit(defaultUser, 'device'))
        // Register user device if any
        if (defaultUser.device) {
          await pusherService.create({
            action: 'device',
            device: defaultUser.device
          }, {
            user
          })
        }
      }
    }
  }
}
