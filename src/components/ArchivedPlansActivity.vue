<template>
  <k-page padding>
    <template v-slot:page-content>
      <k-history
        id="history"
        class="q-pa-lg"
        style="padding-top: 50px" 
        service="archived-plans" 
        :nb-items-per-page="2" 
        :append-items="true" 
        :base-query="baseQuery"
        :filter-query="filter.query" 
        :renderer="renderer" 
        :contextId="contextId" 
        :list-strategy="'smart'">
        <template slot="empty-section">
          <div class="absolute-center">
            <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KHistory.EMPTY_HISTORY')" />
          </div>
        </template>>
      </k-history>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="archived-plans"></router-view>
    </template>
  </k-page>
</template>

<script>
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

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
    baseQuery () {
      let query = _.clone(this.sorter.query)
      return query
    }
  },
  data () {
    return {
      // Make this configurable from app
      renderer: _.merge({
        component: 'ArchivedPlanEntry'
      }, this.activityOptions.items),
      filter: this.$store.get('filter'),
      sorter: this.$store.get('sorter')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-history'] = this.$load('collection/KHistory')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>
