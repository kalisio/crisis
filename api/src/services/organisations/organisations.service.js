import path, { dirname } from 'path'
import makeDebug from 'debug'
import {
  createConfigurationsService, removeConfigurationsService, createDefaultConfigurations,
  createStorageService, removeStorageService
} from '@kalisio/kdk/core.api.js'
import {
  createStylesService, removeStylesService,
  createProjectsService, removeProjectsService,
  createFeaturesService, removeFeaturesService,
  createCatalogService, removeCatalogService,
  createAlertsService, removeAlertsService
} from '@kalisio/kdk/map.api.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const servicesPath = path.join(__dirname, '..', '..', 'services')
const modelsPath = path.join(__dirname, '..', '..', 'models')

const debug = makeDebug('organisations:service')

export default async function (name, app, options) {

  return {

    async createOrganisationServices (organisation, db) {
      await this.app.createService('members', {
        servicesPath,
        context: organisation,
        proxy: {
          service: this.app.getService('users'),
          params: { query: { 'organisations._id': organisation._id } }
        }
      })
      debug('Members service created for organisation ' + organisation.name)
      await this.app.createService('groups', {
        modelsPath,
        servicesPath,
        context: organisation,
        db
      })
      debug('Groups service created for organisation ' + organisation.name)
      await this.app.createService('tags', {
        modelsPath,
        servicesPath,
        context: organisation,
        db
      })
      debug('Tags service created for organisation ' + organisation.name)
      await createConfigurationsService.call(this.app, { context: organisation, db })
      await createDefaultConfigurations.call(this.app, organisation)
      debug('Configurations service created for organisation ' + organisation.name)
      await createStorageService.call(this.app, { context: organisation })
      debug('Storage service created for organisation ' + organisation.name)
      await createCatalogService.call(this.app, { context: organisation, db })
      debug('Catalog service created for organisation ' + organisation.name)
      await createFeaturesService.call(this.app, { collection: 'features', context: organisation, db })
      debug('Features service created for organisation ' + organisation.name)
      await createProjectsService.call(this.app, { context: organisation, db })
      debug('Projects service created for organisation ' + organisation.name)
      await createStylesService.call(this.app, { context: organisation, db })
      debug('Styles service created for organisation ' + organisation.name)
      await createAlertsService.call(this.app, { context: organisation, db })
      debug('Alerts service created for organisation ' + organisation.name)
      await this.app.createService('events', {
        modelsPath,
        servicesPath,
        context: organisation,
        paginate: { default: 20, max: 5000 },
        db
      })
      debug('Events service created for organisation ' + organisation.name)
      await this.app.createService('event-templates', {
        modelsPath,
        servicesPath,
        context: organisation,
        db
      })
      debug('Events templates service created for organisation ' + organisation.name)
      await this.app.createService('event-logs', {
        modelsPath,
        servicesPath,
        context: organisation,
        paginate: { default: 1000, max: 5000 },
        db
      })
      debug('Events logs service created for organisation ' + organisation.name)
      await this.app.createService('archived-events', {
        modelsPath,
        servicesPath,
        context: organisation,
        paginate: { default: 20, max: 5000 },
        db
      })
      debug('Archived events service created for organisation ' + organisation.name)
      await this.app.createService('archived-event-logs', {
        modelsPath,
        servicesPath,
        context: organisation,
        paginate: { default: 1000, max: 5000 },
        db
      })
      debug('Archived events logs service created for organisation ' + organisation.name)
      await this.app.createService('plan-templates', {
        modelsPath,
        servicesPath,
        context: organisation,
        db
      })
      debug('Plan templates service created for organisation ' + organisation.name)
      await this.app.createService('plans', {
        modelsPath,
        servicesPath,
        context: organisation,
        db
      })
      debug('Plans service created for organisation ' + organisation.name)
      await this.app.createService('archived-plans', {
        modelsPath,
        servicesPath,
        context: organisation,
        paginate: { default: 20, max: 5000 },
        db
      })
      debug('Archived plans service created for organisation ' + organisation.name)
    },

    async removeOrganisationServices (organisation) {
      await removeConfigurationsService.call(this.app, { context: organisation })
      debug('Configurations service removed for organisation ' + organisation.name)
      await removeStorageService.call(this.app, { context: organisation })
      debug('Storage service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('tags', organisation))
      debug('Tags service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('groups', organisation))
      debug('Groups service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('members', organisation))
      debug('Members service removed for organisation ' + organisation.name)
      await removeStylesService.call(this.app, { context: organisation })
      debug('Styles service removed for organisation ' + organisation.name)
      await removeProjectsService.call(this.app, { context: organisation })
      debug('Projects service removed for organisation ' + organisation.name)
      await removeFeaturesService.call(this.app, { collection: 'features', context: organisation })
      debug('Features service removed for organisation ' + organisation.name)
      await removeCatalogService.call(this.app, { context: organisation })
      debug('Catalog service removed for organisation ' + organisation.name)
      await removeAlertsService.call(this.app, { context: organisation })
      debug('Alerts service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('events', organisation))
      debug('Events service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('event-templates', organisation))
      debug('Event templates service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('event-logs', organisation))
      debug('Event logs service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('archived-events', organisation))
      debug('Archived events service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('archived-event-logs', organisation))
      debug('Archived events logs service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('plan-templates', organisation))
      debug('Plan templates service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('plans', organisation))
      debug('Plans service removed for organisation ' + organisation.name)
      await this.app.removeService(this.app.getService('archived-plans', organisation))
      debug('Archived plans service removed for organisation ' + organisation.name)
    },

    async configureOrganisations () {
      // Reinstanciated services for all organisations
      const organisations = await this.find({ paginate: false })
      organisations.forEach(organisation => {
        debug('Configuring organisation ' + organisation.name)
        // Get org DB
        const db = this.app.db.client.db(organisation._id.toString())
        this.createOrganisationServices(organisation, db)
      })
    }
  }
}