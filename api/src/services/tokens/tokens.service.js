import _ from 'lodash'
import errors from '@feathersjs/errors'
import makeDebug from 'debug'
import { permissions as corePermissions } from '@kalisio/kdk/core.common.js'
import * as permissions from '../../../../common/permissions.mjs'

const debug = makeDebug('crisis:token:service')
const { BadRequest, Forbidden } = errors

// This service is now only used to generate tokens for Kano administration
class TokenService {
  constructor(app, options = {}) {
    this.app = app
    this.authenticationService = this.app.getService('authentication')
    this.options = options
  }

  async create (data, params) {
    const { jwtOptions } = this.app.get('authentication') || this.app.get('auth')
    const { type, context } = data
    switch (type) {
      case 'planet':
      default:
        const planetTokens = this.app.get('planetTokens')
        let accessToken = _.get(planetTokens, 'kalisio-planet')
        if (!accessToken) throw new BadRequest('No planet token configured')
        // Check user has appripriate permissions to do so
        const user = params.user
        const userRole = permissions.getRoleForOrganisation(user, context)
        if (_.isNil(userRole) || corePermissions.isJuniorRole(userRole, 'manager')) throw new Forbidden('You need appropriate permissions to generate tokens for your organisation')
        // Get base token
        const payload = await this.authenticationService.verifyAccessToken(accessToken, jwtOptions)
        // Generate access token for target organisation from base access token
        accessToken = await this.app.getService('authentication').createAccessToken(
          // Custom payload to provide permissions in Kano
          _.merge({ catalog: { permissions: userRole, context } }, _.pick(payload, ['name', 'appId'])),
          // Generate a unique subject per context due to cache
          _.merge({ subject: `planet-${context}-${userRole}` }, jwtOptions)
        )
        return accessToken
    }
    throw new Forbidden('Wrong token type')
  }
}

export default function (name, app, options) {
  const config = app.get('token')
  debug('Creating token service with config ', config)
  const service = new TokenService(app, config)

  return service
}
