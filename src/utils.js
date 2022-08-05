import _ from 'lodash'

export function hasRoleInEvent (user, roles) {
  return _.findIndex(roles, role => {
    if ((role.service === 'members') && (role._id === user._id)) return true
    if ((role.service === 'groups') ||
        (role.service === 'tags') ||
        (role.service === 'organisations')) {
      if ([user].find(sift({ [role.service + '._id']: role._id }))) return true
    }
    return false
  }) >= 0
}

export function getEventsQuery (user, contextId) {
  let ids = [user._id]
  if (contextId) {
    _.get(user, 'groups', []).forEach(group => {
      if (group.context === contextId) ids.push(group._id)
    })
    _.get(user, 'tags', []).forEach(tag => {
      if (tag.context === contextId) ids.push(tag._id)
    })
  }
  return {
    $or: [{
      'participants._id': { $in: ids }
    }, {
      'coordinators._id': { $in: ids }
    }]
  }
}

export function getPlansQuery (user, contextId) {
  let ids = [user._id]
  if (contextId) {
    _.get(user, 'groups', []).forEach(group => {
      if (group.context === contextId) ids.push(group._id)
    })
    _.get(user, 'tags', []).forEach(tag => {
      if (tag.context === contextId) ids.push(tag._id)
    })
  }
  return {
    'coordinators._id': { $in: ids }
  }
}

export function buildTours (config) {
  function buildToursRecursively (config, tours) {
    _.forOwn(config, (value, key) => {
      const name = _.get(value, 'name', _.get(value, 'path', key))
      const tour = _.get(value, 'tour')
      if (tour) {
        // If we directly have a tour as an array of steps
        if (Array.isArray(tour)) tours[name] = tour
        // Or a set of tours as key/value object when eg the route has a parameter and each value has its own tour
        // or when the tour is split over multiple linked smaller tours because it is too much complex for a single one
        else if (typeof tour === 'object') {
          _.forOwn(tour, (paramTour, paramValue) => {
            // We identify the main route tour if the key is the same
            if (paramValue === name) tours[`${name}`] = paramTour
            else tours[`${name}/${paramValue}`] = paramTour
          })
        }
      }
      // Check for any children to recurse
      if (value.children) {
        buildToursRecursively(value.children, tours)
      }
    })
  }

  let tours = {}
  buildToursRecursively(config, tours)
  return tours
}
