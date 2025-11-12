<template>
  <div v-if="CurrentOrganisation">
    <Suspense>
      <router-view />
    </Suspense>
  </div>
</template>

<script setup>
import logger from 'loglevel'
import { watch, onBeforeMount, onUnmounted } from 'vue'
import { api, Storage } from '@kalisio/kdk/core.client'
import { useOrganisations } from '../composables'

// Props
const props = defineProps({
  contextId: {
    type: String,
    required: true
  }
})

// Data
const { CurrentOrganisation, setCurrentOrganisation, clearCurrentOrganisation } = useOrganisations()

// Watch
watch(() => props.contextId, async (contextId) => {
  // Set current event
  logger.debug(`[CRISIS] Switching to organisation ${contextId}. Setting up context`)
  await setCurrentOrganisation(contextId)
}, { immediate: true })

// Hooks
onBeforeMount(() => {
  const catalogService = api.getServiceInstance('catalog', props.contextId, { create: false })
  if (catalogService) return
  // Declare the organisation services if not already done
  api.createService('catalog', { context: props.contextId })
  api.createService('features', { context: props.contextId })
  api.createService('styles', { context: props.contextId })
  api.createService('projects', { context: props.contextId })
  Storage.createService(props.contextId)
  // Uploading can require a long time*
  api.getService('storage', props.contextId).timeout = 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
  api.createService('alerts', { context: props.contextId })
  api.createService('events', { context: props.contextId })
  api.createService('event-logs', { context: props.contextId })
  api.createService('event-templates', { context: props.contextId })
  api.createService('archived-events', { context: props.contextId })
  api.createService('archived-event-logs', { context: props.contextId })
  api.createService('plans', { context: props.contextId })
  api.createService('plan-templates', { context: props.contextId })
  api.createService('archived-plans', { context: props.contextId })
  logger.debug('[CRISIS] Services created for organisation', props.contextId)
})
onUnmounted(() => {
  logger.debug('[CRISIS] Clearing event context')
  clearCurrentOrganisation()
})
</script>
