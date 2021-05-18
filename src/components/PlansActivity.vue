<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Templates collection
      -->
      <k-grid 
        ref="plansGrid"
        service="plans" 
        :renderer="renderer" 
        :contextId="contextId"
        :base-query="sorter.query" 
        :filter-query="filter.query" 
        :list-strategy="'smart'" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="plans"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

const activityMixin = kCoreMixins.baseActivity()

export default {
  name: 'plans-activity',
  mixins: [activityMixin],
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sorter: this.$store.get('sorter'),
      filter: this.$store.get('filter'),
      // Make this configurable from app
      renderer: _.merge({
        component: 'PlanCard'
      }, this.activityOptions.items)
    }
  },
  methods: {
    async configureActivity () {
      activityMixin.methods.configureActivity.call(this)
      // Fab actions
      if (this.$can('create', 'plans', this.contextId)) {
        const actions = []
        const planTemplatesService = this.$api.getService('plan-templates')
        let response = await planTemplatesService.find({
          query: { $limit: 0 }
        })
        const batchSize = 50
        let batchCount = Math.floor(response.total, batchSize)
        const remainder = response.total % batchSize
        if (remainder > 0) batchCount++
        let offset = 0
        for (let i = 0; i < batchCount; i++) {
          response = await planTemplatesService.find({
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
              icon: 'las la-plus',
              color: template.color,
              route: { name: 'create-plan', params: { contextId: this.contextId, templateId: template._id } }
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
