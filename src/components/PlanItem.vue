<template>
   <k-item
     v-bind="$props">
     <template v-slot:item-content>
       <q-item-section>
        <q-item-label>
          {{ name }}
          <q-tooltip>
            <div class="column q-gutter-y-sm">
              <div>{{ description }}</div>
              <div class="row iems-center">
                <template v-for="objective in objectives">
                  <q-badge :key="objective.value" :label="objective.value" color="grey-9" />
                </template>
              </div>
            </div>
          </q-tooltip>
        </q-item-label>
      </q-item-section>
     </template>
   </k-item>
</template>

<script>
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-item',
  mixins: [kCoreMixins.baseItem],
  data () {
    return {
      objectives: this.item.objectives
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-item'] = this.$load('collection/KItem')
  }
}
</script>
