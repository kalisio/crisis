<template>
  <k-card v-bind="$props" :actions="itemActions" :bind-actions="false" style="min-width: 330px">
    <!--
      Card header
    -->
    <template v-slot:card-header>
      <div v-if="userRole" class="q-pa-sm row justify-between">
        <div>
          <div v-if="hasColor" :style="`width: 20px; height: 20px; border-radius: 10px; background-color: ${color};`" />
        </div>
        <q-badge id="organisation-role-badge" color="grey-7">
          {{ $t(userRole) }}
        </q-badge>
      </div>
    </template>
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
        @click.native.prevent="$router.push({ name: 'events-activity', params: { contextId: item._id } })">
        <q-item-section avatar>
          <q-icon name="las la-fire" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ $t('OrganisationCard.EVENTS', { count: eventsCount }) }}</q-item-label>
          <q-tooltip>{{ $t('OrganisationCard.VIEW_EVENTS') }}</q-tooltip>
        </q-item-section>
        <q-item-section side>
          <div class="row justify-between">
            <k-action 
              v-if="canAccessPlans"
              id= "organisation-plans"
              icon= "kdk:kanban.png"
              :tooltip="$t('OrganisationCard.VIEW_PLANS')"
              :route="{ name: 'plans-activity', params: { contextId: this.item._id } }" 
              :propagate="false" />
            <k-action 
              v-if="canAccessCatalog"
              id= "organisation-catalog"
              icon= "las la-map"
              :tooltip="$t('OrganisationCard.VIEW_CATALOG')"
              :route="{ name: 'catalog-activity', params: { contextId: this.item._id } }" 
              :propagate="false" />
            <k-action
              v-if="canAccessArchivedEvents"
              id= "organisation-archived-events"
              icon= "las la-clipboard-list"
              :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_EVENTS')"
              :route="{ name: 'archived-events-activity', params: { contextId: this.item._id } }" 
              :propagate="false" />
          </div>
        </q-item-section>
      </q-item>
      <!-- Statistics section -->
      <q-expansion-item label="Statistiques" icon="las la-chart-bar" @show="computeStatistics">
        <k-chart 
          v-if="hasStatistics"
          class="q-pa-xs" 
          type="horizontalBar" 
          :data="chartData" 
          :options="chartOptions" />
      </q-expansion-item>
    </div>
  </k-card>
</template>

<script>
import logger from 'loglevel'
import _, { reduce } from 'lodash'
import { colors } from 'quasar'
import { permissions } from '@kalisio/kdk/core.common'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'organisation-card',
  mixins: [kCoreMixins.baseItem],
  data () {
    return {
      userRole: null,
      eventsCount: 0,
      hasStatistics: false,
      chartData: {
        labels: [],
        datasets: [{
          tooltip: [],
          data: [],
          backgroundColor: []
        }]
      },
      chartOptions: {
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
  computed: {
    hasColor () {
      return !_.isEmpty(this.color)
    },
    color () {
      return _.get(this.item, 'color')
    },
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
  methods: {
    async countItems (serviceName) {
      const service = this.$api.getService(serviceName, this.item._id)
      const response = await service.find({ query: {}, $limit: 0 })
      return response.total
    },
    async computeStatistics () {
      if (!this.hasStatistics) {
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
            this.chartData.labels.push(this.$t(scope.key))
            this.chartData.datasets[0].tooltip.push(count + '/' + scopeQuota)
            this.chartData.datasets[0].data.push(percent)
            let color = colors.getBrand('positive')
            if (percent > 75) color = colors.getBrand('negative')
            else if (percent > 50) color = colors.getBrand('warning')
            this.chartData.datasets[0].backgroundColor.push(color)
          }
        }
        this.hasStatistics = true
      }
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-chart'] = this.$load('frame/KChart')
    this.$options.components['k-action'] = this.$load('frame/KAction')
      // Retrieve the user role
    this.userRole = _.upperCase(permissions.getRoleForOrganisation(this.$store.get('user'), this.item._id))
    // Counts the number of events
    this.eventsCount = await this.countItems('events')
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
