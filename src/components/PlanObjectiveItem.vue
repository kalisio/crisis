<template>
  <div class="row full-width justify-between no-wrap">
    <div class="ellipsis" style="max-width: 60vw">{{ name }}
      <q-tooltip>
        <span v-html="description" />
      </q-tooltip>
    </div>
    <KPanel id="item-actions" :content="itemActions" :context="$props" />
  </div>
</template>

<script>
import { mixins } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-objective-item',
  mixins: [mixins.baseItem]
}
</script>
