import _ from 'lodash'
import { updatePlan } from '../../hooks'
import { when } from 'feathers-hooks-common'

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [ when(hook => _.get(hook.data, 'action') === 'subscription', updatePlan) ],
    update: [],
    patch: [],
    remove: [ when(hook => _.get(hook.params.query, 'action') === 'subscription', updatePlan) ]
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
