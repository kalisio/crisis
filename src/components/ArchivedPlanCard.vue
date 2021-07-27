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
        :key="item + '-objectives'"
        :hide-header="!isExpanded"
        :title="$t('ArchivedPlanCard.OBJECTIVES_SECTION')"
        :context="$props"
        :dense="dense"
      >
        <k-chips-pane :chips="item.objectives" />
      </k-card-section>
      <!-- location section -->
      <k-card-section 
        :key="item + '-location'"
        :hide-header="!isExpanded"
        :title="$t('ArchivedPlanCard.LOCATION_SECTION')" 
        :context="$props"
        :dense="dense"
      >
        <div v-if="item.location" class="row items-center justify-between no-wrap">
          <k-text-area class="light-paragraph" :text="item.location.name" />
          <k-popup-action 
            id="location-map" 
            icon="las la-map-marker" 
            tooltip="ArchivedPlanCard.VIEW_LOCATION_MAP" 
            :content="[ getLocationMap() ]" />
        </div>
        <div v-else>
          <k-stamp :text="'ArchivedPlanCard.NO_LOCATION_LABEL'" direction="horizontal" />
        </div>
      </k-card-section>
      <!-- coordinators section -->
      <k-card-section 
        :title="$t('ArchivedPlanCard.COORDINATORS_SECTION')" 
        :hide-header="!isExpanded"
        :context="$props">
        <k-chips-pane 
          class="q-pl-sm" 
          :chips="item.coordinators" 
          :valuePath="['profile.name', 'value', 'name']" />
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
      let components = _.filter(this.itemActions, { scope: 'header' })
      components.splice(0, 0, 
        { component: 'QBadge', label: this.item.template, color: 'grey-7' },
        { component: 'QSpace' })
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
    this.$options.components['k-popup-action'] = this.$load('frame/KPopupAction')
  }
}
</script>
