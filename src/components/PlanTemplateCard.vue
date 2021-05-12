<template>
  <k-card v-bind="$props" :actions="itemActions" :bind-actions="false">
    <template v-slot:card-label>
      <span class="text-subtitle1 text-weight-medium ellipsis-2-lines">{{ name }}</span>
    </template>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-template-card',
  mixins: [kCoreMixins.baseItem],
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
  }
}
</script>