<template>
  <KAction
    id="event-filter"
    icon="las la-filter"
    :color="filters.length > 0 ? 'accent' : 'grey-7'">
    <q-popup-proxy
      id="event-filter-popup"
      transition-show="scale"
      transition-hide="scale">
      <q-option-group
        class="q-pl-xs q-pr-md bg-white"
        v-model="filters"
        :options="options"
        type="toggle" />
    </q-popup-proxy>
  </KAction>
</template>

<script>
import { QOptionGroup } from 'quasar'

export default {
  name: 'event-filter',
  components: {
    QOptionGroup
  },
  inject: ['kActivity'],
  data () {
    return {
      filters: this.kActivity.filters,
      options: []
    }
  },
  watch: {
    filters: function (filters) {
      this.kActivity.filters = filters
    }
  },
  async created () {
    // Intiializes the options
    this.options = [
      { label: this.$t('EventFilter.OPEN'), value: 'open' },
      { label: this.$t('EventFilter.CLOSED'), value: 'closed' }
    ]
  }
}
</script>
