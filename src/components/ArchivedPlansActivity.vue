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
      sorter: this.$store.get('sorter'),
      height: undefined
    }
  },
  methods: {
    onPageContentResized (size) {
      this.height = size.height - 110
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-history'] = this.$load('collection/KHistory')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  }
}
</script>
