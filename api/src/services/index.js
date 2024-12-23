import path from 'path'
import _ from 'lodash'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import moment from 'moment'
import pointOnFeature from '@turf/point-on-feature'
import makeDebug from 'debug'
import kCore, { createObjectID, permissions, decorateDistributedService } from '@kalisio/kdk/core.api.js'
import kMap, {
  createFeaturesService, removeFeaturesService,
  createCatalogService, removeCatalogService,
  createAlertsService, removeAlertsService
} from '@kalisio/kdk/map.api.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')
const debug = makeDebug('crisis:services')

export async function createEventService (options = {}) {
  const app = this

  debug('Creating events service with options', options)
  await app.createService('events', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 20, max: 5000 }
  }, options))
}

export function removeEventService (options = {}) {
  const app = this
  return app.removeService(app.getService('events', options.context))
}

export async function createEventTemplateService (options = {}) {
  const app = this

  debug('Creating event templates service with options', options)
  await app.createService('event-templates', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removeEventTemplateService (options = {}) {
  const app = this
  return app.removeService(app.getService('event-templates', options.context))
}

export async function createEventLogService (options = {}) {
  const app = this

  debug('Creating event logs service with options', options)
  await app.createService('event-logs', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 1000, max: 5000 }
  }, options))
}

export function removeEventLogService (options = {}) {
  const app = this
  return app.removeService(app.getService('event-logs', options.context))
}

export async function createArchivedEventService (options = {}) {
  const app = this

  debug('Creating archived events service with options', options)
  await app.createService('archived-events', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 20, max: 5000 }
  }, options))
}

export function removeArchivedEventService (options = {}) {
  const app = this
  return app.removeService(app.getService('archived-events', options.context))
}

export async function createArchivedEventLogService (options = {}) {
  const app = this

  debug('Creating archived event logs service with options', options)
  await app.createService('archived-event-logs', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 1000, max: 5000 }
  }, options))
}

export function removeArchivedEventLogService (options = {}) {
  const app = this
  return app.removeService(app.getService('archived-event-logs', options.context))
}

export async function createPlanTemplateService (options = {}) {
  const app = this

  debug('Creating plan templates service with options', options)
  await app.createService('plan-templates', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removePlanTemplateService (options = {}) {
  const app = this
  return app.removeService(app.getService('plan-templates', options.context))
}

export async function createPlanService (options = {}) {
  const app = this

  debug('Creating plans service with options', options)
  await app.createService('plans', Object.assign({
    servicesPath,
    modelsPath
  }, options))
}

export function removePlanService (options = {}) {
  const app = this
  return app.removeService(app.getService('plans', options.context))
}

export async function createArchivedPlanService (options = {}) {
  const app = this

  debug('Creating archived plans service with options', options)
  await app.createService('archived-plans', Object.assign({
    servicesPath,
    modelsPath,
    paginate: { default: 20, max: 5000 }
  }, options))
}

export function removeArchivedPlanService (options = {}) {
  const app = this
  return app.removeService(app.getService('archived-plans', options.context))
}

export async function createOrganisationServices (organisation, db) {
  const app = this
  await createCatalogService.call(app, { context: organisation, db })
  await createFeaturesService.call(app, { collection: 'features', context: organisation, db })
  await createAlertsService.call(app, { context: organisation, db })
  await createEventService.call(app, { context: organisation, db })
  await createEventTemplateService.call(app, { context: organisation, db })
  await createEventLogService.call(app, { context: organisation, db })
  await createArchivedEventService.call(app, { context: organisation, db })
  await createArchivedEventLogService.call(app, { context: organisation, db })
  await createPlanTemplateService.call(app, { context: organisation, db })
  await createPlanService.call(app, { context: organisation, db })
  await createArchivedPlanService.call(app, { context: organisation, db })
}

export async function removeOrganisationServices (organisation) {
  const app = this
  await removeFeaturesService.call(app, { collection: 'features', context: organisation })
  await removeCatalogService.call(app, { context: organisation })
  await removeAlertsService.call(app, { context: organisation })
  await removeEventService.call(app, { context: organisation })
  await removeEventTemplateService.call(app, { context: organisation })
  await removeEventLogService.call(app, { context: organisation })
  await removeArchivedEventService.call(app, { context: organisation })
  await removeArchivedEventLogService.call(app, { context: organisation })
  await removePlanTemplateService.call(app, { context: organisation })
  await removePlanService.call(app, { context: organisation })
  await removeArchivedPlanService.call(app, { context: organisation })
}

async function isOrganisationInactive (organisation, db, duration) {
  // Organisations created before duration from now could be tagged as inactive
  // Depending on the duration format we might have negative or positive values
  const inactiveDate = (duration.asMilliseconds() > 0 ? moment.utc().subtract(duration) : moment.utc().add(duration))
  // Get creation date
  const creationDate = moment.utc(organisation._id.getTimestamp())
  if (creationDate.isAfter(inactiveDate)) return false
  // Get stats
  const infos = await db.stats()
  // Is empty ?
  return (infos.objects === 0)
}

export async function checkInactiveOrganisations (app) {
  let duration = _.get(app.get('organisations'), 'inactivityDuration')
  if (!duration) return
  duration = moment.duration(duration)
  if (!moment.isDuration(duration)) return
  const orgsService = app.getService('organisations')
  const usersService = app.getService('users')
  debug('Checking for inactive organisations with the following duration:', duration.humanize())
  const organisations = await orgsService.find({ paginate: false })
  for (let i = 0; i < organisations.length; i++) {
    const organisation = organisations[i]
    // Get org DB
    const db = app.db.client.db(organisation._id.toString())
    // Check if active
    const isInactive = await isOrganisationInactive(organisation, db, duration)
    if (isInactive) {
      // Find owner if any
      const owners = await usersService.find({
        query: {
          'organisations._id': organisation._id,
          'organisations.permissions': 'owner'
        }
      })
      const owner = _.get(owners, 'data[0]')
      // Remove inactive organisation anyway in case of orphan organisation
      debug('Removing inactive organisations with ID ', organisation._id)
      if (owner) debug('Using owner with ID ', owner._id)
      await orgsService.remove(organisation._id.toString(), { user: owner })
    }
  }
}

export function processAlert (organisation) {
  return async function (alert) {
    const app = this
    const isActive = _.get(alert, 'status.active')
    const checkedAt = moment.utc(_.get(alert, 'status.checkedAt'))
    const triggeredAt = moment.utc(_.get(alert, 'status.triggeredAt'))
    const templateId = _.get(alert, 'eventTemplate._id')
    const closeEvent = _.get(alert, 'closeEvent')
    const eventsService = app.getService('events', organisation)
    // check for existing event linked to alert
    const results = await eventsService.find({
      query: { 'alert._id': createObjectID(alert._id) },
      $limit: 1,
      paginate: false
    })
    const previousEvent = (results.length > 0 ? results[0] : null)
    // Create on first activation
    if (isActive && templateId && checkedAt.isSame(triggeredAt)) {
      const eventTemplatesService = app.getService('event-templates', organisation)
      // Get template to be used, which will become the new event
      const template = await eventTemplatesService.get(templateId)
      // Remove id so that event has its own
      const event = _.omit(template, ['_id'])
      // Keep track of template based on its name for statistics
      // We don't keep ref/link for simplicity and making archived events will be self-consistent
      // No need to keep track of templates that have been removed, etc.
      event.template = template.name
      const type = _.get(alert, 'geometry.type', 'Point')
      const coordinates = (type === 'Point'
        ? _.get(alert, 'geometry.coordinates')
        : _.get(pointOnFeature(alert), 'geometry.coordinates'))
      _.set(event, 'location.longitude', coordinates[0])
      _.set(event, 'location.latitude', coordinates[1])
      // Remove unrelevant properties from alert
      _.set(event, 'alert', _.omit(alert, ['eventTemplate', 'closeEvent']))
      if (!previousEvent) {
        debug('Creating event for alert', alert)
        try {
          const params = {}
          if (_.has(alert, 'notification.create')) {
            params.notification = {
              body: _.get(alert, 'notification.create'),
              // Setup notification redirection url
              url: `${app.get('domain')}/#/home/${eventsService.getContextId()}/events`
            }
          }
          await eventsService.create(event, params)
        } catch (error) {
          // This could be possible if we have replication and multiple instances check alert simultaneously
          if (_.get(error, 'data.code' === 11000)) {
            debug('Skipping creating event for alert as it does already exist', alert)
          } else {
            app.logger.error(error.message)
          }
        }
      } else {
        debug('Skipping creating event for alert as it does already exist', alert)
        // This should not be possible except if we have replication and multiple instances check alert simultaneously
        // But in this case we don't really need to update the event as all checks would have the same result
        // await eventsService.patch(previousEvent._id.toString(), event)
      }
    }
    // Remove on deactivation if required
    if (!isActive && previousEvent && closeEvent) {
      debug(`Removing event ${previousEvent._id.toString()} for alert`, alert)
      try {
        const params = {}
        if (_.has(alert, 'notification.remove')) {
          params.notification = {
            body: _.get(alert, 'notification.remove'),
            // Setup notification redirection url
            url: `${app.get('domain')}/#/home/${eventsService.getContextId()}/events`
          }
        }
        await eventsService.remove(previousEvent._id.toString(), params)
      } catch (error) {
        // This could be possible if we have replication and multiple instances check alert simultaneously
        if (error.code === 404) {
          debug('Skipping removing event for alert as it does not exist anymore', alert)
        } else {
          app.logger.error(error.message)
        }
      }
    }
  }
}

export function removeAlert (organisation) {
  return async function (alert) {
    const app = this
    const alertsService = app.getService('alerts', organisation)
    alertsService.unregisterAlert(alert)
  }
}

export default async function () {
  const app = this

  // Set up our plugin services
  try {
    const packageInfo = fs.readJsonSync(path.join(__dirname, '../../package.json'))
    app.use(app.get('apiPath') + '/capabilities', (req, res, next) => {
      const response = {
        name: 'crisis',
        domain: app.get('domain'),
        gateway: app.get('gateway'),
        version: packageInfo.version,
        quotas: app.get('quotas'),
        mapillary: app.get('mapillary'),
        vapidPublicKey: app.get('push').vapidDetails.publicKey
      }
      if (process.env.BUILD_NUMBER) {
        response.buildNumber = process.env.BUILD_NUMBER
      }
      res.json(response)
    })
    app.on('service', async service => {
      // Add app-specific hooks to required services initialized externally
      if (service.name === 'users' ||
          service.name === 'authorisations' ||
          service.name === 'organisations' ||
          service.name === 'storage' ||
          service.name === 'groups' ||
          service.name === 'members' ||
          service.name === 'tags' ||
          service.name === 'features' ||
          service.name === 'alerts') {
        await app.configureService(service.name, service, servicesPath)
        if (service.name === 'alerts') {
          // Create related event whenever an alert is activated
          service.on('patched', processAlert(service.getContextId()).bind(app))
          // Remove related cron-based task whenever an alert is removed
          service.on('removed', removeAlert(service.getContextId()).bind(app))
        }
      }
      // Make remote services compliant with our internal app services so that permissions can be used
      if (service.key === 'kano' || service.key === 'weacast') {
        debug('Configuring remote service', service)
        decorateDistributedService.call(app, service)
        // Register default permissions for it
        debug('Registering permissions for remote service ', service.name)
        permissions.defineAbilities.registerHook((subject, can, cannot) => {
          can('service', service.name)
          can('read', service.name)
          if (service.name === 'probes') can('create', service.name)
        })
        // We then need to update abilities cache
        const authorisationService = app.getService('authorisations')
        if (authorisationService) authorisationService.clearAbilities()
      }
    })
    await app.configure(kCore)
    // This one is created by feathers under the hood so we cannot configure using the previous event listener,
    // which will only emit our own services
    await app.configureService('authentication', app.getService('authentication'), servicesPath)
    await app.configure(kMap)

    const orgsService = app.getService('organisations')
    // Register services hook for organisations
    orgsService.registerOrganisationServicesHook({
      createOrganisationServices, removeOrganisationServices
    })
    // Reinstanciated app services for all existing organisations
    await orgsService.configureOrganisations()
  } catch (error) {
    app.logger.error(error.message)
  }

  const usersService = app.getService('users')
  const defaultUsers = app.get('authentication').defaultUsers
  // Do not use exposed passwords on staging/prod environments
  if (defaultUsers && !process.env.NODE_APP_INSTANCE) {
    // Create default users if not already done
    const users = await usersService.find({ paginate: false })
    for (let i = 0; i < defaultUsers.length; i++) {
      const defaultUser = defaultUsers[i]
      const createdUser = _.find(users, user => user.email === defaultUser.email)
      if (!createdUser) {
        app.logger.info('Initializing default user (email = ' + defaultUser.email + ')')
        await usersService.create(_.omit(defaultUser, 'device'))
      }
    }
  }
}
