import { createFeatureService, removeFeatureService, createCatalogService, removeCatalogService } from '@kalisio/kdk-map'

export function createOrganisationServices (hook) {
  let app = hook.app
  // Get org DB
  let db = app.db.instance.db(hook.result._id.toString())
  createCatalogService.call(app, { context: hook.result, db })
  createFeatureService.call(app, { collection: 'features', context: hook.result, db })
  return hook
}

export function removeOrganisationServices (hook) {
  let app = hook.app
  removeFeatureService.call(app, { collection: 'features', context: hook.result })
  removeCatalogService.call(app, { context: hook.result })
  return hook
}
