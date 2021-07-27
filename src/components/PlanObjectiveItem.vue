<template>
  <q-item>
    <!--
      Content section
    -->
    <slot name="item-content">
      <q-item-section @click="onItemSelected('content')">
        <q-item-label>{{ name }}
          <q-tooltip>
            {{ description }}
          </q-tooltip>
        </q-item-label>
      </q-item-section>
    </slot>
    <!--
      Actions section
    -->
    <slot name="item-actions">
      <q-item-section side>
        <k-panel id="item-actions" :content="itemActions" :context="$props" />
      </q-item-section>
    </slot>
  </q-item>
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
