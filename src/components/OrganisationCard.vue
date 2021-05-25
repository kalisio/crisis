<template>
  <k-card 
    v-bind="$props" 
    :header="header"
    :actions="itemActions" 
    :bind-actions="false">
    <!--
      Card avatar
    -->
    <template v-slot:card-avatar>
      <k-avatar class="q-pa-sm" :object="item" :contextId="item._id" size="4rem" />
    </template>
    <!--
      Card content
     -->
    <div slot="card-content">
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
              id= "organisation-catalog"
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
      <!-- Plans section -->
      <k-card-section v-if="canAccessPlans" icon="las la-stream" :title="$t('OrganisationCard.PLANS_LABEL')">
        <template slot="card-section-content">
          <k-list 
            service="plans" 
            :contextId="item._id" 
            :renderer="planRenderer"
            :list-strategy="'smart'" />
        </template>
      </k-card-section>
      <!-- Statistics section -->
      <q-expansion-item label="Statistiques" icon="las la-sitemap" @show="computeStatistics">
        <k-chart 
          v-if="hasStatistics"
          class="q-pa-xs" 
          :config="getStatisticsChartConfig()" />
      </q-expansion-item>
    </div>
  </k-card>
</template>

<script>
import logger from 'loglevel'
import { colors } from 'quasar'
import { permissions } from '@kalisio/kdk/core.common'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'organisation-card',
  mixins: [kCoreMixins.baseItem],
  data () {
    return {
      eventsCount: 0,
      header: null,
      hasStatistics: false,
      planRenderer: {
        component: 'collection/KItem',
        actions: [{
          id: 'view-plan',
          icon: 'las la-fire',
          tooltip: 'OrganisationCard.VIEW_EVENTS',
          handler: (context) => this.routeTo('events-activity', context.item._id)
        }, {
          id: 'view-plan',
          icon: 'las la-map',
          tooltip: 'OrganisationCard.VIEW_CATALOG',
          handler: (context) => this.routeTo('catalog-activity', context.item._id)
        },{
          id: 'view-plan',
          icon: 'las la-clipboard-list',
          tooltip: 'OrganisationCard.VIEW_ARCHIVED_EVENTS',
          handler: (context) => this.routeTo('archived-events-activity', context.item._id)
        }]
      }
    }
  },
  computed: {
    canAccessPlans () {
      return this.$can('service', 'plans', this.item._id)
    },
    canAccessCatalog () {
      return this.$can('update', 'catalog', this.item._id)
    },
    canAccessArchivedEvents () {
      return this.$can('service', 'archived-events', this.item._id)
    },
    canAccessBilling () {
      return this.$can('update', 'organisations', null, { _id: this.item._id })
    }
  },
  watch: {
    item: {
      immediate: true,
      handler () {
        this.header = [
          { component: 'QBadge', label: this.getUserRoleLabel(), color: 'grey-7' },
          { component: 'frame/KSpot', color: this.item.color, width: '20px', borderRadius: '5px' },
          { component: 'QSpace' },
          { 
            id: 'edit-organisation', icon: 'las la-edit', tooltip: 'OrganisationCard.EDIT_LABEL',
            visible: this.$can('update', 'organisations', null, { _id: this.item._id }),
            handler: this.editItem
          },
          {
            id: 'remove-organisation', icon: 'las la-trash', tooltip: 'OrganisationCard.REMOVE_LABEL',
            visible: this.$can('remove', 'organisations', null, { _id: this.item._id }),
            handler: () => this.removeItem('input')
          }
        ]
      }
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
    getStatisticsChartConfig () {
      return {
        type: 'horizontalBar',
        data: {
          labels: this.statistics.labels,
          datasets: [{
            tooltip: this.statistics.tooltip,
            data: this.statistics.data,
            backgroundColor: this.statistics.color
          }]
        },
        options: {
          legend: {
            display: false
          },
          responsive: true,
          scales: {
            xAxes: [{
              stacked: true,
              ticks: {
                min: 0,
                max: 100,
                callback: function(value){return value+ "%"}
              }
            }],
            yAxes: [{
              stacked: true,
              min: 0,
              max: 100
            }]
          },
          tooltips: {
            custom: function(tooltip) {
              if (!tooltip) return;
              tooltip.displayColors = false
            },
            callbacks: {
              label: function(tooltipItems, data) {
                return ' ' + data.datasets[tooltipItems.datasetIndex].tooltip[tooltipItems.index]
              }
            }
          }
        }
      }
    },
    async countItems (serviceName, query = {}) {
      const service = this.$api.getService(serviceName, this.item._id)
      const response = await service.find({ query, $limit: 0 })
      return response.total
    },
    async computeStatistics () {
      if (!this.hasStatistics) {
        this.statistics = {
          labels: [],
          tooltip: [],
          data: [],
          color: []
        }
        // Retrieve the billing perspective
        const perspective = await this.$api.getService('organisations').get(this.item._id, { query: { $select: ['billing'] } })
        const subscription = _.get(perspective, 'billing.subscription.plan')
        if (_.isEmpty(subscription)) {
          logger.debug('No subscription found for the organisation ID: ', this.item._id )
          return
        }
        // Retrieve the quotas
        const orgQuotas = _.get(perspective, 'billing.quotas')
        const appQuotas = this.$store.get('capabilities.api.quotas', {})
        if (_.isEmpty(appQuotas)) {
          logger.debug('No application quotas found')
          return
        }
        let quotas = appQuotas[subscription]
        _.merge(quotas, orgQuotas)
        // Compute the data 
        for (let i = 0; i < this.statisticsScopes.length; i++) {
          const scope = this.statisticsScopes[i]
          const scopeQuota = quotas[scope.name]
          if (scopeQuota !== 0) {
            const count = await this.countItems(scope.name)
            const percent = count * 100 / scopeQuota
            this.statistics.labels.push(this.$t(scope.key))
            this.statistics.tooltip.push(count + '/' + scopeQuota)
            this.statistics.data.push(percent)
            let color = colors.getBrand('positive')
            if (percent > 75) color = colors.getBrand('negative')
            else if (percent > 50) color = colors.getBrand('warning')
            this.statistics.color.push(color)
          }
        }
        this.hasStatistics = true
      }
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-chart'] = this.$load('frame/KChart')
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-list'] = this.$load('collection/KList')
    // Counts the number of events
    this.eventsCount = await this.countItems('events', { planId: { $eq: null } } )
    // Defines the statistics 
    this.statisticsScopes = [ 
      { key: 'OrganisationCard.MEMBERS', name: 'members', icon: 'las la-user-friends' },
      { key: 'OrganisationCard.TAGS', name: 'tags', icon: 'las la-tag' },
      { key: 'OrganisationCard.GROUPS', name: 'groups', icon: 'las la-sitemap' },
      { key: 'OrganisationCard.EVENT_TEMPLATES', name: 'event-templates', icon: 'las la-project-diagram' },
      { key: 'OrganisationCard.PLAN_TEMPLATES', name: 'plan-templates', icon: 'kdk:kanban.png' }
    ]
  }
}
</script>
