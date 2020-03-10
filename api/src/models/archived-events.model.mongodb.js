module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('archived-events')
  options.Model.createIndex({ createdAt: -1 })
  options.Model.createIndex({ updatedAt: -1 })
  options.Model.createIndex({ deletedAt: -1 })
  options.Model.createIndex({ expiredAt: -1 })
}
