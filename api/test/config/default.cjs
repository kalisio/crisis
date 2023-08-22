const path = require('path')

// Use default app config
const config = require(path.join(__dirname, '../../config/default.cjs'))

// Simply changes outputs so we don't pollute DB, logs, etc.
config.logs.DailyRotateFile.dirname = path.join(__dirname, '..', 'logs')
config.db.url = config.db.url.replace('aktnmap', 'aktnmap-test')
delete config.authentication.defaultUsers
// Set a hard limit like in production
config.quotas.organisations = 1

module.exports = config
