<template>
  <k-card v-bind="$props" :actions="itemActions" :bind-actions="false">
    <template v-slot:card-label>
      <span class="text-subtitle1 text-weight-medium ellipsis-2-lines">{{ name }}</span>
    </template>
    <!--
      Card content
     -->
    <template slot="card-content">
      <!-- Objectives section -->
      <k-card-section icon="las la-dot-circle" :title="$t('PlanCard.OBJECTIVES_LABEL')" :actions="objectivesActions">
        <template slot="card-section-content">
          <k-tags-pane class="q-pl-sm" :tags="item.objectives" />
        </template>
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
  data () {
    return {
      objectivesActions: []
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-tags-pane'] = this.$load('team/KTagsPane')
  },
  created () {
    // Define the actions
    this.objectivesActions.push({ 
      id: 'edit-objectives', icon: 'las la-edit', tooltip: 'PlanTemplateCard.EDIT_LABEL', 
      visible: this.$can('update', 'plan-templates', this.contextId, this.item),
      route: { name: 'edit-template-plan-objectives', params: { contextId: this.contextId, objectId: this.item._id } }
    })
  }
}
</script>