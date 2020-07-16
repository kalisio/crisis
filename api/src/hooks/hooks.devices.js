export async function subscribeToAppTopic (hook) {
  const topicsObject = hook.app.get('pusher')
  if (topicsObject) {
    const pusherService = hook.app.getService('pusher')
    await pusherService.create({
      action: 'subscriptions'
    }, {
      pushObject: topicsObject,
      users: [hook.params.user]
    })
  }
  return hook
}

export async function unsubscribeFromAppTopic (hook) {
  const topicsObject = hook.app.get('pusher')
  if (topicsObject) {
    const pusherService = hook.app.getService('pusher')
    await pusherService.remove(null, {
      query: { action: 'subscriptions' },
      pushObject: topicsObject,
      users: [hook.params.user]
    })
  }
  return hook
}
