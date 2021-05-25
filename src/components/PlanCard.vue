<template>
  <k-card 
    v-bind="$props" 
    :header="header" 
    :actions="itemActions" 
    :bind-actions="false">
    <!--
      Card avatar
    -->
    <template v-slot:card-title>
      <q-item class="q-pa-md">
        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-medium">
            <k-text-area :text="item.name" />
          </q-item-label>
          <q-item-label>
            <k-text-area :text="item.description" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!--
      Card content
     -->
    <template slot="card-content">
      <!-- Objectives section -->
      <k-card-section icon="las la-dot-circle" :title="$t('PlanCard.OBJECTIVES_LABEL')" :actions="objectivesActions">
        <template slot="card-section-content">
          <div class="row justify-start items-center">
            <template v-for="objective in item.objectives">
              <q-chip
                :key="objective.value"
                :color="objective.icon ? objective.icon.color : black"
                text-color="white"
                dense
                outline
                square>
                <q-icon v-if="objective.icon" :name="objective.icon.name" />
                {{ objective.value }}
              </q-chip>
            </template>
          </div>
        </template>
      </k-card-section>
      <!--
        Location section
      -->
      <k-card-section icon="las la-map-marker" :title="$t('PlanCard.LOCATION_LABEL')" :actions="locationActions">
        <template slot="card-section-content">
          <k-location-map  v-if="item.location" v-model="item.location" :editable="false" />
          <div v-else>
            <k-stamp :text="'PlanCard.UNDEFINED_LOCATION_LABEL'" direction="horizontal" />
          </div>
        </template>
      </k-card-section>
      <!-- Events section -->
      <q-separator />
      <div class="q-pa-xs">
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
      </div>
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
    canEdit () {
      return this.$can('update', 'plans', this.contextId)
    },
    canRemove () {
      return this.$can('remove', 'plans', this.contextId)
    },
    canAccessCatalog () {
      return this.$can('update', 'catalog', this.contextId)
    },
    canAccessArchivedEvents () {
      return this.$can('service', 'archived-events', this.contextId)
    },
    canAccessBilling () {
      return this.$can('update', 'organisations', null, { _id: this.contextId })
    }
  },
  data () {
    return {
      eventsCount: 0,
      header: null,
      objectivesActions: [],
      locationActions: []
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
    // Count the number of events
    const service = this.$api.getService('events', this.contextId)
    const response = await service.find({ query: { planId: this.item._id }, $limit: 0 })
    this.eventsCount = response.total
    // Define the header
    this.header = [
      { component: 'QBadge', label: this.item.template, color: this.item.icon ? this.item.icon.color : 'grey-7' },
      { component: 'QSpace' },
      { 
        id: 'edit-plan', icon: 'las la-edit', tooltip: 'PlanCard.EDIT_ACTION',
        visible: this.$can('update', 'plans', this.contextId),
        handler: this.editItem
      },
      {
        id: 'remove-plan', icon: 'las la-trash', tooltip: 'PlanCard.REMOVE_LABEL',
        visible: this.$can('remove', 'plans', this.contextId),
        handler: () => this.removeItem('confirm')
      }
    ]
    // Define the actions
    this.objectivesActions.push(
      { id: 'edit-objectives', icon: 'las la-edit', tooltip: 'PlanCard.EDIT_ACTION' }
    )
    this.locationActions.push(
      { id: 'edit-location', icon: 'las la-edit', tooltip: 'PlanCard.EDIT_ACTION' }
    )
  }
}
</script>
