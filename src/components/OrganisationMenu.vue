<template>
  <div v-if="organisation">
    <q-btn-dropdown 
      flat
      dense
      no-caps
      square
      menu-anchor="bottom middle"
      menu-self="top middle">
      <template v-slot:label>
        <div>
          <k-avatar 
            :class="$q.screen.lt.sm ? 'q-pa-none' : 'q-pa-xs'" 
            :object="organisation" 
            :contextId="organisation._id"
            :size="$q.screen.lt.sm ? '1.5rem' : '2rem'" />
        </div>
      </template>
      <template v-slot:default>
        <q-card class="bg-white" style="width: 300px;">
          <div class="row full-width justify-center q-pa-md text-subtitle1 bg-grey-4">
            {{ organisation.name }}
          </div>
          <k-card-section>
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
          <k-card-section v-if="canAccessPlans">
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
          <k-card-section v-if="canManageOrganisation">
            <div class="row justify-center">
              <k-action
                id= "manage-organisation"
                icon= "las la-cog"
                size="md"
                :label="$t('MiniOrganisationCard.MANAGE_ORGANISATION_ACTION')"
                @triggered="routeTo('members-activity')" 
                :propagate="false" />
            </div>
          </k-card-section>
        </q-card>
      </template>
    </q-btn-dropdown>
  </div>
</template>
  
</template>

<script>
import { QBtnDropdown } from 'quasar'

export default {
  name: 'organisation-menu',
  components: {
    QBtnDropdown
  },
  data () {
    return {
      organisation: this.$store.get('context'),
      eventsCount: 0,
      plansCount: 0
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
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
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


