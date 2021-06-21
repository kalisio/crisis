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
      <k-card-section :title="$t('PlanTemplateCard.DESCRIPTION_SECTION')" :actions="descriptionActions">
        <div v-if="hasDescription">
          <k-text-area :text="item.description" />
        </div>
        <div v-else> 
          {{ $t('PlanTemplateCard.NO_DESRIPTION_LABEL')}}
        </div>
      </k-card-section>
      <!-- Objectives section -->
      <k-card-section :title="$t('PlanTemplateCard.OBJECTIVES_SECTION')" :actions="objectivesActions">
        <div v-if="hasObjectives">
          <k-chips-pane class="q-pl-sm" :chips="item.objectives" />
        </div>
        <div v-else>
          {{ $t('PlanTemplateCard.NO_OBJECTIVES_LABEL')}}
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
    header () {
      return [
        { component: 'QSpace' },
        { 
          id: 'edit-plan-template', icon: 'las la-edit', size: 'sm', tooltip: 'PlanTemplateCard.EDIT_ACTION',
          visible: this.$can('update', 'plan-templates', this.contextId, this.item),
          handler: this.editItem
        },
        {
          id: 'remove-plan-template', icon: 'las la-trash', size: 'sm', tooltip: 'PlanTemplateCard.REMOVE_ACTION',
          visible: this.$can('remove', 'plan-templates', this.contextId, this.item),
          handler: () => this.removeItem('confirm')
        }
      ]
    },
    descriptionActions () {
      return [{ 
        id: 'edit-description', icon: 'las la-edit', size: 'sm', tooltip: 'PlanTemplateCard.EDIT_ACTION', 
        visible: this.$can('update', 'plan-templates', this.contextId, this.item),
        route: { name: 'edit-plan-template-description', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    hasDescription () {
      return !_.isEmpty(this.item.description)
    },
    objectivesActions () {
      return [{
        id: 'edit-objectives', icon: 'las la-edit', size: 'sm', tooltip: 'PlanTemplateCard.EDIT_ACTION', 
        visible: this.$can('update', 'plan-templates', this.contextId, this.item),
        route: { name: 'edit-plan-template-objectives', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    hasObjectives () {
      return !_.isEmpty(this.item.description)
    },
    coordinatorsActions () {
      return [{
        id: 'edit-coordinators', icon: 'las la-edit', size: 'sm', tooltip: 'PlanTemplateCard.EDIT_ACTION', 
        visible: this.$can('update', 'plan-templates', this.contextId, this.item),
        route: { name: 'edit-plan-template-coordinators', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    hasCoordinators () {
      return !_.isEmpty(this.item.coordinators)
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