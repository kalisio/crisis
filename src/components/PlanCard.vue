<template>
  <KCard
    v-bind="$props"
    :header="header"
    :actions="itemActions"
    :bind-actions="false">
    <!--
      Card content
     -->
    <template v-slot:card-content>
      <!-- Objectives section -->
      <KCardSection :title="$t('PlanCard.OBJECTIVES_SECTION')" :actions="objectivesActions">
        <k-chips-pane v-if="hasObjectives" class="q-pl-sm" :chips="item.objectives" :value-path="'name'" />
        <KStamp v-else :text="'PlanCard.NO_OBJECTIVES_LABEL'" direction="horizontal" />
      </KCardSection>
      <!-- location section -->
      <KCardSection :title="$t('PlanCard.LOCATION_SECTION')" :actions="locationActions" :context="$props">
        <KLocationMap v-if="item.location" v-model="item.location" :editable="false" style="min-height: 220px;" />
        <KStamp v-else :text="'PlanCard.NO_LOCATION_LABEL'" direction="horizontal" />
      </KCardSection>
      <!-- coordinators section -->
      <KCardSection
        :title="$t('PlanCard.COORDINATORS_SECTION')"
        :actions="coordinatorsActions"
        :context="$props">
        <k-chips-pane class="q-pl-sm" :chips="item.coordinators" :value-path="['profile.name', 'value', 'name']" />
      </KCardSection>
      <!-- Events section -->
      <KCardSection :title="$t('PlanCard.EVENTS_SECTION')">
        <div class="full-width row justify-between items-center no-wrap">
          <KAction
            id="plan-events"
            icon="las la-fire"
            :label="$t('PlanCard.EVENTS', { count: eventsCount })"
            :route="{ name: 'events-activity', params: { contextId }, query: { plan: item._id } }"
          />
          <q-space />
          <KAction
            v-if="canAccessMap"
            id="plan-map"
            icon="las la-map"
            :tooltip="$t('PlanCard.VIEW_MAP')"
            :route="{ name: 'map-activity', params: { contextId }, query: { plan: item._id } }"
          />
          <KAction
            v-if="canAccessArchivedEvents"
            id="plan-archived-events"
            icon= "las la-clipboard-list"
            :tooltip="$t('PlanCard.VIEW_ARCHIVED_EVENTS')"
            :route="{ name: 'archived-events-activity', params: { contextId }, query: { plan: item._id } }"
          />
        </div>
      </KCardSection>
    </template>
  </KCard>
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
    canAccessMap () {
      return this.$can('read', 'catalog', this.contextId)
    },
    canAccessArchivedEvents () {
      return this.$can('read', 'archived-events', this.contextId)
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
  async created () {
    // Count the number of events
    const service = this.$api.getService('events', this.contextId)
    const response = await service.find({ query: { plan: this.item._id }, $limit: 0 })
    this.eventsCount = response.total
  }
}
</script>
