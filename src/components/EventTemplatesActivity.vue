<template>
  <k-page padding>
    <div slot="page-content">
      <!--
        Templates collection
      -->
      <k-grid service="event-templates" :base-query="baseQuery" :filter-query="searchQuery" :renderer="renderer" :contextId="contextId" :list-strategy="'smart'" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="event-templates" router="router()"></router-view>
    </div>
  </k-page>
</template>

<script>
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'event-templates-activity',
  mixins: [kCoreMixins.baseActivity],
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
          name: 1
        }
      },
      renderer: {
        component: 'EventTemplateCard',
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
        onApply: { name: 'event-templates-activity', params: { contextId: this.contextId } },
        onDismiss: { name: 'event-templates-activity', params: { contextId: this.contextId } }
      }
    },
    refreshActivity () {
      this.clearActivity()
      this.setTitle(this.$store.get('context.name'))
      // Search bar
      this.setSearchBar('name')
      // Tabbar actions
      this.registerTabAction({
        name: 'events',
        label: this.$t('EventTemplatesActivity.EVENTS_LABEL'),
        icon: 'whatshot',
        route: { name: 'events-activity', params: { contextId: this.contextId } }
      })
      this.registerTabAction({
        name: 'event-templates',
        label: this.$t('EventTemplatesActivity.EVENT_TEMPLATES_LABEL'),
        icon: 'widgets',
        route: { name: 'event-templates-activity', params: { contextId: this.contextId } },
        default: true
      })
      // Fab actions
      if (this.$can('create', 'event-templates', this.contextId)) {
        this.registerFabAction({
          name: 'create-event-template',
          label: this.$t('EventTemplatesActivity.CREATE_TEMPLATE_LABEL'),
          icon: 'add',
          route: { name: 'create-event-template', params: {} }
        })
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
