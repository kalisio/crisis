export async function subscribeToAppTopic (hook) {
  const topicsObject = hook.app.get('pusher')
  // The app topics are actually stored in the pusher config
  if (topicsObject) {
    const pusherService = hook.app.getService('pusher')
    await pusherService.create({
      action: 'subscriptions'
    }, {
      // Pusher usually expects objects coming from the DB so add an _id to avoid any problem
      pushObject: Object.assign({ _id: 'aktnmap' }, topicsObject),
      users: [hook.params.user]
    })
  }
  return hook
}

export async function unsubscribeFromAppTopic (hook) {
  const topicsObject = hook.app.get('pusher')
  // The app topics are actually stored in the pusher config
  if (topicsObject) {
    const pusherService = hook.app.getService('pusher')
    await pusherService.remove(null, {
      query: { action: 'subscriptions' },
      // Pusher usually expects objects coming from the DB so add an _id to avoid any problem
      pushObject: Object.assign({ _id: 'aktnmap' }, topicsObject),
      users: [hook.params.user]
    })
  }
  return hook
}
