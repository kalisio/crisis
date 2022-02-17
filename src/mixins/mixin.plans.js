import _ from 'lodash'

const plansMixin = {
  data () {
    return {
      planId: null,
      plan: null,
      objectiveFilters: []
    }
  },
  watch: {
    $route (to, from) {
      this.refreshPlanId()
    }
  },
  methods: {
    hasPlan () {
      return this.planId
    },
    hasPlanLocation () {
      return _.has(this.plan, 'location.latitude') && _.has(this.plan, 'location.longitude')
    },
    hasPlanObjectives () {
      return (_.get(this.plan, 'objectives', []).length > 0)
    },
    async loadPlan (query = {}) {
      if (!this.planId) {
        this.plan = null
      } else {
        this.plan = await this.$api.getService(this.planService, this.contextId).get(this.planId, { query })
      }
    },
    onPlanUpdated (plan) {
      if (this.plan && (plan._id === this.plan._id)) {
        this.plan = plan
      }
    },
    onPlanRemoved (plan) {
      if (this.plan && (plan._id === this.plan._id)) {
        this.plan = null
        this.planId = null
      }
    },
    getPlanQuery () {
      const query = {}
      if (!_.isEmpty(this.planId)) {
        Object.assign(query, {
          plan: this.planId
        })
      }
      return query
    },
    refreshPlanId () {
      const planId = _.get(this.$route, 'query.plan', null)
      if (this.planId !== planId) this.planId = planId
    },
    getPlanObjectiveQuery () {
      if (_.isEmpty(this.objectiveFilters)) return {}
      else return { objective: { $in: this.objectiveFilters } }
    },
    async countEvents (query = {}) {
      const eventsService = this.$api.getService('archived-events')
      const response = await eventsService.find({ query: Object.assign(query, this.getPlanQuery()), $limit: 0 })
      return response.total
    },
    async countClosedEvents (query = {}) {
      const eventsService = this.$api.getService('archived-events')
      const response = await eventsService.find({ query: Object.assign(query, { deletedAt: { $exists: true } }, this.getPlanQuery()), $limit: 0 })
      return response.total
    }
  },
  created () {
    // Jump to archive whenever required
    this.planService = (_.get(this.$route, 'name').includes('archived') ? 'archived-plans' : 'plans')
    this.refreshPlanId()
    const plansService = this.$api.getService(this.planService, this.contextId)
    // Keep track of changes once plan is loaded
    plansService.on('patched', this.onPlanUpdated)
    plansService.on('updated', this.onPlanUpdated)
    plansService.on('removed', this.onPlanRemoved)
  },
  beforeDestroy () {
    const plansService = this.$api.getService(this.planService, this.contextId)
    plansService.off('patched', this.onPlanUpdated)
    plansService.off('updated', this.onPlanUpdated)
    plansService.off('removed', this.onPlanRemoved)
  }
}

export default plansMixin
