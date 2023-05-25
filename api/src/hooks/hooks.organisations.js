import makeDebug from 'debug'

const debug = makeDebug('aktnmap:organisations:hooks')

export function removeOrganisationAlerts (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeOrganisationAlerts\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const orgAlertService = app.getService('alerts', hook.result)
  return orgAlertService.find({ paginate: false })
    .then(alerts => {
      return Promise.all(alerts.map(group => {
        return orgAlertService.remove(group._id.toString(), {
          user: hook.params.user
        })
      }))
    })
    .then(alerts => {
      debug('Removed alerts for organisation ' + hook.result._id)
      return hook
    })
}
