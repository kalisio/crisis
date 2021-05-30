import _ from 'lodash'

const plansMixin = {
  data () {
    return {
      planId: null,
      plan: null
    }
  },
  watch:{
    $route (to, from) {
      this.refreshPlan()
    }
  },
  methods: {
    hasLocation () {
      return _.has(this.plan, 'location.latitude') && _.has(this.plan, 'location.longitude')
    },
    hasObjectives () {
      return (_.get(this.plan, 'objectives', []).length > 0)
    },
    async loadPlan (planId) {
      if (!planId) this.plan = null
      else this.plan = await this.$api.getService('plans', this.contextId).get(planId)
    },
    planQuery () {
      return {
        plan: _.isEmpty(this.planId) ? { $eq: null } : this.planId
      }
    },
    async refreshPlan () {
      this.planId = _.get(this.$route, 'query.plan', null)
      await this.loadPlan(this.planId)
    }
  }
}

export default plansMixin
