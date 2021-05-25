<template>
  <k-page padding>
    <template v-slot:page-content>
     
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
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
  }
}
</script>
