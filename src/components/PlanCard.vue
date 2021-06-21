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
        {{ item.name }}
      </span>
    </template>
    <!--
      Card content
     -->
    <template slot="card-content">
      <!-- Description -->
      <k-card-section :title="$t('PlanCard.DESCRIPTION_SECTION')" :actions="descriptionActions">
        <k-text-area :text="item.description" />
      </k-card-section>
      <!-- Objectives section -->
      <k-card-section :title="$t('PlanCard.OBJECTIVES_SECTION')" :actions="objectivesActions">
        <k-chips-pane :chips="item.objectives" />
      </k-card-section>
      <!-- location section -->
      <k-card-section :title="$t('PlanCard.LOCATION_SECTION')" :actions="locationActions">
        <k-location-map v-if="item.location" v-model="item.location" :editable="false" style="min-height: 220px;" />
        <div v-else>
          <k-stamp :text="'PlanCard.UNDEFINED_LOCATION_LABEL'" direction="horizontal" />
        </div>
      </k-card-section>
      <!-- Events section -->
      <k-card-section :title="$t('PlanCard.EVENTS_SECTION')">
        <div class="full-width row justify-between items-center no-wrap">
          <k-action 
            id= "plan-events"
            icon= "las la-fire"
            :label="$t('PlanCard.EVENTS', { count: eventsCount })"
            :route="{ name: 'events-activity', params: { contextId }, query: { plan: item._id } }"
            :dense="$q.screen.lt.sm ? true : false" />
          <q-space />
          <k-action 
            v-if="canAccessCatalog"
            id= "plan-catalog"
            icon= "las la-map"
            :tooltip="$t('PlanCard.VIEW_CATALOG')"
            :route="{ name: 'catalog-activity', params: { contextId }, query: { plan: item._id } }" 
            :dense="$q.screen.lt.sm ? true : false" />
          <k-action
            v-if="canAccessArchivedEvents"
            id= "plan-archived-events"
            icon= "las la-clipboard-list"
            :tooltip="$t('PlanCard.VIEW_ARCHIVED_EVENTS')"
            :route="{ name: 'archived-events-activity', params: { contextId }, query: { plan: item._id } }" 
            :dense="$q.screen.lt.sm ? true : false" />
        </div>
      </k-card-section>
    </template>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-card',
  mixins: [kCoreMixins.baseItem],
  computed: {
    header () {
      return [
        { component: 'QBadge', label: this.item.template, color: 'grey-7' },
        { component: 'QSpace' },
        { 
          id: 'edit-plan', icon: 'las la-edit', size: 'sm', tooltip: 'PlanCard.EDIT_ACTION',
          visible: this.$can('update', 'plans', this.contextId, this.item),
          handler: this.editItem
        },
        {
          id: 'remove-plan', icon: 'las la-trash', size: 'sm', tooltip: 'PlanCard.REMOVE_ACTION',
          visible: this.$can('remove', 'plans', this.contextId, this.item),
          handler: () => this.removeItem('confirm')
        }
      ]
    },
    canEdit () {
      return this.$can('update', 'plans', this.contextId, this.item)
    },
    canRemove () {
      return this.$can('remove', 'plans', this.contextId, this.item)
    },
    canAccessCatalog () {
      return this.$can('update', 'catalog', this.contextId)
    },
    canAccessArchivedEvents () {
      return this.$can('service', 'archived-events', this.contextId)
    },
    canAccessBilling () {
      return this.$can('update', 'organisations', null, { _id: this.contextId })
    },
    descriptionActions () {
      return [{ 
        id: 'edit-description', icon: 'las la-edit', size: 'sm', tooltip: 'PlanCard.EDIT_ACTION', 
        visible: this.$can('update', 'plans', this.contextId, this.item),
        route: { name: 'edit-plan-description', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    objectivesActions () {
      return [{
        id: 'edit-objectives', icon: 'las la-edit', size: 'sm', tooltip: 'PlanCard.EDIT_ACTION', 
        visible: this.$can('update', 'plans', this.contextId, this.item),
        route: { name: 'edit-plan-objectives', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    },
    locationActions () {
      return [{
        id: 'edit-location', icon: 'las la-edit', size: 'sm', tooltip: 'PlanCard.EDIT_ACTION',
        visible: this.$can('update', 'plans', this.contextId, this.item),
        route: { name: 'edit-plan-location', params: { contextId: this.contextId, objectId: this.item._id } }
      }]
    }
  },
  data () {
    return {
      eventsCount: 0
    }
  },
  beforeCreate () {
     // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-chips-pane'] = this.$load('frame/KChipsPane')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
  },
  async created () {
    // Count the number of events
    const service = this.$api.getService('events', this.contextId)
    const response = await service.find({ query: { plan: this.item._id }, $limit: 0 })
    this.eventsCount = response.total
  }
}
</script>
