import { checkAlertsQuotas } from '../../hooks'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [checkAlertsQuotas],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
