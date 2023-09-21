<template>
  <div>
    <h3 class="title-footer">Sponsored by</h3> 
    <a href="https://kalisio.com">
      <img class="logo-footer" :src="computedLogo">
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

// computed
const computedLogo = computed(() => {
  if (useData().isDark.value) return 'https://s3.eu-central-1.amazonaws.com/kalisioscope/kalisio/kalisio-logo-white-256x84.png'
  return 'https://s3.eu-central-1.amazonaws.com/kalisioscope/kalisio/kalisio-logo-black-256x84.png'
})
</script>

<style>
  .title-footer {
    text-align: center; 
    margin-top: 50px; 
    font-size: 20px; 
    font-weight: 700
  }
  .logo-footer {
    margin-left: auto; 
    margin-right: auto
  }
</style>