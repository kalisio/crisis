module.exports = function (app, options) {
  const db = options.db || app.db
  options.Model = db.collection('event-logs')
  // Expire at a given date
  options.Model.createIndex({ expireAt: 1 }, { expireAfterSeconds: 0 })
  // Use compound index so that we can easily filter by event then by participant
  options.Model.createIndex({ event: 1, participant: 1 })
  options.Model.createIndex({ geometry: '2dsphere' })
}
