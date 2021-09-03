<template>
  <k-page padding @content-resized="onPageContentResized">
    <template v-slot:page-content>
      <!--
        Page content
       -->
      <div class="row justify-center q-pa-lg">
        <k-history
          v-if="height"
          id="history"
          service="archived-plans" 
          :append-items="true" 
          :base-query="baseQuery"
          :filter-query="filter.query" 
          :renderer="renderer" 
          :contextId="contextId" 
          :height="height">
          <template slot="empty-history">
            <div class="absolute-center">
              <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KHistory.EMPTY_HISTORY')" />
            </div>
          </template>
        </k-history>
      </div>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="archived-plans"></router-view>
    </template>
  </k-page>
</template>

<script>
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import * as utils from '../utils'

export default {
  name: 'archived-plans-activity',
  mixins: [kCoreMixins.baseActivity()],
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  computed: {
    renderer () {
      return _.merge({
        component: 'ArchivedPlanCard',
        service: 'archived-plans',
        dense: this.$q.screen.lt.sm
      }, this.activityOptions.items)
    }
  },
  data () {
    return {
      // Make this configurable from app
      filter: this.$store.get('filter'),
      sorter: this.$store.get('sorter'),
      baseQuery: _.clone(this.$store.get('sorter')),
      height: undefined
    }
  },
  methods: {
    async updateBaseQuery () {
      this.baseQuery = _.clone(this.sorter.query)
      // We'd like to only display plans where the user has events
      const values = await this.$api.getService('archived-events').find({
        query: Object.assign({ $distinct: 'plan' }, utils.getEventsQuery(this.$store.get('user'), this.contextId))
      })
      Object.assign(this.baseQuery, { _id: { $in: values } })
    },
    onPageContentResized (size) {
      this.height = size.height - 110
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-history'] = this.$load('collection/KHistory')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  },
  async created () {
    // Build base query
    await this.updateBaseQuery()
    // Keep track of changes once loaded
    const eventsService = this.$api.getService('events', this.contextId)
    eventsService.on('created', this.updateBaseQuery)
    eventsService.on('patched', this.updateBaseQuery)
    eventsService.on('updated', this.updateBaseQuery)
  },
  beforeDestroy () {
    const eventsService = this.$api.getService('events', this.contextId)
    eventsService.on('created', this.updateCounts)
    eventsService.on('patched', this.updateCounts)
    eventsService.on('updated', this.updateCounts)
  }
}
</script>
