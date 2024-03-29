import _ from 'lodash'
import sift from 'sift'

export function getLocationAsFeature(object) {
  if (!object || !object.location) return null
  const location = object.location
  let feature = location
  // backward compatibility with old format with only a geometry, not a feature
  if (location.type !== 'Feature') {
    feature = { type: 'Feature', geometry: location, properties: { name: location.name } }
    if (!_.has(feature, 'geometry.type')) feature.geometry = { type: 'Point', coordinates: [location.longitude, location.latitude] }
  }
  return feature
}

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
  const ids = [user._id]
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
  const ids = [user._id]
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

// Build vue router config from our config file
export function buildRoutes (config) {
  function buildRoutesRecursively (config, routes, parentRoute) {
    _.forOwn(config, (value, key) => {
      // The key is always the path for the route
      const route = {
        path: key,
        name: key,
        // "Inherit" meta data on nested routes
        meta: (parentRoute ? Object.assign({}, parentRoute.meta) : {})
      }
      // If value is a simple string this is a shortcut:
      // - name = path
      // - component = value
      // Otherwise we have an object similar to what expect vue-router,
      // we simply return the async component loading function with the given component value
      if (typeof value === 'string') {
        route.component = () => import(`@components/${value}.vue`)
      } else {
        // Take care that path can be empty so we cannot just check with a if
        if (_.has(value, 'path')) {
          route.path = value.path
        }
        // Take care that name can be empty so we cannot just check with a if
        if (_.has(value, 'name')) {
          route.name = value.name
        }
        if (_.has(value, 'component')) {
          route.component = () => import(`@components/${value.component}.vue`)
        }
        if (_.has(value, 'props')) {
          route.props = value.props
        }
        if (_.has(value, 'meta')) {
          // Override parent meta if child meta given
          Object.assign(route.meta, value.meta)
        }
        if (_.has(value, 'redirect')) {
          _.set(route, 'redirect', value.redirect)
        }
      }

      // Check for any children to recurse
      if (value.children) {
        route.children = []
        buildRoutesRecursively(value.children, route.children, route)
      }
      routes.push(route)
    })
  }

  const routes = []
  buildRoutesRecursively(config, routes)
  return routes
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

  const tours = {}
  buildToursRecursively(config, tours)
  return tours
}
