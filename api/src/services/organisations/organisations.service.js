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
      if (!this.app.getService('members', organisation)) {
        await this.app.createService('members', {
          servicesPath,
          context: organisation,
          proxy: {
            service: this.app.getService('users'),
            params: { query: { 'organisations._id': organisation._id } }
          }
        })
        debug('Members service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('groups', organisation)) {
        await this.app.createService('groups', {
          modelsPath,
          servicesPath,
          context: organisation,
          db
        })
        debug('Groups service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('tags', organisation)) {
        await this.app.createService('tags', {
          modelsPath,
          servicesPath,
          context: organisation,
          db
        })
        debug('Tags service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('configurations', organisation)) {
        await createConfigurationsService.call(this.app, { context: organisation, db })
        debug('Configurations service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('default-configurations', organisation)) {
        await createDefaultConfigurations.call(this.app, organisation)
        debug('Default configurations service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('storage', organisation)) {
        await createStorageService.call(this.app, { context: organisation })
        debug('Storage service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('catalog', organisation)) {
        await createCatalogService.call(this.app, { context: organisation, db })
        debug('Catalog service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('features', organisation)) {
        await createFeaturesService.call(this.app, { collection: 'features', context: organisation, db })
        debug('Features service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('projects', organisation)) {
        await createProjectsService.call(this.app, { context: organisation, db })
        debug('Projects service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('styles', organisation)) {
        await createStylesService.call(this.app, { context: organisation, db })
        debug('Styles service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('alerts', organisation)) {
        await createAlertsService.call(this.app, { context: organisation, db })
        debug('Alerts service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('events', organisation)) {
        await this.app.createService('events', {
          modelsPath,
          servicesPath,
          context: organisation,
          paginate: { default: 20, max: 5000 },
          db
        })
        debug('Events service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('event-templates', organisation)) {
        await this.app.createService('event-templates', {
          modelsPath,
          servicesPath,
          context: organisation,
          db
        })
        debug('Event templates service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('event-logs', organisation)) {
        await this.app.createService('event-logs', {
          modelsPath,
          servicesPath,
          context: organisation,
          paginate: { default: 1000, max: 5000 },
          db
        })
        debug('Event logs service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('archived-events', organisation)) {
        await this.app.createService('archived-events', {
          modelsPath,
          servicesPath,
          context: organisation,
          paginate: { default: 20, max: 5000 },
          db
        })
        debug('Archived events service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('archived-event-logs', organisation)) {
        await this.app.createService('archived-event-logs', {
          modelsPath,
          servicesPath,
          context: organisation,
          paginate: { default: 1000, max: 5000 },
          db
        })
        debug('Archived event logs service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('plan-templates', organisation)) {
        await this.app.createService('plan-templates', {
          modelsPath,
          servicesPath,
          context: organisation,
          db
        })
        debug('Plan templates service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('plans', organisation)) {
        await this.app.createService('plans', {
          modelsPath,
          servicesPath,
          context: organisation,
          db
        })
        debug('Plans service created for organisation ' + organisation.name)
      }
      if (!this.app.getService('archived-plans', organisation)) {
        await this.app.createService('archived-plans', {
          modelsPath,
          servicesPath,
          context: organisation,
          paginate: { default: 20, max: 5000 },
          db
        })
        debug('Archived plans service created for organisation ' + organisation.name)
      }
    },

    async removeOrganisationServices (organisation) {
      if (this.app.getService('configurations', organisation)) {
        await removeConfigurationsService.call(this.app, { context: organisation })
        debug('Configurations service removed for organisation ' + organisation.name)
      }
      if (this.app.getService('storage', organisation)) {
        await removeStorageService.call(this.app, { context: organisation })
        debug('Storage service removed for organisation ' + organisation.name)
      }
      const tagsService = this.app.getService('tags', organisation)
      if (tagsService) {
        await this.app.removeService(tagsService)
        debug('Tags service removed for organisation ' + organisation.name)
      }
      const groupsService = this.app.getService('groups', organisation)
      if (groupsService) {
        await this.app.removeService(groupsService)
        debug('Groups service removed for organisation ' + organisation.name)
      }
      const membersService = this.app.getService('members', organisation)
      if (membersService) {
        await this.app.removeService(membersService)
        debug('Members service removed for organisation ' + organisation.name)
      }
      if (this.app.getService('styles', organisation)) {
        await removeStylesService.call(this.app, { context: organisation })
        debug('Styles service removed for organisation ' + organisation.name)
      }
      if (this.app.getService('projects', organisation)) {
        await removeProjectsService.call(this.app, { context: organisation })
        debug('Projects service removed for organisation ' + organisation.name)
      }
      if (this.app.getService('features', organisation)) {
        await removeFeaturesService.call(this.app, { collection: 'features', context: organisation })
        debug('Features service removed for organisation ' + organisation.name)
      }
      if (this.app.getService('catalog', organisation)) {
        await removeCatalogService.call(this.app, { context: organisation })
        debug('Catalog service removed for organisation ' + organisation.name)
      }
      if (this.app.getService('alerts', organisation)) {
        await removeAlertsService.call(this.app, { context: organisation })
        debug('Alerts service removed for organisation ' + organisation.name)
      }
      const eventsService = this.app.getService('events', organisation)
      if (eventsService) {
        await this.app.removeService(eventsService)
        debug('Events service removed for organisation ' + organisation.name)
      }
      const eventTemplatesService = this.app.getService('event-templates', organisation)
      if (eventTemplatesService) {
        await this.app.removeService(eventTemplatesService)
        debug('Event templates service removed for organisation ' + organisation.name)
      }
      const eventLogsService = this.app.getService('event-logs', organisation)
      if (eventLogsService) {
        await this.app.removeService(eventLogsService)
        debug('Event logs service removed for organisation ' + organisation.name)
      }
      const archivedEventsService = this.app.getService('archived-events', organisation)
      if (archivedEventsService) {
        await this.app.removeService(archivedEventsService)
        debug('Archived events service removed for organisation ' + organisation.name)
      }
      const archivedEventLogsService = this.app.getService('archived-event-logs', organisation)
      if (archivedEventLogsService) {
        await this.app.removeService(archivedEventLogsService)
        debug('Archived event logs service removed for organisation ' + organisation.name)
      }
      const planTemplatesService = this.app.getService('plan-templates', organisation)
      if (planTemplatesService) {
        await this.app.removeService(planTemplatesService)
        debug('Plan templates service removed for organisation ' + organisation.name)
      }
      const plansService = this.app.getService('plans', organisation)
      if (plansService) {
        await this.app.removeService(plansService)
        debug('Plans service removed for organisation ' + organisation.name)
      }
      const archivedPlansService = this.app.getService('archived-plans', organisation)
      if (archivedPlansService) {
        await this.app.removeService(archivedPlansService)
        debug('Archived plans service removed for organisation ' + organisation.name)
      }
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