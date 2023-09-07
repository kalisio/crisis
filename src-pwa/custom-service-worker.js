import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst } from 'workbox-strategies'

// Disable workbox logs 
self.__WB_DISABLE_DEV_LOGS = true

// Activate new service worker
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

// Caching for offline mode
// Preload and cache all resources defined in the manifest
precacheAndRoute(self.__WB_MANIFEST)
// Register the `NetworkFirst` caching strategy for all HTTP requests
registerRoute(
  ({url}) => url.href.startsWith('http'),
  new NetworkFirst()
)

// Web push notification
let clickOpenUrl
self.addEventListener('push', event => {
  const notification = event.data.json()
  clickOpenUrl = notification.url
  // Dispatch and show notification
  clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(function (clients) {
    if (clients && clients.length) {
      clients.forEach(client => client.postMessage({ type: 'push', notification }))
    }
  })
  event.waitUntil(self.registration.showNotification(notification.title, notification))
})
self.addEventListener('notificationclick', event => {
  // Close notification if clicked
  event.notification.close()
  // Open window on the specified url
  if (clickOpenUrl) {
    const promiseChain = clients.openWindow(clickOpenUrl)
    event.waitUntil(promiseChain)
  }
})