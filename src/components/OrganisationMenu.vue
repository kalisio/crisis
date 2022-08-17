<template>
  <div v-if="organisation">
    <q-btn-dropdown
      id="organisation-menu"
      flat
      dense
      no-caps
      square
      menu-anchor="bottom middle"
      menu-self="top middle">
      <template v-slot:label>
        <div>
          <KAvatar
            id="organisation-avatar"
            :class="$q.screen.lt.sm ? 'q-pa-none' : 'q-pa-xs'"
            :object="organisation"
            :contextId="organisation._id"
            :size="$q.screen.lt.sm ? '1.5rem' : '2rem'" 
          />
        </div>
      </template>
      <template v-slot:default>
        <q-card class="bg-white" style="width: 300px;">
          <div class="row full-width justify-center q-pa-md text-subtitle1 bg-grey-4">
            {{ organisation.name }}
          </div>
          <KCardSection v-if="hasEventsSection">
            <!-- Events section -->
            <div class="full-width row justify-between items-center no-wrap">
              <KAction
                id= "organisation-events"
                icon= "las la-fire"
                :label="$t('OrganisationMenu.EVENTS_LABEL', { count: eventsCount })"
                @triggered="routeTo('events-activity')" 
              />
              <q-space />
              <KAction
                v-if="canAccessCatalog"
                id= "organisation-catalog"
                icon= "las la-map"
                :tooltip="$t('OrganisationMenu.VIEW_CATALOG')"
                @triggered="routeTo('catalog-activity')"  
              />
              <KAction
                v-if="canAccessArchivedEvents"
                id= "organisation-archived-events"
                icon= "las la-clipboard-list"
                :tooltip="$t('OrganisationMenu.VIEW_ARCHIVED_EVENTS')"
                @triggered="routeTo('archived-events-activity')"   
              />
            </div>
          </KCardSection>
          <!-- Plans section -->
          <KCardSection v-if="hasPlansSection && canAccessPlans">
            <div class="full-width row justify-between items-center no-wrap">
              <KAction
                id= "organisation-plans"
                icon= "las la-stream"
                :label="$t('OrganisationMenu.PLANS_LABEL', { count: plansCount })"
                @triggered="routeTo('plans-activity')" 
              />
              <q-space />
              <KAction
                v-if="canAccessArchivedPlans"
                id= "organisation-archived-plans"
                icon= "las la-archive"
                :tooltip="$t('OrganisationMenu.VIEW_ARCHIVED_PLANS')"
                @triggered="routeTo('archived-plans-activity')" 
              />
            </div>
          </KCardSection>
          <!-- Manage section -->
          <KCardSection v-if="hasManageSection && canManageOrganisation">
            <div class="row justify-center">
              <KAction
                id= "manage-organisation"
                icon= "las la-cog"
                size="md"
                :label="$t('OrganisationMenu.MANAGE_ORGANISATION')"
                @triggered="routeTo('members-activity')"
                :propagate="false" 
              />
            </div>
          </KCardSection>
        </q-card>
      </template>
    </q-btn-dropdown>
  </div>
</template>

<script>
import { QBtnDropdown } from 'quasar'
import { permissions } from '@kalisio/kdk/core.common'
import mixins from '../mixins'
import * as utils from '../utils'

export default {
  name: 'organisation-menu',
  components: {
    QBtnDropdown
  },
  mixins: [
    mixins.plans
  ],
  props: {
    mode: {
      type: String,
      required: true,
      validator: (value) => {
        return ['run', 'plan', 'admin'].includes(value)
      }
    }
  },
  data () {
    return {
      organisation: this.$store.get('context'),
      eventsCount: 0,
      plansCount: 0,
      planId: null
    }
  },
  computed: {
    hasEventsSection () {
      return this.mode === 'admin' ||
             this.mode === 'plan' ||
             (this.mode === 'run' && this.planId)
    },
    hasPlansSection () {
      return this.mode === 'admin' ||
             this.mode !== 'plan' ||
             (this.mode === 'run' && !this.planId)
    },
    hasManageSection () {
      return this.mode !== 'admin'
    },
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
    },
    async updateCounts () {
      // Counts the number of events (with and without plan)
      this.eventsCount = await this.countItems('events')
      // Then the number of plans the user has an event in except if manager who can see all
      const userRole = permissions.getRoleForOrganisation(this.$store.get('user'), this.organisation._id)
      let query = {}
      if (permissions.isJuniorRole(userRole, 'manager')) {
        const values = await this.$api.getService('archived-events', this.organisation._id).find({
          query: Object.assign({ $distinct: 'plan' }, utils.getEventsQuery(this.$store.get('user'), this.organisation._id))
        })
        // Or he his a coordinator of
        query = {
          $or: [
            { _id: { $in: values } },
            utils.getPlansQuery(this.$store.get('user'), this.organisation._id)
          ]
        }
      }
      this.plansCount = await this.countItems('plans', query)
    }
  },
  async created () {
    await this.updateCounts()
    // Keep track of changes once loaded
    const eventsService = this.$api.getService('events', this.organisation._id)
    eventsService.on('created', this.updateCounts)
    eventsService.on('patched', this.updateCounts)
    eventsService.on('updated', this.updateCounts)
    eventsService.on('removed', this.updateCounts)
    const plansService = this.$api.getService('plans', this.organisation._id)
    plansService.on('created', this.updateCounts)
    plansService.on('patched', this.updateCounts)
    plansService.on('updated', this.updateCounts)
    plansService.on('removed', this.updateCounts)
  },
  beforeUnmount () {
    const eventsService = this.$api.getService('events', this.organisation._id)
    eventsService.off('created', this.updateCounts)
    eventsService.off('patched', this.updateCounts)
    eventsService.off('updated', this.updateCounts)
    eventsService.off('removed', this.updateCounts)
    const plansService = this.$api.getService('plans', this.organisation._id)
    plansService.off('created', this.updateCounts)
    plansService.off('patched', this.updateCounts)
    plansService.off('updated', this.updateCounts)
    plansService.off('removed', this.updateCounts)
  }
}
</script>
