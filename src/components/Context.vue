<template>
  <div v-if="contextLoaded">
    <router-view />
  </div>
</template>

<script>
import { mixins } from '@kalisio/kdk/core.client'

export default {
  name: 'context',
  mixins: [mixins.baseContext],
  methods: {
    setupContext (context) {
      // Uploading can require a long time
      if (context) {
        this.$api.getService('storage', context).timeout = 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
      }
    },
    watchOrganisation (organisation) {
      if (organisation._id === this.contextId) this.setContext(organisation)
    }
  },
  created () {
    this.$events.$on('context-changed', this.setupContext)
    this.service.on('patched', this.watchOrganisation)
  },
  beforeDestroy () {
    this.$events.$off('context-changed', this.setupContext)
    this.service.off('patched', this.watchOrganisation)
  }
}
</script>
