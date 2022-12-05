<template>
  <div>
    <KSignupAlert 
      v-if="User" 
      :isVerified="User.isVerified" 
      :accountEmail="User.email" 
      notifierEmail="email-notifications@kalisio.com"
    />
    <KTour ref="tour" />
    <KWelcome />
    <router-view></router-view>
  </div>
</template>

<script setup>
import logger from 'loglevel'
import config from 'config'
import { useRouter, useRoute } from 'vue-router'
import { watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { api, i18n, beforeGuard, permissions, composables } from '@kalisio/kdk/core.client'

// Data
const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const { User, restoreSession, updateAbilities, logout } = composables.useUser()
const { Version } = composables.useVersion()
let isInitialized = false
let pendingReconnection = null

// Functions
async function redirect () {
  // run registered guards to redirect accordingly if required
    const result = beforeGuard(route)
  if (typeof result === 'string') {
    // When there is a single organisation directly go to the event activity, no need for the organisation dashboard
    if (User.value && (result === 'home')) {
      const response = await api.getService(_.get(config, 'context.service')).find({ query: {}, $limit: 1 })
      if (response.total === 1) {
        router.push({ name: 'context', params: { contextId: response.data[0]._id } })
        return
      }
    }
    // Redirect to a given route based on authentication state
    router.push({ name: result })
  } else if (!result) {
    // This route was previously allowed but due to changes in authorisations it is not anymore
    router.push({ name: ( User.value ? 'home' : 'login') })
  }
  // The first time initialize guards after the app has been correctly setup,
  // ie either with or without a restored user
  if (!isInitialized) {
    router.beforeEach(beforeGuard)
    isInitialized = true
  }
  // Check if we'd like to redirect to an organisation
  let organisation = _.get(route, 'query.organisation', '').toLowerCase()
  const permission = permissions.Roles[organisation]
  if (User.value && organisation) {
    const organisations = _.get(User.value, 'organisations', [])
    organisation = _.find(organisations, org => {
      // Redirect on target org or any org with the right permissions
      if (!_.isNil(permission)) {
        if (permissions.Roles[org.permissions] >= permission) return true
      } else if (org._id === organisation) return true
      return false
    })
    if (organisation) {
      // Stop any running tour as we will redirect
      // this.$refs.tour.getTour().stop()
      router.replace({
        name: _.get(route, 'query.route', 'context'),
        params: Object.assign({
          contextId: organisation._id,
          objectId: organisation._id, // Required for eg billing
          title: organisation.name, // Required for eg billing
          page: _.get(route, 'query.page')
        }, _.get(route, 'params', {})),
        query: _.omit(_.get(route, 'query', {}), ['organisation', 'page'])
      })
    } else {
      $q.notify({ type: 'negative', message: this.$t('Index.ORGANISATION_NOT_FOUND') })
    }
  }
}

// Watch
watch(User, async () => { 
  await updateAbilities()
  redirect() 
})

// Hooks
onMounted(async () => { 
  try { 
    await restoreSession()
  } catch (error) {
    redirect()
  }
})

// Immediate
// handle socket connexion
if (api.socket) {
  // Display error message if we cannot contact the server
  api.socket.on('reconnect_error', () => {
    // Display it only the first time the error appears because multiple attempts will be tried
    if (!pendingReconnection) {
      logger.error(new Error('Socket has been disconnected'))
      // This will ensure any operation in progress will not keep a "dead" loading indicator
      // as this error might appear under-the-hood without notifying service operations
      Loading.hide()
      pendingReconnection = $q.dialog({
        title: i18n.t('Index.ALERT'),
        message: i18n.t('Index.DISCONNECT'),
        html: true,
        persistent: true
      }).onDismiss(() => { pendingReconnection = null })
    }
  })
  // Handle reconnection correctly, otherwise auth seems to be lost
  // Also easier to perform a full refresh instead of handling this specifically on each activity
  api.socket.on('reconnect', () => {
    // Dismiss pending reconnection error message
    if (pendingReconnection) {
      pendingReconnection.hide()
    }
    // Causes problems with hot reload in dev
    if (Version.flavor !== 'dev') {
      Loading.show({ message: i18n.t('Index.RECONNECT') })
      setTimeout(() => { window.location.reload() }, 3000)
    } else {
      logger.error(new Error('Socket disconnected, not trying to reconnect automatically in development mode please refresh page manually'))
    }
  })
  // Display error message if we have been banned from the server
  api.socket.on('rate-limit', () => {
    $q.dialog({
      title: i18n.t('Index.ALERT'),
      message: i18n.t('Index.REFUSED'),
      html: true,
      ok: {
        label: i18n.t('Index.RETRY'),
        flat: true
      }
    }).onOk(() => window.location.reload())
  })
}
</script>
