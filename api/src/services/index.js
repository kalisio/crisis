import path from 'path'
import _ from 'lodash'
import logger from 'winston'
import kCore from '@kalisio/kdk-core'
import kTeam from '@kalisio/kdk-team'
import kMap, { createCatalogService } from '@kalisio/kdk-map'
import kNotify from '@kalisio/kdk-notify'
import kBilling from '@kalisio/kdk-billing'
import kEvent, { hooks as eventHooks } from '@kalisio/kdk-event'
import packageInfo from '../../package.json'

const servicesPath = path.join(__dirname, '..', 'services')

module.exports = async function () {
  const app = this

  // Set up our plugin services
  try {
    app.use(app.get('apiPath') + '/capabilities', (req, res, next) => {
      let response = {
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
    await app.configure(kCore)
    // Add hook to automatically create a new organisation, add verification, send verification email,
    // register devices, etc. when creating a new user or authenticating
    app.configureService('users', app.getService('users'), servicesPath)
    app.configureService('authentication', app.getService('authentication'), servicesPath)
    // Add hooks for topic (un)subscription on (un)authorisation
    app.configureService('authorisations', app.getService('authorisations'), servicesPath)

    // Add hooks for topic creation/removal on org/group/tag object creation/removal,
    // event notifications on attachment upload, etc.
    app.on('service', service => {
      if (service.name === 'groups' ||
          service.name === 'members' ||
          service.name === 'tags' ||
          service.name === 'storage' ||
          service.name === 'events' ||
          service.name === 'event-templates') {
        app.configureService(service.name, service, servicesPath)
      }
    })
    await app.configure(kTeam)
    app.configureService('organisations', app.getService('organisations'), servicesPath)
    // Replication management
    let orgsService = app.getService('organisations')
    let usersService = app.getService('users')
    let authorisationsService = app.getService('authorisations')
    // Ensure permissions are correctly distributed when replicated
    usersService.on('patched', user => {
      // Patching profile should not trigger abilities update since
      // it is a perspective and permissions are not available in this case
      if (user.organisations || user.groups) authorisationsService.updateAbilities(user)
    })
    // Ensure org services are correctly distributed when replicated
    orgsService.on('created', organisation => {
      // Check if already done (initiator)
      const orgMembersService = app.getService('members', organisation)
      if (!orgMembersService) {
        // Jump from infos/stats to real DB object
        const db = app.db.instance.db(organisation._id.toString())
        orgsService.createOrganisationServices(organisation, db)
        // We fake a hook call
        eventHooks.createOrganisationServices({ app, result: organisation })
      }
    })
    orgsService.on('removed', organisation => {
      // Check if already done (initiator)
      const orgMembersService = app.getService('members', organisation)
      if (orgMembersService) return
      eventHooks.removeOrganisationServices({ app, result: organisation })
      orgsService.removeOrganisationServices(organisation)
    })

    await app.configure(kNotify)
    app.configureService('devices', app.getService('devices'), servicesPath)
    await app.configure(kMap)
    // Create a global catalog service 
    createCatalogService.call(app)
    await app.configure(kBilling)
    app.configureService('billing', app.getService('billing'), servicesPath)
    await app.configure(kEvent)
  } catch (error) {
    logger.error(error.message)
  }

  let usersService = app.getService('users')
  let pusherService = app.getService('pusher')
  let defaultUsers = app.get('authentication').defaultUsers
  // Do not use exposed passwords on staging/prod environments
  if (defaultUsers && !process.env.NODE_APP_INSTANCE) {
    // Create default users if not already done
    const users = await usersService.find({ paginate: false })
    for (let i = 0; i < defaultUsers.length; i++) {
      const defaultUser = defaultUsers[i]
      let createdUser = _.find(users, user => user.email === defaultUser.email)
      if (!createdUser) {
        logger.info('Initializing default user (email = ' + defaultUser.email + ', password = ' + defaultUser.password + ')')
        let user = await usersService.create(_.omit(defaultUser, 'device'))
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

  let catalogService = app.getService('catalog')
  const catalog = app.get('catalog')

  let defaultLayers = catalog ? catalog.layers || [] : []
  const layers = await catalogService.find({ query: { type: 'layer' }, paginate: false })
  for (let i = 0; i < defaultLayers.length; i++) {
    const defaultLayer = defaultLayers[i]
    let createdLayer = _.find(layers, { name: defaultLayer.name })
    if (!createdLayer) {
      logger.info('Adding default layer (name = ' + defaultLayer.name + ')')
      await catalogService.create(defaultLayer)
    } else {
      logger.info('Reusing default layer (name = ' + defaultLayer.name + ')')
    }
  }
}
