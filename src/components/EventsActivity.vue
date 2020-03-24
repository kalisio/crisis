<template>
  <k-page padding>
    <div slot="page-content">
      <!--
        Events collection
      -->
      <k-grid service="events" :base-query="baseQuery" :filter-query="searchQuery" :renderer="renderer" :contextId="contextId" :list-strategy="'smart'" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="events" :router="router()"></router-view>
    </div>
  </k-page>
</template>

<script>
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'

export default {
  name: 'events-activity',
  mixins: [kCoreMixins.baseActivity, kMapMixins.geolocation],
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      baseQuery: {
        $sort: {
          updatedAt: -1
        }
      },
      renderer: {
        component: 'EventCard',
        props: {
          options: {
          }
        }
      }
    }
  },
  methods: {
    router () {
      return {
        onApply: { name: 'events-activity', params: { contextId: this.contextId } },
        onDismiss: { name: 'events-activity', params: { contextId: this.contextId } }
      }
    },
    async refreshActivity () {
      this.clearActivity()
      this.setTitle(this.$store.get('context.name'))
      // Search bar
      this.setSearchBar('name')
      // Tabbar actions
      this.registerTabAction({
        name: 'events',
        label: this.$t('EventsActivity.EVENTS_LABEL'),
        icon: 'whatshot',
        route: { name: 'events-activity', params: { contextId: this.contextId } },
        default: true
      })
      if (this.$can('create', 'event-templates', this.contextId)) {
        this.registerTabAction({
          name: 'event-templates',
          label: this.$t('EventsActivity.EVENT_TEMPLATES_LABEL'),
          icon: 'widgets',
          route: { name: 'event-templates-activity', params: { contextId: this.contextId } }
        })
      }
      // Fab actions
      if (this.$can('create', 'events', this.contextId)) {
        const eventTemplatesService = this.$api.getService('event-templates')
        let response = await eventTemplatesService.find({
          query: { $limit: 0 }
        })
        const batchSize = 50
        let batchCount = Math.floor(response.total, batchSize)
        const remainder = response.total % batchSize
        if (remainder > 0) batchCount++
        let offset = 0
        for (let i = 0; i < batchCount; i++) {
          response = await eventTemplatesService.find({
            query: { $skip: offset, $limit: batchSize },
            $select: ['name', 'icon']
          })
          const templates = response.data
          templates.forEach(template => {
            // It is easier to access the DOM with template names, eg in tests, so we use it as action name whenever possible
            // However we have to check about duplicated names
            const doublons = templates.filter(otherTemplate => otherTemplate.name.toLowerCase() === template.name.toLowerCase())
            this.registerFabAction({
              name: 'create-' + (doublons.length > 1 ? template._id : template.name),
              label: template.name,
              icon: kCoreUtils.getIconName(template),
              route: { name: 'create-event', params: { contextId: this.contextId, templateId: template._id } }
            })
          })
          offset = offset + batchSize
        }
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
    // Performs geolocation
    this.updatePosition()
  }
}
</script>
