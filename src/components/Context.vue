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
    refresh () {
      window.location.reload()
    },
    search () {
      this.$store.patch('searchBar', { isVisible: !this.$store.get('searchBar.isVisible') })
    },
    getActionsForContext (context) {
      let actions = { leading: null, toolbar: [], menu: [] }
      actions.leading = { name: 'dashboard', icon: 'las la-home', label: this.$t('Context.DASHBOARD'), route: { name: 'dashboard', params: { contextId: context._id } } }
      if (this.$can('service', 'events', context._id)) {
        actions.toolbar.push({ name: 'events', icon: 'las la-fire-alt', label: this.$t('Context.EVENTS'), route: { name: 'events-activity', params: { operation: 'current-events', contextId: context._id } } })
      }
      if (this.$can('service', 'archived-events', context._id)) {
        actions.toolbar.push({ name: 'archived-events', icon: 'las la-clipboard-list', label: this.$t('Context.ARCHIVED_EVENTS'), route: { name: 'archived-events-activity', params: { operation: 'archived-events', contextId: context._id } } })
      }
      actions.toolbar.push({ name: 'search', icon: 'las la-search', label: this.$t('Context.SEARCH'), handler: this.search })
      actions.toolbar.push({ name: 'refresh', icon: 'las la-sync', label: this.$t('Context.REFRESH'), handler: this.refresh })
      // FIXME do we need specific permissions for that ?
      if (this.$can('update', 'organisations', context._id, { _id: context._id })) {
        actions.menu.push({ name: 'catalog', icon: 'las la-map', label: this.$t('Context.CATALOG'), route: { name: 'catalog-activity', params: { contextId: context._id } } })
      }
      if (this.$can('service', 'members', context._id)) {
        actions.menu.push({ name: 'members', icon: 'las la-user-friends', label: this.$t('Context.MEMBERS'), route: { name: 'members-activity', params: { contextId: context._id } } })
      }
      if (this.$can('update', 'organisations', context._id, { _id: context._id })) {
        actions.menu.push({ name: 'settings', icon: 'las la-cog', label: this.$t('Context.SETTINGS'), route: { name: 'organisation-settings-activity', params: { perspective: 'properties', contextId: context._id } } })
      }
      return actions
    },
    setupContext (context) {
      // Uploading can require a long time
      if (context) {
        this.$api.getService('storage', context).timeout = 60 * 60 * 1000 // 1h should be sufficient since we also have size limits
      }
    }
  },
  created () {
    this.$events.$on('context-changed', this.setupContext)
  },
  beforeDestroy () {
    this.$events.$off('context-changed', this.setupContext)
  }
}
</script>
