<template>
  <k-card 
    v-bind="$props"
    :header="header"
    :actions="itemActions" 
    :bind-actions="false">
    <!-- 
      Card label
      -->
    <template v-slot:card-label>
      <span class="text-subtitle1 text-weight-medium ellipsis-2-lines" style="overflow: hidden">
        {{ name }}
      </span>
    </template>
    <!--
      Card content
     -->
    <template slot="card-content">
      <!-- Description -->
      <k-card-section :title="$t('EventTemplateCard.DESCRIPTION_SECTION')" :actions="descriptionActions">
        <div v-if="hasDescription">
          <k-text-area :text="item.description" />
        </div>
        <div v-else> 
          {{ $t('EventTemplateCard.NO_DESRIPTION_LABEL')}}
        </div>
      </k-card-section>
       <!-- coordinators section -->
      <k-card-section :title="$t('EventTemplateCard.PARTICIPANTS_SECTION')" :actions="participantsActions">
        <div v-if="hasParticipants">
          <k-chips-pane class="q-pl-sm" :chips="item.participants" valuePath="profile.name" />
        </div>
        <div v-else>
          {{ $t('EventTemplateCard.NO_PARTICIPANTS_LABEL')}}
        </div>
      </k-card-section>
      <!-- coordinators section -->
      <k-card-section :title="$t('PlanTemplateCard.COORDINATORS_SECTION')" :actions="coordinatorsActions">
        <div v-if="hasCoordinators">
          <k-chips-pane class="q-pl-sm" :chips="item.coordinators" valuePath="profile.name" />
        </div>
        <div v-else>
          {{ $t('PlanTemplateCard.NO_COORDINATORS_LABEL')}}
        </div>
      </k-card-section>
      <!-- Workflow section -->
      <k-card-section :title="$t('EventTemplateCard.WORKFLOW_SECTION')" :actions="workflowActions">
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
    header () {
      return [
        { component: 'QSpace' },
        { 
          id: 'edit-event-template', icon: 'las la-edit', size: 'sm', tooltip: 'EventTemplateCard.EDIT_ACTION',
          visible: this.$can('update', 'event-templates', this.contextId, this.item),
          handler: this.editItem
        },
        {
          id: 'remove-event-template', icon: 'las la-trash', size: 'sm', tooltip: 'EventTemplateCard.REMOVE_ACTION',
          visible: this.$can('remove', 'event-templates', this.contextId, this.item),
          handler: () => this.removeItem('confirm')
        }
      ]
    },
    descriptionActions () {
      return [{ 
        id: 'edit-description', icon: 'las la-edit', size: 'sm', tooltip: 'EventCard.EDIT_ACTION', 
        visible: this.$can('update', 'event-templates', this.contextId, this.item),
        route: { name: 'edit-event-template-description', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    hasDescription () {
      return !_.isEmpty(this.item.description)
    },
    participantsActions () {
      return [{
        id: 'edit-participants', icon: 'las la-edit', size: 'sm', tooltip: 'EventTemplateCard.EDIT_ACTION', 
        visible: this.$can('update', 'event-templates', this.contextId, this.item),
        route: { name: 'edit-event-template-coordinators', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    hasParticipants () {
      return !_.isEmpty(this.item.participants)
    },
    coordinatorsActions () {
      return [{
        id: 'edit-coordinators', icon: 'las la-edit', size: 'sm', tooltip: 'EventTemplateCard.EDIT_ACTION', 
        visible: this.$can('update', 'event-templates', this.contextId, this.item),
        route: { name: 'edit-event-template-coordinators', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    hasCoordinators () {
      return !_.isEmpty(this.item.coordinators)
    },
    workflowActions () {
      return [{
        id: 'edit-workflow', icon: 'las la-edit', size: 'sm', tooltip: 'EventTemplateCard.EDIT_ACTION', 
        visible: this.$can('update', 'event-templates', this.contextId, this.item),
        route: { name: 'edit-event-template-workflow', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
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
