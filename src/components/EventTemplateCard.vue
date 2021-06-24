<template>
  <k-card 
    v-bind="$props"
    :actions="itemActions" 
    :bind-actions="false">
    <!--
      Card content
     -->
    <template slot="card-content">
       <!-- Participants section -->
      <k-card-section 
        :title="$t('EventTemplateCard.PARTICIPANTS_SECTION')" 
        :actions="participantsActions" 
        :context="$props">
        <div v-if="hasParticipants">
          <k-chips-pane class="q-pl-sm" :chips="item.participants" valuePath="profile.name" />
        </div>
        <div v-else>
          {{ $t('EventTemplateCard.NO_PARTICIPANTS_LABEL')}}
        </div>
      </k-card-section>
      <!-- Coordinators section -->
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
      <!-- Workflow section -->
      <k-card-section 
        :title="$t('EventTemplateCard.WORKFLOW_SECTION')" 
        :actions="workflowActions" 
        :context="$props">
         <div v-if="hasWorkflow">
           {{ $t('EventTemplateCard.WORKFLOW_LABEL', { count: item.workflow.length }) }}
        </div>
        <div v-else>
          {{ $t('EventTemplateCard.NO_WORKFLOW_LABEL')}}
        </div>
      </k-card-section>
    </template>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'event-template-card',
  mixins: [kCoreMixins.baseItem],
  computed: {
    participantsActions () {
      return _.filter(this.itemActions, { scope: 'participants'})
    },
    hasParticipants () {
      return !_.isEmpty(this.item.participants)
    },
    coordinatorsActions () {
      return _.filter(this.itemActions, { scope: 'coordinators'})
    },
    hasCoordinators () {
      return !_.isEmpty(this.item.coordinators)
    },
    workflowActions () {
      return _.filter(this.itemActions, { scope: 'workflow'})
    },
    hasWorkflow () {
      return !_.isEmpty(this.item.workflow)
    }
  },
  data () {
    return {
      step: 1
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
