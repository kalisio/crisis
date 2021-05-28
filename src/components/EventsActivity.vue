<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Events collection
      -->
      <k-grid
        ref="eventsGrid"
        service="events" 
        :renderer="renderer" 
        :contextId="contextId"
        :base-query="baseQuery" 
        :filter-query="filterQuery" 
        :list-strategy="'smart'">
        <template slot="empty-section">
          <div class="absolute-center">
            <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_GRID')" />
          </div>
        </template>
      </k-grid>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="events"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

const activityMixin = kCoreMixins.baseActivity()

export default {
  name: 'events-activity',
  mixins: [
    activityMixin,
    mixins.plans
  ],
  provide () {
    return {
      kActivity: this
    }
  },
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
        component: 'EventCard'
      }, this.activityOptions.items)
    }
  },
  computed: {
    baseQuery () {
      let query = _.clone(this.sorter.query)
      Object.assign(query, this.getPlanQuery())
      return query
    },
    filterQuery () {
      let query = _.clone(this.filter.query)
      Object.assign(query, this.getPlanObjectiveQuery())
      return query
    }
  },
  watch: {
    async $route (to, from) {
      // Need to refresh the fab because the plan has probably changed
      await this.refreshFab()
    }
  },
  methods: {
    async configureActivity () {
      activityMixin.methods.configureActivity.call(this)
      this.refreshFab()
    },
    async refreshFab () {
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
              route: { 
                name: 'create-event', 
                params: { contextId: this.contextId, templateId: template._id }, 
                query: this.planId ? { plan: this.planId } : {} 
              }
            })
          })
          offset = offset + batchSize
        }
        this.setFab(actions)
      }
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    // Handle plan
    await this.refreshPlan()
  }
}
</script>
