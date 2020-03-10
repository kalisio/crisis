module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('events')
  // Expire at a given date
  options.Model.createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 })
  options.Model.createIndex({ createdAt: -1 })
  options.Model.createIndex({ updatedAt: -1 })
  options.Model.createIndex({ deletedAt: -1 })
}
