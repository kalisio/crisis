export default function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('archived-plans')
  options.Model.createIndex({ createdAt: -1 })
  options.Model.createIndex({ updatedAt: -1 })
  options.Model.createIndex({ deletedAt: -1 })
  options.Model.createIndex({ expiredAt: -1 })
  options.Model.createIndex({ geometry: '2dsphere' })
  // These ones are useful for statistics
  options.Model.createIndex({ template: 1 })
}
