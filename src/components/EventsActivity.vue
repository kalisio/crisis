<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Events collection
      -->
      <k-grid service="events" :base-query="baseQuery" :filter-query="filter.query" :renderer="renderer" :contextId="contextId" :list-strategy="'smart'" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="events"></router-view>
    </template>
  </k-page>
</template>

<script>
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

const activityMixin = kCoreMixins.baseActivity()

export default {
  name: 'events-activity',
  mixins: [activityMixin],
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
      filter: this.$store.get('filter'),
      renderer: {
        component: 'EventCard'
      }
    }
  },
  methods: {
    async configureActivity () {
      activityMixin.methods.configureActivity.call(this)
      // Fab actions
      if (this.$can('create', 'events', this.contextId)) {
        const actions = []
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
            actions.push({
              id: 'create-' + (doublons.length > 1 ? template._id : template.name),
              label: template.name,
              icon: template.icon.name,
              color: template.icon.color,
              route: { name: 'create-event', params: { contextId: this.contextId, templateId: template._id } }
            })
          })
          offset = offset + batchSize
        }
        this.setFab(actions)
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
  }
}
</script>
