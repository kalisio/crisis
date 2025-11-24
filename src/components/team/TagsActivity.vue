<template>
  <KPage padding>
    <!--
      Groups collection
    -->
    <KGrid
      ref="tagsGrid"
      :contextId="contextId"
      service="tags"
      :renderer="renderer"
      :base-query="sorter.query"
      :filter-query="filter.query"
      :list-strategy="'smart'">
      <template v-slot:empty-section>
        <div class="absolute-center">
          <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_LABEL')" />
        </div>
      </template>
    </KGrid>
    <!--
      Router view to enable routing to modals
    -->
    <router-view service="tags"></router-view>
  </KPage>
</template>

<script>
import _ from 'lodash'
import { Exporter, mixins as kCoreMixins } from '@kalisio/kdk/core.client'

const activityName = 'tagsActivity'
const activityMixin = kCoreMixins.baseActivity(activityName)

export default {
  name: activityName,
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
        component: 'team/TagCard'
      }, this.activityOptions.items)
    }
  },
  methods: {
    exportTags () {
      Exporter.export({
        service: 'tags',
        context: this.contextId,
        formats: [
          { label: 'CSV', format: 'csv' },
          { label: 'JSON', format: 'json' }
        ],
        gzip: false
      })
    }
  }
}
</script>
