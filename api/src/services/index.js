import path from 'path'
import _ from 'lodash'
//import makeDebug from 'debug'
import kCore from '@kalisio/kdk-core'
import kTeam from '@kalisio/kdk-team'
import kMap, {
  createFeaturesService, removeFeaturesService,
  createCatalogService, removeCatalogService,
  createAlertsService, removeAlertsService
} from '@kalisio/kdk-map'
import kNotify from '@kalisio/kdk-notify'
import kBilling from '@kalisio/kdk-billing'
//import kEvent, { hooks as eventHooks } from '@kalisio/kdk-event'
import kEvent from '@kalisio/kdk-event'
import packageInfo from '../../package.json'

//const debug = makeDebug('kalisio:aktnmap:hooks')
//const modelsPath = path.join(__dirname, '..', 'models')
const servicesPath = path.join(__dirname, '..', 'services')

export function createOrganisationServices (organisation, db) {
  const app = this
  createCatalogService.call(app, { context: organisation, db })
  createFeaturesService.call(app, { collection: 'features', context: organisation, db })
  createAlertsService.call(app, { context: organisation, db })
}

export function removeOrganisationServices (organisation) {
  const app = this
  removeFeaturesService.call(app, { collection: 'features', context: organisation })
  removeCatalogService.call(app, { context: organisation })
  removeAlertsService.call(app, { context: organisation })
}

module.exports = async function () {
  const app = this

  // Set up our plugin services
  try {
    app.use(app.get('apiPath') + '/capabilities', (req, res, next) => {
      const response = {
        name: 'aktnmap',
        domain: app.get('domain'),
        version: packageInfo.version,
        plans: _.get(app.get('billing'), 'plans'),
        quotas: app.get('quotas')
      }
      if (process.env.BUILD_NUMBER) {
        response.buildNumber = process.env.BUILD_NUMBER
      }
      res.json(response)
    })
    // Add app-specific hooks to required services
    app.on('service', service => {
      if (service.name === 'users' ||
          service.name === 'authentication' ||
          service.name === 'authorisations' ||
          service.name === 'organisations' ||
          service.name === 'groups' ||
          service.name === 'members' ||
          service.name === 'tags' ||
          service.name === 'storage' ||
          service.name === 'devices' ||
          service.name === 'features' ||
          service.name === 'alerts' ||
          service.name === 'billing' ||
          service.name === 'events' ||
          service.name === 'event-templates') {
        app.configureService(service.name, service, servicesPath)
        if (service.name === 'alerts') {
          // Create related event whenever an alert is activated
          service.on('patched', async alert => {
            const isActive = _.get(alert, 'status.active')
            const checkedAt = _.get(alert, 'status.checkedAt')
            const triggeredAt = _.get(alert, 'status.triggeredAt')
            const label = _.get(alert, 'featureLabel', _.get(alert, 'feature'))
            const templateId = _.get(alert, 'eventTemplate._id')
            // Only on first activation
            if (isActive && templateId && (checkedAt === triggeredAt)) {
              const eventTemplatesService = app.getService('event-templates', service.getContextId())
              // Get template to be used, which will become the new event
              const template = await eventTemplatesService.get(templateId)
              // Remove id so that event has its own
              let event = _.omit(template, ['_id'])
              // Keep track of template based on its name for statistics
              // We don't keep ref/link for simplicity and making archived events will be self-consistent
              // No need to keep track of templates that have been removed, etc.
              event.template = template.name
              _.set(event, 'location.name', label ? `${alert.layer} - ${label}` : `${alert.layer}`)
              _.set(event, 'location.longitude', _.get(alert, 'geometry.coordinates[0]'))
              _.set(event, 'location.latitude', _.get(alert, 'geometry.coordinates[1]'))
              const eventsService = app.getService('events', service.getContextId())
              await eventsService.create(event)
            }
          })
        }
      }
    })
    await app.configure(kCore)
    await app.configure(kTeam)
    await app.configure(kNotify)
    await app.configure(kMap)
    await app.configure(kBilling)
    await app.configure(kEvent)

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
