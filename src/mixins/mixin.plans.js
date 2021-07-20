import _ from 'lodash'

const plansMixin = {
  data () {
    return {
      planId: null,
      plan: null,
      objectiveFilters: []
    }
  },
  watch:{
    $route (to, from) {
      this.refreshPlan()
    }
  },
  methods: {
    hasPlan () {
      return _.has(this.$route, 'query.plan')
    },
    hasPlanLocation () {
      return _.has(this.plan, 'location.latitude') && _.has(this.plan, 'location.longitude')
    },
    hasPlanObjectives () {
      return (_.get(this.plan, 'objective', []).length > 0)
    },
    async loadPlan (planId) {
      if (!planId) this.plan = null
      else this.plan = await this.$api.getService('plans', this.contextId).get(planId)
    },
    getPlanQuery () {
      return {
        plan: _.isEmpty(this.planId) ? { $eq: null } : this.planId
      }
    },
    async refreshPlan () {
      this.planId = _.get(this.$route, 'query.plan', null)
      await this.loadPlan(this.planId)
    },
    getPlanObjectiveQuery () {
      if (_.isEmpty(this.objectiveFilters)) return {}
      else return { objective: { $in: this.objectiveFilters } }
    }
  },
  created () {
    this.refreshPlan()
  }
}

export default plansMixin
