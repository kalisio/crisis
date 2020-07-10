import _ from 'lodash'
import makeDebug from 'debug'

const debug = makeDebug('aktnmap:devices:hooks')

export async function subscribeToAppTopic (hook) {
  const topics = hook.app.get('pusher')
  if (topics) {
    const pusherService = hook.app.getService('pusher')
    await pusherService.create({
      action: 'subscriptions'
    }, {
      pushObject: topics,
      users: [hook.params.user]
    })
  }
  return hook
}

export async function unsubscribeFromAppTopic (hook) {
  const topics = hook.app.get('pusher')
  if (topics) {
    const pusherService = hook.app.getService('pusher')
    await pusherService.remove(topic._id.toString(), {
      query: { action: 'subscriptions' },
      pushObject: topics,
      users: [hook.params.user]
    })
  }
  return hook
}
