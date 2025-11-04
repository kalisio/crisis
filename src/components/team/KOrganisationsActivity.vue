<template>
  <KPage padding>
    <!--
      Organisations collection
    -->
    <KGrid
      ref="organisationsGrid"
      service="organisations"
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
    <router-view service="organisations"></router-view>
  </KPage>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  mixins: [kCoreMixins.baseActivity('organisationsActivity')],
  data () {
    return {
      sorter: this.$store.get('sorter'),
      filter: this.$store.get('filter'),
      // Make this configurable from app
      renderer: _.merge({
        component: 'collection/KCard'
      }, this.activityOptions.items)
    }
  }
}
</script>
