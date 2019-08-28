import { createFeaturesService, removeFeaturesService, createCatalogService, removeCatalogService } from '@kalisio/kdk-map'

export function createOrganisationServices (hook) {
  const app = hook.app
  // Get org DB
  const db = app.db.instance.db(hook.result._id.toString())
  createCatalogService.call(app, { context: hook.result, db })
  createFeaturesService.call(app, { collection: 'features', context: hook.result, db })
  return hook
}

export function removeOrganisationServices (hook) {
  const app = hook.app
  removeFeaturesService.call(app, { collection: 'features', context: hook.result })
  removeCatalogService.call(app, { context: hook.result })
  return hook
}
