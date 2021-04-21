<template>
  <div v-if="contextLoaded">
    <router-view />
  </div>
</template>

<script>
import { Theme, mixins } from '@kalisio/kdk/core.client'

export default {
  name: 'context',
  mixins: [mixins.baseContext],
  methods: {
    setupContext (context) {
      // Uploading can require a long time
      if (context) {
        this.$api.getService('storage', context).timeout = 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
        // Update the theme
        const color = _.get(context, 'color')
        if (!_.isEmpty(color)) Theme.apply(color)
        else Theme.restore()
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
    Theme.restore()
  }
}
</script>
