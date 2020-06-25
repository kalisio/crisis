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
    launchTour (name) {
      this.$store.patch('tours.current', { name })
    },
    getActionsForContext (context) {
      const routeName = this.$route.name
      let actions = { toolbar: [], menu: [] }
      // Flag required features as "beta"
      if ((routeName !== 'events-activity') &&
          this.$can('service', 'events', context._id)) {
        actions.toolbar.push({
          name: 'events', icon: 'las la-fire', label: this.$t('Context.EVENTS'),
          route: { name: 'events-activity', params: { operation: 'current-events', contextId: context._id } }
        })
      }
      if ((routeName !== 'archived-events-activity') &&
          this.$can('read', 'archived-events', context._id)) {
        actions.toolbar.push({
          name: 'archived-events', icon: 'las la-clipboard-list', label: this.$t('Context.ARCHIVED_EVENTS'),
          badge: { color: 'secondary', floating: true, transparent: true, label: 'beta' },
          route: { name: 'archived-events-activity', params: { operation: 'archived-events', contextId: context._id } }
        })
      }
      if ((routeName !== 'catalog-activity') && (routeName !== 'organisation-settings-activity')) {
        actions.toolbar.push({
          name: 'search', icon: 'las la-search', label: this.$t('Context.SEARCH'), handler: this.search
        })
      }
      actions.toolbar.push({
        name: 'online-help', icon: 'las la-question-circle', label: this.$t('Context.CONTEXTUAL_HELP'),
        handler: () => this.launchTour(routeName)
      })
      if ((routeName !== 'members-activity') &&
          this.$can('service', 'members', context._id)) {
        actions.menu.push({
          name: 'members', icon: 'las la-user-friends', label: this.$t('Context.MEMBERS'),
          route: { name: 'members-activity', params: { contextId: context._id } }
        })
      }
      if ((routeName !== 'tags-activity') &&
          this.$can('service', 'tags', context._id)) {
        actions.menu.push({
          name: 'tags', icon: 'las la-tags', label: this.$t('Context.TAGS'),
          route: { name: 'tags-activity', params: { contextId: context._id } }
        })
      }
      if ((routeName !== 'groups-activity') &&
          this.$can('service', 'groups', context._id)) {
        actions.menu.push({
          name: 'groups', icon: 'las la-sitemap', label: this.$t('Context.GROUPS'),
          route: { name: 'groups-activity', params: { contextId: context._id } }
        })
      }
      if ((routeName !== 'event-templates-activity') &&
          this.$can('create', 'event-templates', context._id)) {
        actions.menu.push({
          name: 'event-templates', icon: 'las la-project-diagram', label: this.$t('EventsActivity.EVENT_TEMPLATES_LABEL'),
          route: { name: 'event-templates-activity', params: { contextId: this.contextId } }
        })
      }
      if ((routeName !== 'catalog-activity') &&
          this.$can('update', 'catalog', context._id)) {
        actions.menu.push({
          name: 'catalog', icon: 'las la-map', label: this.$t('Context.CATALOG'),
          badge: { color: 'primary', transparent: true, label: 'beta' },
          route: { name: 'catalog-activity', params: { contextId: context._id } }
        })
      }
      actions.menu.push({
        name: 'refresh', icon: 'las la-sync', label: this.$t('Context.REFRESH'), handler: this.refresh
      })
      if ((routeName !== 'organisation-settings-activity') &&
          this.$can('update', 'organisations', context._id, { _id: context._id })) {
        actions.menu.push({
          name: 'settings', icon: 'las la-cog', label: this.$t('Context.SETTINGS'),
          route: { name: 'organisation-settings-activity', params: { perspective: 'properties', contextId: context._id } }
        })
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
