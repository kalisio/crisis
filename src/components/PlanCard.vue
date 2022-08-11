<template>
  <k-card
    v-bind="$props"
    :header="header"
    :actions="itemActions"
    :bind-actions="false">
    <!--
      Card content
     -->
    <template v-slot:card-content>
      <!-- Objectives section -->
      <k-card-section :title="$t('PlanCard.OBJECTIVES_SECTION')" :actions="objectivesActions">
        <k-chips-pane v-if="hasObjectives" class="q-pl-sm" :chips="item.objectives" :value-path="'name'" />
        <k-stamp v-else :text="'PlanCard.NO_OBJECTIVES_LABEL'" direction="horizontal" />
      </k-card-section>
      <!-- location section -->
      <k-card-section :title="$t('PlanCard.LOCATION_SECTION')" :actions="locationActions" :context="$props">
        <k-location-map v-if="item.location" v-model="item.location" :editable="false" style="min-height: 220px;" />
        <k-stamp v-else :text="'PlanCard.NO_LOCATION_LABEL'" direction="horizontal" />
      </k-card-section>
      <!-- coordinators section -->
      <k-card-section
        :title="$t('PlanCard.COORDINATORS_SECTION')"
        :actions="coordinatorsActions"
        :context="$props">
        <k-chips-pane class="q-pl-sm" :chips="item.coordinators" :value-path="['profile.name', 'value', 'name']" />
      </k-card-section>
      <!-- Events section -->
      <k-card-section :title="$t('PlanCard.EVENTS_SECTION')">
        <div class="full-width row justify-between items-center no-wrap">
          <k-action
            id= "plan-events"
            icon= "las la-fire"
            :label="$t('PlanCard.EVENTS', { count: eventsCount })"
            :route="{ name: 'events-activity', params: { contextId }, query: { plan: item._id } }" />
          <q-space />
          <k-action
            v-if="canAccessCatalog"
            id= "plan-catalog"
            icon= "las la-map"
            :tooltip="$t('PlanCard.VIEW_CATALOG')"
            :route="{ name: 'catalog-activity', params: { contextId }, query: { plan: item._id } }" />
          <k-action
            v-if="canAccessArchivedEvents"
            id= "plan-archived-events"
            icon= "las la-clipboard-list"
            :tooltip="$t('PlanCard.VIEW_ARCHIVED_EVENTS')"
            :route="{ name: 'archived-events-activity', params: { contextId }, query: { plan: item._id } }"  />
        </div>
      </k-card-section>
    </template>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-card',
  mixins: [kCoreMixins.baseItem],
  computed: {
    header () {
      const components = _.filter(this.itemActions, { scope: 'header' })
      components.splice(0, 0,
        { component: 'QBadge', label: this.item.template, color: 'grey-7' },
        { component: 'QSpace' })
      return components
    },
    objectivesActions () {
      return _.filter(this.itemActions, { scope: 'objectives' })
    },
    hasObjectives () {
      return !_.isEmpty(this.item.objectives)
    },
    locationActions () {
      return _.filter(this.itemActions, { scope: 'location' })
    },
    coordinatorsActions () {
      return _.filter(this.itemActions, { scope: 'coordinators' })
    },
    canAccessCatalog () {
      return this.$can('update', 'catalog', this.contextId)
    },
    canAccessArchivedEvents () {
      return this.$can('read', 'archived-events', this.contextId)
    },
    canAccessBilling () {
      return this.$can('update', 'organisations', null, { _id: this.contextId })
    }
  },
  data () {
    return {
      eventsCount: 0
    }
  },
  methods: {
    editObjectives () {
      this.$router.push({
        name: 'edit-plan-objectives', params: { objectId: this.item._id }
      })
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
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
