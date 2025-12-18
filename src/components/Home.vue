<template>
  <!-- App section -->
  <div v-if="kalisioPlanetState === 'ready' && User">
    <Suspense>
      <KLayout />
    </Suspense>
  </div>
  <div class="row items-center justify-center q-pa-md" style="height: 100vh;" v-else>
    <!--
      Pending section
    -->
    <q-spinner
      v-if="kalisioPlanetState === 'pending'"
      color="primary"
      size="10em"
    />
    <!--
      Service unavailable section
    -->
    <div v-if="kalisioPlanetState === 'error'">
      <q-img src="unavailable.png" style="max-width: 300px;" />
      <h6>{{ $t('SERVICE_UNAVAILABLE_LABEL') }}</h6>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref, onMounted } from 'vue'
import { Capabilities, api, composables as kdkCoreComposables } from '@kalisio/kdk/core.client'
import { Planets } from '@kalisio/kdk/map.client.map'

// Data
const { User } = kdkCoreComposables.useUser()
// Initialize Kalisio Planet client, backend might override some defaults in client config
const kalisioPlanetConfig = _.merge(Capabilities.get('planets.kalisio-planet'), _.get(config, 'planets.kalisio-planet'))
const kalisioPlanetState = ref('pending')

// Functions
async function connectToKalisioPlanet () {
  await Planets.connect('kalisio-planet', kalisioPlanetConfig)
  kalisioPlanetState.value = Planets.isConnected('kalisio-planet') ? 'ready' : 'error'
}
async function disconnectFromKalisioPlanet () {
  await Planets.disconnect('kalisio-planet')
}

// Hooks
onMounted(async () => {
  if (!_.isEmpty(kalisioPlanetConfig)) {
    // react to user login as we only get the Kalisio Planet token after login
    api.on('login', connectToKalisioPlanet)
    // react to user logout to clear Kalisio Planet connection
    api.on('logout', disconnectFromKalisioPlanet)
    // immediate
    if (User.value) await connectToKalisioPlanet()
  } else {
    // do not use Kalisio Planet
    kalisioPlanetState.value = 'ready'
  }
})
</script>
