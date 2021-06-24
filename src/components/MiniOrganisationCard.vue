<template>
  <div v-if="organisationId">
    <k-card-section :title="$t('OrganisationCard.EVENTS_SECTION')" :dense="dense">
      <!-- Events section -->
      <q-item 
        id="organisation-events" 
        dense 
        clickable 
        @click="() => this.routeTo('events-activity')">
        <q-item-section avatar>
          <q-icon name="las la-fire" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('OrganisationCard.EVENTS_LABEL', { count: eventsCount }) }}</q-item-label>
          <q-tooltip>{{ $t('OrganisationCard.VIEW_EVENTS') }}</q-tooltip>
        </q-item-section>
        <q-item-section side>
          <div class="row justify-between">
            <k-action 
              v-if="canAccessCatalog"
              id="organisation-catalog"
              icon= "las la-map"
              :tooltip="$t('OrganisationCard.VIEW_CATALOG')"
              :handler="() => this.routeTo('catalog-activity')" 
              :propagate="false" />
            <k-action
              v-if="canAccessArchivedEvents"
              id= "organisation-archived-events"
              icon= "las la-clipboard-list"
              :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_EVENTS')"
              :handler="() => this.routeTo('archived-events-activity')" 
              :propagate="false" />
          </div>
        </q-item-section>
      </q-item>
    </k-card-section>
    <!-- Plans section -->
    <k-card-section v-if="canAccessPlans" :title="$t('OrganisationCard.PLANS_SECTION')" :dense="dense">
      <q-item 
        id="organisation-plans" 
        dense 
        clickable 
        @click="() => this.routeTo('plans-activity')">
        <q-item-section avatar>
          <q-icon name="las la-stream" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('OrganisationCard.PLANS_LABEL', { count: plansCount }) }}</q-item-label>
          <q-tooltip>{{ $t('OrganisationCard.VIEW_PLANS') }}</q-tooltip>
        </q-item-section>
        <q-item-section side>
          <div class="row justify-between">
            <k-action
              v-if="canAccessArchivedPlans"
              id= "organisation-archived-plans"
              icon= "las la-archive"
              :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_PLANS')"
              :handler="() => this.routeTo('archived-plans-activity')" 
              :propagate="false" />
          </div>
        </q-item-section>
      </q-item>
    </k-card-section>
  </div>
</template>

<script>
export default {
  name: 'mini-organisation-card',
  props: {
    organisationId: {
      type: String,
      required: true
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      eventsCount: 0,
      plansCount: 0,
    }
  },
  computed: {
    canAccessPlans () {
      return this.$can('service', 'plans', this.organisationId)
    },
    canAccessArchivedPlans () {
      return this.$can('service', 'archived-plans', this.organisationId)
    },
    canAccessCatalog () {
      return this.$can('update', 'catalog', this.organisationId)
    },
    canAccessArchivedEvents () {
      return this.$can('service', 'archived-events', this.organisationId)
    }
  },
  methods: {
    routeTo (activity) {
      const route = { name: activity, params: { contextId: this.organisationId } }
      this.$router.push(route)
    },
    async countItems (serviceName, query = {}) {
      const service = this.$api.getService(serviceName, this.organisationId)
      const response = await service.find({ query, $limit: 0 })
      return response.total
    }
  },
  beforeCreate () {
     // Load the required components
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-action'] = this.$load('frame/KAction')
  },
  async created () {
    // Counts the number of orphan events
    this.eventsCount = await this.countItems('events', { plan: { $eq: null } } )
    this.plansCount = await this.countItems('plans', { plan: { $eq: null } } )
  }
}
</script>

