<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Templates collection
      -->
      <k-grid
        ref="plansGrid"
        service="plans"
        :renderer="renderer"
        :contextId="contextId"
        :base-query="sorter.query"
        :filter-query="filterQuery"
        :list-strategy="'smart'">
        <template slot="empty-section">
          <div class="absolute-center">
            <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_GRID')" />
          </div>
        </template>
      </k-grid>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="plans"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import { permissions } from '@kalisio/kdk/core.common'
import * as utils from '../utils'

const activityMixin = kCoreMixins.baseActivity()

export default {
  name: 'plans-activity',
  mixins: [activityMixin],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: undefined
    }
  },
  data () {
    return {
      sorter: this.$store.get('sorter'),
      filter: this.$store.get('filter'),
      // Can't use a computed as we have async operations here
      filterQuery: {},
      // Make this configurable from app
      renderer: _.merge({
        component: 'PlanCard'
      }, this.activityOptions.items)
    }
  },
  methods: {
    async updateFilterQuery () {
      this.filterQuery = _.clone(this.filter.query)
      const userRole = permissions.getRoleForOrganisation(this.$store.get('user'), this.contextId)
      // We'd like to only display plans where the user has events except if manager who can see all
      if (permissions.isJuniorRole(userRole, 'manager')) {
        const values = await this.$api.getService('archived-events').find({
          query: Object.assign({ $distinct: 'plan' }, utils.getEventsQuery(this.$store.get('user'), this.contextId))
        })
        // Or he his a coordinator of
        Object.assign(this.filterQuery, {
          $or: [
            { _id: { $in: values } },
            utils.getPlansQuery(this.$store.get('user'), this.contextId)
          ]
        })
      }
    },
    async configureActivity () {
      activityMixin.methods.configureActivity.call(this)
      // Fab actions
      const userRole = permissions.getRoleForOrganisation(this.$store.get('user'), this.contextId)
      if (this.$can('create', 'plans', this.contextId)) {
        const actions = []
        const planTemplatesService = this.$api.getService('plan-templates')
        let response = await planTemplatesService.find({ query: { $limit: 0 } })
        const batchSize = 50
        let batchCount = Math.floor(response.total / batchSize)
        const remainder = response.total % batchSize
        if (remainder > 0) batchCount++
        let offset = 0
        for (let i = 0; i < batchCount; i++) {
          response = await planTemplatesService.find({
            query: {
              $or: [
                { permission: { $exists: false } },
                { permission: { $in: permissions.getJuniorRoles(userRole) } }
              ],
              $skip: offset,
              $limit: batchSize,
              $select: ['name', 'icon']
            }
          })
          const templates = response.data
          templates.forEach(template => {
            // It is easier to access the DOM with template names, eg in tests, so we use it as action name whenever possible
            // However we have to check about duplicated names
            const doublons = templates.filter(otherTemplate => otherTemplate.name.toLowerCase() === template.name.toLowerCase())
            actions.push({
              id: 'create-' + (doublons.length > 1 ? template._id : _.kebabCase(template.name)),
              label: template.name,
              icon: template.icon.name,
              color: template.icon.color,
              route: { name: 'create-plan', params: { contextId: this.contextId, templateId: template._id } }
            })
          })
          offset = offset + batchSize
        }
        this.setFab(actions)
      }
      if (this.mode) this.setTopPaneMode(this.mode)
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  },
  async created () {
    this.$events.$on('user-changed', this.configureActivity)
    // Build base query
    await this.updateFilterQuery()
    // Keep track of changes once loaded
    const eventsService = this.$api.getService('events', this.contextId)
    eventsService.on('created', this.updateFilterQuery)
    eventsService.on('patched', this.updateFilterQuery)
    eventsService.on('updated', this.updateFilterQuery)
    eventsService.on('removed', this.updateFilterQuery)
    this.$events.$on('filter-changed', this.updateFilterQuery)

    // Check if option has been subscribed
    this.$checkBillingOption('archiving')
  },
  beforeUnmount () {
    this.$events.$off('user-changed', this.configureActivity)
    const eventsService = this.$api.getService('events', this.contextId)
    eventsService.off('created', this.updateFilterQuery)
    eventsService.off('patched', this.updateFilterQuery)
    eventsService.off('updated', this.updateFilterQuery)
    eventsService.off('removed', this.updateFilterQuery)
    this.$events.$off('filter-changed', this.updateFilterQuery)
  }
}
</script>
