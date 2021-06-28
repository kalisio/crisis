<template>
  <div v-if="organisation">
    <k-card-section :title="$t('OrganisationCard.EVENTS_SECTION')" :dense="dense">
      <!-- Events section -->
      <div class="full-width row justify-between items-center no-wrap">
        <k-action 
          id= "organisation-events"
          icon= "las la-fire"
          :label="$t('OrganisationCard.EVENTS_LABEL', { count: eventsCount })"
          @triggered="routeTo('events-activity')" />
        <q-space />
        <k-action 
          v-if="canAccessCatalog"
          id= "organisation-catalog"
          icon= "las la-map"
          :tooltip="$t('OrganisationCard.VIEW_CATALOG')"
          @triggered="routeTo('catalog-activity')"  />
        <k-action
          v-if="canAccessArchivedEvents"
          id= "organisation-archived-events"
          icon= "las la-clipboard-list"
          :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_EVENTS')"
          @triggered="routeTo('archived-events-activity')"   />
      </div>
    </k-card-section>
    <!-- Plans section -->
    <k-card-section v-if="canAccessPlans" :title="$t('OrganisationCard.PLANS_SECTION')" :dense="dense">
      <div class="full-width row justify-between items-center no-wrap">
        <k-action 
          id= "organisation-plans"
          icon= "las la-stream"
          :label="$t('OrganisationCard.PLANS_LABEL', { count: plansCount })"
          @triggered="routeTo('plans-activity')" />
        <q-space />
        <k-action
          v-if="canAccessArchivedPlans"
          id= "organisation-archived-plans"
          icon= "las la-archive"
          :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_PLANS')"
          @triggered="routeTo('archived-plans-activity')" />
      </div>
    </k-card-section>
    <k-card-section v-if="canManageOrganisation" :title="$t('OrganisationCard.PLANS_SECTION')" :dense="dense">
      <div class="row justify-center">
        <k-action
          id= "manage-organisation"
          icon= "las la-cog"
          size="md"
          :label="$t('MiniOrganisationCard.MANAGE_ORGANISATION_ACTION')"
          :handler="() => this.routeTo('members-activity')" 
          :propagate="false" />
      </div>
    </k-card-section>
  </div>
</template>

<script>
export default {
  name: 'mini-organisation-card',
  props: {
    organisation: {
      type: Object,
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
      return this.$can('service', 'plans', this.organisation._id)
    },
    canAccessArchivedPlans () {
      return this.$can('service', 'archived-plans', this.organisation._id)
    },
    canAccessCatalog () {
      return this.$can('update', 'catalog', this.organisation._id)
    },
    canAccessArchivedEvents () {
      return this.$can('service', 'archived-events', this.organisation._id)
    },
    canManageOrganisation () {
      return this.$can('update', 'organisations', null, this.organisation)
    }
  },
  methods: {
    routeTo (activity) {
      const route = { name: activity, params: { contextId: this.organisation._id } }
      this.$router.push(route)
    },
    async countItems (serviceName, query = {}) {
      const service = this.$api.getService(serviceName, this.organisation._id)
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

