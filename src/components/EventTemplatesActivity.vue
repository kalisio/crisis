<template>
  <KPage padding>
    <template v-slot:page-content>
      <!--
        Templates collection
      -->
      <k-grid
        ref="eventTemplatesGrid"
        service="event-templates"
        :renderer="renderer"
        :contextId="contextId"
        :base-query="sorter.query"
        :filter-query="filter.query"
        :list-strategy="'smart'">
        <template v-slot:empty-section>
          <div class="absolute-center">
            <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_GRID')" />
          </div>
        </template>
      </k-grid>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="event-templates"></router-view>
    </template>
  </KPage>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  mixins: [kCoreMixins.baseActivity('eventTemplatesActivity')],
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
        component: 'EventTemplateCard'
      }, this.activityOptions.items)
    }
  }
}
</script>
