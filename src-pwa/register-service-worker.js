import logger from 'loglevel'
import { register } from 'register-service-worker'
import { Events } from '@kalisio/kdk/core.client'

// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(location.origin + '/service-worker.js', {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  registrationOptions: { scope: './' },

  ready (registration) {
    logger.debug('[CRISIS] service worker is active.')
  },

  registered (registration) {
    logger.debug('[CRISIS] service worker has been registered.')
  },

  cached (registration) {
    logger.debug('[CRISIS] content has been cached for offline use.')
  },

  updatefound (registration) {
    logger.debug('[CRISIS] new content is downloading.')
  },

  updated (registration) {
    logger.debug('[CRISIS] new content is available; please refresh.')
    Events.emit('pwa-updated', registration)
  },

  offline () {
    logger.debug('[CRISIS] no internet connection found. App is running in offline mode.')
  },

  error (err) {
    logger.error('[CRISIS] error during service worker registration:', err)
  }
})
