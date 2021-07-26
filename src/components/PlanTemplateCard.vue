<template>
  <k-card 
    v-bind="$props"
    :actions="itemActions" 
    :bind-actions="false">
    <!--
      Card content
     -->
    <template slot="card-content">
      <!-- Objectives section -->
      <k-card-section 
        :title="$t('PlanTemplateCard.OBJECTIVES_SECTION')" 
        :actions="objectivesActions" 
        :context="$props">
        <div v-if="hasObjectives">
          <k-chips-pane class="q-pl-sm" :chips="item.objectives" :value-path="'name'" />
        </div>
        <div v-else>
          {{ $t('PlanTemplateCard.NO_OBJECTIVES_LABEL')}}
        </div>
      </k-card-section>
      <!-- coordinators section -->
      <k-card-section 
        :title="$t('PlanTemplateCard.COORDINATORS_SECTION')" 
        :actions="coordinatorsActions" 
        :context="$props">
        <div v-if="hasCoordinators">
          <k-chips-pane class="q-pl-sm" :chips="item.coordinators" valuePath="profile.name" />
        </div>
        <div v-else>
          {{ $t('PlanTemplateCard.NO_COORDINATORS_LABEL')}}
        </div>
      </k-card-section>
    </template>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-template-card',
  mixins: [kCoreMixins.baseItem],
  computed: {
    objectivesActions () {
      return _.filter(this.itemActions, { scope: 'objectives'})
    },
    hasObjectives () {
      return !_.isEmpty(this.item.objectives)
    },
    coordinatorsActions () {
      return _.filter(this.itemActions, { scope: 'coordinators'})
    },
    hasCoordinators () {
      return !_.isEmpty(this.item.coordinators)
    }
  },
  methods: {
    editObjectives () {
      this.$router.push({
        name: 'edit-plan-template-objectives', params: { objectId: this.item._id } 
      })
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-chips-pane'] = this.$load('frame/KChipsPane')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
  }
}
</script>