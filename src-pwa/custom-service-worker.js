// import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkOnly } from 'workbox-strategies'
// import {ExpirationPlugin} from 'workbox-expiration'

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
//precacheAndRoute(self.__WB_MANIFEST)
// Register the `NetworkFirst` caching strategy for all HTTP requests
registerRoute(
  ({url}) => url.href.startsWith('http'),
  new NetworkOnly() /*{
    plugins: [
      new ExpirationPlugin({
        // Keep at most 50 entries.
        maxEntries: 1,
        // Don't keep any entries for more than 30 days.
        maxAgeSeconds: 7 * 24 * 60 * 60,
        // Automatically cleanup if quota is exceeded.
        purgeOnQuotaError: true
      })
    ]
  })*/
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