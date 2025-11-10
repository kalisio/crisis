<template>
  <iframe id="kano" style="width: 100%; height: 100%; fontWeight: normal; zIndex: 0; position: absolute;" title="Kano" allow="geolocation *" allowfullscreen frameborder="0" :src="origin"/>
</template>

<script setup>
import { ref } from 'vue'
import postRobot from 'post-robot'
import config from 'config'
import { api, Context } from '@kalisio/kdk/core.client'

// Data
const context = Context.get()
const origin = ref(`http://localhost:8086/#/home/${context._id}/map`)

postRobot.on('kano-ready', async () => {
  let kano = document.getElementById('kano')
  if (kano) kano = kano.contentWindow
  await postRobot.send(kano, 'setConfiguration', {
    theme: context.color,
    'layout.panes.left.opener': false
  })
  // Authenticate automatically
  const accessToken = await api.get('storage').getItem(config.kanoJwt)
  await postRobot.send(kano, 'setLocalStorage', {
    'kano-jwt': accessToken
  })
})

</script>