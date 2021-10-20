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
          :filter-query="filterQuery" 
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
import { permissions } from '@kalisio/kdk/core.common'
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
      baseQuery: { $sort: { createdAt: -1 } },
      filterQuery: {},
      height: undefined
    }
  },
  methods: {
    async updateFilterQuery () {
      const userRole = permissions.getRoleForOrganisation(this.$store.get('user'), this.contextId)
      // We'd like to only display plans where the user has events except if manager who can see all
      if (permissions.isJuniorRole(userRole, 'manager')) {
        const values = await this.$api.getService('archived-events').find({
          query: Object.assign({ $distinct: 'plan' }, utils.getEventsQuery(this.$store.get('user'), this.contextId))
        })
        // Or he his a coordinator of
        this.filterQuery = {
          $or: [
            { _id: { $in: values } },
            utils.getPlansQuery(this.$store.get('user'), this.contextId)
          ]
        }
      }
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
    await this.updateFilterQuery()
    // Keep track of changes once loaded
    const eventsService = this.$api.getService('events', this.contextId)
    eventsService.on('created', this.updateFilterQuery)
    eventsService.on('patched', this.updateFilterQuery)
    eventsService.on('updated', this.updateFilterQuery)
    eventsService.on('removed', this.updateFilterQuery)
    
    // Check if option has been subscribed
    this.$checkBillingOption('archiving')
  },
  beforeDestroy () {
    const eventsService = this.$api.getService('events', this.contextId)
    eventsService.off('created', this.updateFilterQuery)
    eventsService.off('patched', this.updateFilterQuery)
    eventsService.off('updated', this.updateFilterQuery)
    eventsService.off('removed', this.updateFilterQuery)
  }
}
</script>
