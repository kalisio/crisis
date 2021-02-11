<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Templates collection
      -->
      <k-grid service="event-templates" :base-query="baseQuery" :filter-query="filter.query" :renderer="renderer" :contextId="contextId" :list-strategy="'smart'" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="event-templates" router="router()"></router-view>
    </template>
  </k-page>
</template>

<script>
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'event-templates-activity',
  mixins: [kCoreMixins.baseActivity()],
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
      filter: this.$store.get('filter'),
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
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
  }
}
</script>
