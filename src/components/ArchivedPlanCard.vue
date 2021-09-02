<template>
  <k-card 
    v-bind="$props" 
    :header="header" 
    :actions="itemActions" 
    :bind-actions="false"
    :dense="dense"
    :expandable="true"      
    @expanded="isExpanded = true"
    @collapsed="isExpanded = false"
  >
    <!--
      Card content
     -->
    <template slot="card-content">
      <!-- Objectives section -->
      <k-card-section 
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.OBJECTIVES_SECTION')"
        :context="$props"
        :dense="dense"
      >
        <k-chips-pane v-if="item.objectives" class="q-pl-sm" :chips="item.objectives" :value-path="'name'" />
        <k-stamp v-else :text="'ArchivedPlanCard.NO_OBJECTIVES_LABEL'" direction="horizontal" />
      </k-card-section>
      <!-- location section -->
      <k-card-section 
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.LOCATION_SECTION')" 
        :context="$props"
        :dense="dense"
      >
        <k-location-map v-if="item.location" v-model="item.location" :editable="false" style="min-height: 220px;" />
        <k-stamp v-else :text="'ArchivedPlanCard.NO_LOCATION_LABEL'" direction="horizontal" />
      </k-card-section>
      <!-- coordinators section -->
      <k-card-section 
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.COORDINATORS_SECTION')" 
        :context="$props">
        <k-chips-pane class="q-pl-sm" :chips="item.coordinators" :valuePath="['profile.name', 'value', 'name']" />
      </k-card-section>
    </template>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'archived-plan-card',
  mixins: [kCoreMixins.baseItem],
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    header () {
      let components = []
      if (this.item.deletedAt) {
        const deletedAtDate =  new Date(this.item.deletedAt).toLocaleString()
        components.push({ component: 'QBadge', label: this.$t('ArchivedPlanCard.CLOSED_LABEL'), color: 'black' })
      } else {
        const updatedAtDate =  new Date(this.item.updatedAt).toLocaleString()
        components.push({ component: 'QBadge', label: this.$t('ArchivedPlanCard.OPENED_LABEL'), color: 'green-7' })
      }
      components.push({ component: 'QSpace '})
      components.concat(_.filter(this.itemActions, { scope: 'header' }))
      return components
    }
  },
  data () {
    return {
      isExpanded: false
    }
  },
  methods: {
    getLocationMap () {
      return { 
        component: 'KLocationMap', 
        value: this.item.location, 
        editable: false, 
        style: 'min-width: 360px; max-width: 360px; min-height: 360px; max-height: 360px;' 
      }
    },
  },
  beforeCreate () {
     // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-chips-pane'] = this.$load('frame/KChipsPane')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
  }
}
</script>
