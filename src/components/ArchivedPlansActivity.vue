<template>
  <KPage padding @content-resized="onPageContentResized">
    <!--
      Page content
      -->
    <div class="row justify-center q-pa-lg">
      <KHistory
        v-if="height"
        id="history"
        service="archived-plans"
        :append-items="true"
        :base-query="baseQuery"
        :filter-query="filterQuery"
        :renderer="renderer"
        date-field="updatedAt"
        :contextId="contextId"
        :width="width"
        :height="height"
      >
        <template v-slot:empty-history>
          <div class="absolute-center">
            <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KHistory.EMPTY_HISTORY')" />
          </div>
        </template>
      </KHistory>
    </div>
    <!--
      Router view to enable routing to modals
    -->
    <router-view service="archived-plans"></router-view>
  </KPage>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mixins as kCoreMixins, Time } from '@kalisio/kdk/core.client'
import { permissions } from '@kalisio/kdk/core.common'
import * as utils from '../utils'

export default {
  mixins: [kCoreMixins.baseActivity('archivedPlansActivity')],
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
      this.width = size.width
    }
  },
  async created () {
    // Setup current time to now
    this.currentTime = Time.getCurrentTime()
    Time.setCurrentTime(moment.now())
    // Build base query
    await this.updateFilterQuery()
    // Keep track of changes once loaded
    const eventsService = this.$api.getService('events', this.contextId)
    eventsService.on('created', this.updateFilterQuery)
    eventsService.on('patched', this.updateFilterQuery)
    eventsService.on('updated', this.updateFilterQuery)
    eventsService.on('removed', this.updateFilterQuery)
  },
  mounted () {
    // Check if we can create archived plans
    this.$checkQuota('archived-plans', 1)
  },
  beforeUnmount () {
    // Restore the current time
    Time.setCurrentTime(this.currentTime)
    // Releases listeners
    const eventsService = this.$api.getService('events', this.contextId)
    eventsService.off('created', this.updateFilterQuery)
    eventsService.off('patched', this.updateFilterQuery)
    eventsService.off('updated', this.updateFilterQuery)
    eventsService.off('removed', this.updateFilterQuery)
  }
}
</script>
