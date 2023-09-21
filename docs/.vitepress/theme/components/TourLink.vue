<template>
  <a target="_blank" :href="computedUrl">{{ text }}<i class="las la-external-link-square-alt"></i></a>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  path: {
    type: String,
    default: ''
  },
  params: {
    type: Object,
    // BUG: using arrow function here is causing problem with SSR
    default: function () { return {} }
  }
})

// computed
const computedUrl = computed(() => {
  let url = useData().theme.value.appUrl + `#/${props.path}?`
  // Add tour param be default if not provided
  if (!props.params.tour) url += 'tour=true&'
  for (const [key, value] of Object.entries(props.params)) {
    url += `${key}=${value}&`
  }
  // Remove last &
  return url.slice(0, -1)
})
</script>