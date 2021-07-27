<template>
  <div class="row full-width justify-between">
    <span>{{ name }}
      <q-tooltip>
        <span v-html="description" />
      </q-tooltip>
    </span>
    <k-panel id="item-actions" :content="itemActions" :context="$props" />
  </div>
</template>

<script>
import { mixins } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-objective-item',
  mixins: [mixins.baseItem],
  created () {
    // Loads the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  }
}
</script>
