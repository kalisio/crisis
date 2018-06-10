import _ from 'lodash'
import { hooks as coreHooks } from 'kCore'

export const checkOrganisationsQuotas = coreHooks.countLimit({
  count: (hook) => {
    let orgs = _.get(hook, 'params.user.organisations', [])
    orgs = _.filter(orgs, (org) => org.permissions === 'owner')
    return orgs.length
  },
  max: (hook) => {
    const quotas = hook.app.get('quotas')
    return _.get(quotas, 'global.organisations', 1)
  }
})
