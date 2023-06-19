import makeDebug from 'debug'

const debug = makeDebug('aktnmap:organisations:hooks')

export async function removeOrganisationAlerts (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeOrganisationAlerts\' hook should only be used as a \'after\' hook.')
  }

  const app = hook.app
  const orgAlertService = app.getService('alerts', hook.result)
  const alerts = await orgAlertService.find({ paginate: false })
  await Promise.all(alerts.map(alert => {
    return orgAlertService.remove(alert._id.toString(), {
      user: hook.params.user
    })
  }))
  debug('Removed alerts for organisation ' + hook.result._id)
  return hook
}
