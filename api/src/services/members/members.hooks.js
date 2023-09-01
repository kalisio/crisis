import _ from 'lodash'
import commonHooks from 'feathers-hooks-common'
import fuzzySearch from 'feathers-mongodb-fuzzy-search'
import { hooks as coreHooks, createObjectID } from '@kalisio/kdk/core.api.js'

// Fix for https://github.com/kalisio/crisis/issues/217
// because in some cases the context is stored in the DB as an ObjectID while it is as a string otherwise.
// Filtering using context assumes that the context is always a string so we manage to match ObjectIDs as well
function hasItemContext (hook) {
  return _.get(hook.params, 'query.tags.$elemMatch.context', _.get(hook.params, 'query.groups.$elemMatch.context'))
}

function itemContextMatch (hook) {
  const query = _.get(hook.params, 'query.tags.$elemMatch', _.get(hook.params, 'query.groups.$elemMatch'))
  query.$or = [{ context: query.context }, { context: createObjectID(query.context) }]
  delete query.context
  return hook
}

export default {
  before: {
    all: [],
    find: [
      commonHooks.when(hasItemContext, itemContextMatch), 
      fuzzySearch({ fields: ['profile.name'] }), coreHooks.diacriticSearch() 
    ],
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
    create: [],
    update: [],
    // Adding/Removing tags changes abilities, the subject is the item of the hook
    // to update we also need to fetch the user because on patch we might only have the tags available and not permissions
    patch: [coreHooks.updateAbilities({ subjectAsItem: true })],
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
