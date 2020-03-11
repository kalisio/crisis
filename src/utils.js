import _ from 'lodash'
import Vue from 'vue'
import i18next from 'i18next'
import VueI18next from '@panter/vue-i18next'

function loadComponent (component) {
  return () => {
    return import(`@kalisio/kdk-core/lib/client/components/${component}.vue`)
      .catch(errorCore => {
        return import(`@kalisio/kdk-team/lib/client/components/${component}.vue`)
          .catch(errorTeam => {
            return import(`@kalisio/kdk-notify/lib/client/components/${component}.vue`)
              .catch(errorNotify => {
                return import(`@kalisio/kdk-map/lib/client/components/${component}.vue`)
                  .catch(errorMap => {
                    // Otherwise this should be app component
                    return import(`@/${component}.vue`)
                      .catch(errorApp => {
                        console.log(errorCore, errorTeam, errorNotify, errorMap, errorEvent, errorBilling, errorApp)
                      })
                  })
              })
          })
      })
  }
}

function loadSchema (schema) {
  return import(`@kalisio/kdk-core/lib/common/schemas/${schema}.json`)
    .catch(errorCore => {
      return import(`@kalisio/kdk-team/lib/common/schemas/${schema}.json`)
        .catch(errorTeam => {
          return import(`@kalisio/kdk-map/lib/common/schemas/${schema}.json`)
            .catch(errorMap => {
              // Otherwise this should be app component
              return import(`./schemas/${schema}.json`)
                .catch(errorApp => {
                  console.log(errorCore, errorTeam, errorMap, errorEvent, errorApp)
                })
            })
        })
    })
}

function loadTranslation (module, locale) {
  let translation = module + '_' + locale + '.json'
  return import(`@kalisio/kdk-core/lib/client/i18n/${translation}`)
    .catch(errorCore => {
      return import(`@kalisio/kdk-team/lib/client/i18n/${translation}`)
        .catch(errorTeam => {
          return import(`@kalisio/kdk-notify/lib/client/i18n/${translation}`)
            .catch(errorNotify => {
              return import(`@kalisio/kdk-map/lib/client/i18n/${translation}`)
                .catch(errorMap => {
                  return import(`./i18n/${translation}`)
                    .catch(errorApp => {
                      console.log(errorCore, errorTeam, errorNotify, errorMap, errorEvent, errorBilling, errorApp)
                    })
                })
            })
        })
    })
}

function resolveAsset (asset) {
  return require('./assets/' + asset)
}

// We need this so that we can dynamically load the components
// with a function that has previously been statically analyzed by the bundler (eg webpack)
function load (name, type = 'component') {
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

async function createComponent (component, options) {
  const ComponentClass = await loadComponent(component)()
  const Component = Vue.extend(ComponentClass.default)
  return new Component(Object.assign({ i18n: new VueI18next(i18next) }, options))
}

async function createComponentVNode (component, options) {
  const ComponentClass = await loadComponent(component)()
  const Component = Vue.extend(ComponentClass.default)
  return this.$createElement(Component, Object.assign({ i18n: new VueI18next(i18next) }, options))
}

function buildRoutes (config) {
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

let utils = {
  loadComponent,
  loadSchema,
  loadTranslation,
  resolveAsset,
  load,
  createComponent,
  createComponentVNode,
  buildRoutes
}

export default utils
