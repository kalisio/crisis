module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('events')
  // Expire at a given date
  options.Model.createIndex({ expireAt: -1 }, { expireAfterSeconds: 0 })
  options.Model.createIndex({ createdAt: -1 })
  options.Model.createIndex({ updatedAt: -1 })
  options.Model.createIndex({ deletedAt: -1 })
  options.Model.createIndex({ geometry: '2dsphere' })
  // We can only have a single event related to a given alert so we apply a uniicity constraint
  // However most events are not linked to an alert so we need to avoid MongoDB applyint it on null values
  options.Model.createIndex({ 'alert._id': 1 }, { unique: true, partialFilterExpression: { 'alert._id': { $exists: true } } })
  // Collation provided in query ensure sorting to be case insensitive w.r.t. user's language
  // We built indices with collation to cover the most used languages, it requires different naming...
  options.Model.createIndex({ name: 1 }, { name: 'name-en', collation: { locale: 'en', strength: 1 } })
  options.Model.createIndex({ name: 1 }, { name: 'name-fr', collation: { locale: 'fr', strength: 1 } })
}
