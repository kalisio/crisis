<template>
  <KCard
    v-bind="$props"
    :header="header"
    :actions="itemActions"
    :bind-actions="false"
    :expandable="true"
    @expanded="onExpanded"
    @collapsed="isExpanded = false">
    <!--
      Card avatar
    -->
    <template v-slot:card-avatar>
      <KAvatar class="q-pa-sm" :object="item" :contextId="item._id" size="4rem" />
    </template>
    <!--
      Card content
     -->
    <template v-slot:card-content>
      <KCardSection
        :title="$t('OrganisationCard.EVENTS_SECTION')"
        :hide-header="!isExpanded"
      >
        <!-- Events section -->
        <div class="full-width row justify-between items-center no-wrap">
          <KAction
            id= "organisation-events"
            icon= "las la-fire"
            :label="$t('OrganisationCard.EVENTS_LABEL', { count: eventsCount })"
            @triggered="routeTo('events-activity')"
            style="max-width: 60%" 
          />
          <div>
            <KAction
              v-if="canAccessCatalog"
              id= "organisation-catalog"
              icon= "las la-map"
              :tooltip="$t('OrganisationCard.VIEW_CATALOG')"
              @triggered="routeTo('catalog-activity')"
            />
            <KAction
              v-if="canAccessArchivedEvents"
              id= "organisation-archived-events"
              icon= "las la-clipboard-list"
              :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_EVENTS')"
              @triggered="routeTo('archived-events-activity')"
            />
          </div>
        </div>
      </KCardSection>
      <!-- Plans section -->
      <KCardSection
        v-if="canAccessPlans"
        :title="$t('OrganisationCard.PLANS_SECTION')"
        :hide-header="!isExpanded"
      >
        <div class="full-width row justify-between items-center no-wrap">
          <KAction
            id= "organisation-plans"
            icon= "las la-stream"
            :label="$t('OrganisationCard.PLANS_LABEL', { count: plansCount })"
            @triggered="routeTo('plans-activity')"
            style="max-width: 75%"
          />
          <KAction
            v-if="canAccessArchivedPlans"
            id= "organisation-archived-plans"
            icon= "las la-archive"
            :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_PLANS')"
            @triggered="routeTo('archived-plans-activity')" 
          />
        </div>
      </KCardSection>
      <!-- Administation section -->
      <div v-if="isExpanded">
        <!-- Organisation section -->
        <KCardSection :title="isMember ? $t('OrganisationCard.INFORMATION_SECTION') : $t('OrganisationCard.ADMINISTRATION_SECTION')">
          <div class="q-pb-sm">
            <template v-for="element in structure" :key="element.key">
              <div class="full-width row justify-between items-center no-wrap">
                <KAction
                  :id="`organisation-${element.name}`"
                  :icon="element.icon"
                  :label="$t(`OrganisationCard.${element.key}`, { count: counters[element.name] })"
                  @triggered="routeTo(`${element.name}-activity`)"
                  style="max-width: 75%" 
                />
                <q-badge v-if="!isMember" :label="`${quotas[element.name]} max`" color="grey-7" />
              </div>
            </template>
          </div>
        </KCardSection>
        <!-- Billing section -->
        <KCardSection v-if="canAccessBilling" :title="$t('OrganisationCard.SUBSCRIPTIONS_LABEL')" :actions="[{
          id: 'edit-billing', icon: 'las la-edit', size: 'sm', tooltip: 'OrganisationCard.EDIT_ACTION',
          route: { name: 'edit-organisation-billing', params: { objectId: item._id, title: item.name } }
        }]">
            <div class="row items-center">
            <template v-for="subscription in subscriptions" :key="subscription">
              <div class="q-pl-sm">
                <q-badge :label="$t(`${subscription}_LABEL`)" color="grey-7" />
              </div>
            </template>
          </div>
        </KCardSection>
      </div>
    </template>
  </KCard>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { permissions } from '@kalisio/kdk/core.common'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import * as utils from '../utils'

export default {
  name: 'organisation-card',
  mixins: [kCoreMixins.baseItem],
  data () {
    return {
      isExpanded: false,
      eventsCount: 0,
      plansCount: 0,
      billing: null,
      quotas: {},
      counters: {},
      structure: [
        { key: 'MEMBERS', name: 'members', icon: 'las la-user-friends' },
        { key: 'TAGS', name: 'tags', icon: 'las la-tag' },
        { key: 'GROUPS', name: 'groups', icon: 'las la-sitemap' },
        { key: 'EVENT_TEMPLATES', name: 'event-templates', icon: 'las la-project-diagram' },
        { key: 'PLAN_TEMPLATES', name: 'plan-templates', icon: 'las la-stream' }
      ]
    }
  },
  computed: {
    header () {
      let components = [
        { component: 'QBadge', label: this.getUserRoleLabel(), color: 'grey-7' },
        { component: 'frame/KSpot', color: this.item.color, width: '20px', borderRadius: '5px' },
        { component: 'QSpace' }
      ]
      if (this.isExpanded) components = components.concat(_.filter(this.itemActions, { scope: 'header' }))
      return components
    },
    canAccessPlans () {
      return this.$can('service', 'plans', this.item._id)
    },
    canAccessArchivedPlans () {
      return this.$can('service', 'archived-plans', this.item._id)
    },
    canAccessCatalog () {
      return this.$can('update', 'catalog', this.item._id)
    },
    canAccessArchivedEvents () {
      return this.$can('service', 'archived-events', this.item._id)
    },
    canAccessBilling () {
      return this.$can('update', 'organisations', null, { _id: this.item._id })
    },
    subscriptions () {
      const plan = `plans.${_.get(this.billing, 'subscription.plan')}`
      const options = _.get(this.billing, 'options')
      if (options) return _.concat([plan], _.map(options, (option) => { return `options.${option.plan}` }))
      return [plan]
    },
    isMember () {
      const userRole = permissions.getRoleForOrganisation(this.$store.get('user'), this.item._id)
      return permissions.isJuniorRole(userRole, 'manager')
    }
  },
  methods: {
    routeTo (activity, planId = null) {
      let route = { name: activity, params: { contextId: this.item._id } }
      if (planId) route = Object.assign(route, { query: { plan: planId } })
      this.$router.push(route)
    },
    getUserRoleLabel () {
      const userRole = permissions.getRoleForOrganisation(this.$store.get('user'), this.item._id)
      return this.$t(_.upperCase(userRole))
    },
    async countItems (serviceName, query = {}) {
      const service = this.$api.getService(serviceName, this.item._id)
      const response = await service.find({ query, $limit: 0 })
      return response.total
    },
    async updateCounts () {
      // Counts the number of events (with and without plan)
      this.eventsCount = await this.countItems('events')
      // Then the number of plans the user has an event in except if manager who can see all
      const userRole = permissions.getRoleForOrganisation(this.$store.get('user'), this.item._id)
      let query = {}
      if (permissions.isJuniorRole(userRole, 'manager')) {
        const values = await this.$api.getService('archived-events', this.item._id).find({
          query: Object.assign({ $distinct: 'plan' }, utils.getEventsQuery(this.$store.get('user'), this.item._id))
        })
        // Or he his a coordinator of
        query = {
          $or: [
            { _id: { $in: values } },
            utils.getPlansQuery(this.$store.get('user'), this.item._id)
          ]
        }
      }
      this.plansCount = await this.countItems('plans', query)
    },
    async loadBilling () {
      const organisationsService = this.$api.getService('organisations')
      const response = await organisationsService.get(this.item._id, { query: { $select: ['billing'] } })
      this.billing = _.get(response, 'billing', null)
      if (!this.billing) {
        logger.debug('No billing found for the organisation ID: ', this.item._id)
      }
      if (!_.get(this.billing, 'subscription.plan')) {
        logger.debug('No subscription plan found for the organisation ID: ', this.item._id)
      }
    },
    async onExpanded () {
      // Retrieve the quotas
      await this.loadBilling()
      const subscription = this.billing.subscription.plan
      const orgQuotas = _.get(this.billing, 'quotas')
      const appQuotas = this.$store.get('capabilities.api.quotas', {})
      if (_.isEmpty(appQuotas)) {
        logger.debug('No application quotas found')
        return
      }
      this.quotas = appQuotas[subscription]
      _.merge(this.quota, orgQuotas)
      // Counts the different elements
      for (let i = 0; i < this.structure.length; ++i) {
        const service = this.structure[i].name
        this.counters[service] = await this.countItems(service)
      }
      this.isExpanded = true
    }
  },
  async created () {
    await this.updateCounts()
    // Keep track of changes once loaded
    const eventsService = this.$api.getService('events', this.item._id)
    eventsService.on('created', this.updateCounts)
    eventsService.on('patched', this.updateCounts)
    eventsService.on('updated', this.updateCounts)
    eventsService.on('removed', this.updateCounts)
    const plansService = this.$api.getService('plans', this.item._id)
    plansService.on('created', this.updateCounts)
    plansService.on('patched', this.updateCounts)
    plansService.on('updated', this.updateCounts)
    plansService.on('removed', this.updateCounts)
  },
  beforeUnmount () {
    const eventsService = this.$api.getService('events', this.item._id)
    eventsService.off('created', this.updateCounts)
    eventsService.off('patched', this.updateCounts)
    eventsService.off('updated', this.updateCounts)
    eventsService.off('removed', this.updateCounts)
    const plansService = this.$api.getService('plans', this.item._id)
    plansService.off('created', this.updateCounts)
    plansService.off('patched', this.updateCounts)
    plansService.off('updated', this.updateCounts)
    plansService.off('removed', this.updateCounts)
  }
}
</script>
