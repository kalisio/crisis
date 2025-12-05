<template>
  <KActivity name="catalog">
    <iframe id="kano" style="width: 100%; height: 100%; fontWeight: normal; zIndex: 0; position: absolute;" title="Kano" allow="geolocation *" allowfullscreen frameborder="0" :src="origin"/>
  </KActivity>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import postRobot from 'post-robot'
import { api, Context } from '@kalisio/kdk/core.client'
import { Planets } from '@kalisio/kdk/map.client.map'

// Data
const context = Context.get()
const baseUrl = Planets.get('kalisio-planet').getConfig().domain
const planetJwt = Planets.get('kalisio-planet').getConfig().apiJwt
const origin = ref(`${baseUrl}/#/home/${context._id}/map`)
let initializeListener

// Functions
async function initialize () {
  let kano = document.getElementById('kano')
  if (kano) kano = kano.contentWindow
  await postRobot.send(kano, 'setConfiguration', {
    theme: context.color,
    'layout.panes.left.opener': false
  })
  // Authenticate automatically
  const accessToken = await api.get('storage').getItem(planetJwt)
  await postRobot.send(kano, 'setLocalStorage', {
    'kano-jwt': accessToken
  })
}

// Hooks
onBeforeMount(() => {
  initializeListener = postRobot.on('kano-ready', initialize)
})

onBeforeUnmount(() => {
  if (initializeListener) initializeListener.cancel()
})

</script>
