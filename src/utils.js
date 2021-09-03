import _ from 'lodash'
import Vue from 'vue'
import i18next from 'i18next'
import VueI18next from '@panter/vue-i18next'

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

export function loadComponent (component) {
  return () => {
    return import(`@kalisio/kdk/lib/core/client/components/${component}.vue`)
      .catch(errorCore => {
        return import(`@kalisio/kdk/lib/map/client/components/${component}.vue`)
          .catch(errorMap => {
            // Otherwise this should be app component
            return import(`@/${component}.vue`)
              .catch(errorApp => {
                console.log(errorCore, errorMap, errorApp)
              })
          })
      })
  }
}

export function loadSchema (schema) {
  return import(`@kalisio/kdk/lib/core/common/schemas/${schema}.json`)
    .catch(errorCore => {
      return import(`@kalisio/kdk/lib/map/common/schemas/${schema}.json`)
        .catch(errorMap => {
          // Otherwise this should be app component
          return import(`./schemas/${schema}.json`)
            .catch(errorApp => {
              console.log(errorCore, errorMap, errorApp)
            })
        })
    })
}

export function loadTranslation (module, locale) {
  let translation = module + '_' + locale + '.json'
  return import(`@kalisio/kdk/lib/core/client/i18n/${translation}`)
    .catch(errorCore => {
      return import(`@kalisio/kdk/lib/map/client/i18n/${translation}`)
        .catch(errorMap => {
          return import(`./i18n/${translation}`)
            .catch(errorApp => {
              console.log(errorCore, errorMap, errorApp)
            })
        })
    })
}

export function resolveAsset (asset) {
  // If external URL simply use it
  if (asset.startsWith('http://') || asset.startsWith('https://')) return asset
  // Otherwise let webpack resolve asset
  else return require('./assets/' + asset)
}

// We need this so that we can dynamically load the components
// with a function that has previously been statically analyzed by the bundler (eg webpack)
export function load (name, type = 'component') {
  switch (type) {
    case 'asset':
      return resolveAsset(name)
    case 'schema':
      return loadSchema(name)
    case 'component':
    default:
      return loadComponent(name)
  }
}

export async function createComponent (component, options) {
  const ComponentClass = await loadComponent(component)()
  const Component = Vue.extend(ComponentClass.default)
  return new Component(Object.assign({ i18n: new VueI18next(i18next) }, options))
}

export async function createComponentVNode (component, options) {
  const ComponentClass = await loadComponent(component)()
  const Component = Vue.extend(ComponentClass.default)
  return this.$createElement(Component, Object.assign({ i18n: new VueI18next(i18next) }, options))
}

export function buildRoutes (config) {
  function buildRoutesRecursively (config, routes, parentRoute) {
    _.forOwn(config, (value, key) => {
      // The key is always the path for the route
      let route = {
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
        route.component = loadComponent(value)
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
          route.component = loadComponent(value.component)
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

  let routes = []
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

  let tours = {}
  buildToursRecursively(config, tours)
  return tours
}
