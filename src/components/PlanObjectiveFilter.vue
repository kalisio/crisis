<template>
  <k-action
    id="plan-objective-filter"
    icon="las la-filter"
    :color="filters.length > 0 ? 'accent' : 'grey-7'">
    <template v-slot:content>
      <q-popup-proxy
        id="plan-objective-filter-popup"
        transition-show="scale"
        transition-hide="scale">
        <q-option-group
          class="q-pl-xs q-pr-md bg-white"
          v-model="filters"
          :options="options"
          type="toggle" />
      </q-popup-proxy>
    </template>
  </k-action>
</template>

<script>
import { QOptionGroup } from 'quasar'
import mixins from '../mixins'

export default {
  name: 'plan-objective-filter',
  mixins: [
    mixins.plans
  ],
  components: {
    QOptionGroup
  },
  inject: ['kActivity'],
  data () {
    return {
      filters: this.kActivity.objectiveFilters,
      options: []
    }
  },
  watch: {
    plan: {
      handler: function (plan) {
        if (plan) this.options = _.get(plan, 'objectives', []).map(objective => ({ label: objective, value: objective }))
      },
      immediate: true
    },
    filters: function (filters) {
      this.kActivity.objectiveFilters = filters
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
  }
}
</script>
