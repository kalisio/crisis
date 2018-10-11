import { permissions } from '@kalisio/kdk-core/common'

export default function (app) {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return
  }

  app.on('connection', connection => {
    // On a new real-time connection, add it to the anonymous channel
    app.channel('anonymous').join(connection)
  })

  app.on('login', (authResult, { connection }) => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      // Obtain the logged in user from the connection
      // const user = connection.user;

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection)

      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection)
    }
  })

  app.publish((data, hook) => {
    // Publish service events to authenticated users only
    // and take permissions into account
    let authorisationService = app.getService('authorisations')
    return app.channel('authenticated').filter(connection => {
      // We filter built-in Feathers services like authentication
      if (typeof hook.service.getPath !== 'function') {
        return false
      }
      // Build ability for user
      const abilities = authorisationService.getAbilities(connection.user)
      const resourceType = hook.service.name
      const context = hook.service.context
      // Check for access to service fisrt
      if (!permissions.hasServiceAbilities(abilities, hook.service)) {
        return false
      }
      // Then check against the object we'd like to manage
      if (!permissions.hasResourceAbilities(abilities, 'read', resourceType, context, hook.result || hook.data)) {
        return false
      }
      return true
    })
  })
}
