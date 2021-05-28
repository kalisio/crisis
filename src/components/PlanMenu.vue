<template>
  <k-menu
    id="plan-selector"
    :label="label"
    :icon="icon"
    :content="entries" 
    actionRenderer="item" />
</template>

<script>
import _ from 'lodash'

export default {
  name: 'plan-menu',
  data () {
    return {
      label: '',
      icon: '',
      entries: []
    }
  },
  watch:{
    $route (to, from) {
      this.refresh()
    }
  },
  methods: {
    async refresh () {
      // Get the current plan
      this.planId = _.get(this.$route, 'query.plan', null)
      // List the plans
      const contextId = this.$store.get('context')._id
      const plansService = this.$api.getService('plans', contextId)
      const response = await plansService.find({})
      // Build the menu entries
      this.entries = []
      _.forEach(response.data, plan => {
        if (plan._id != this.planId) {
          this.entries.push({
            id: plan.name,
            icon: plan.icon.name,
            label: plan.name,
            route: { name: this.$route.name, params: this.$route.params, query: { plan: plan._id } }
          }) 
        } else {
          this.label = plan.name
          this.icon = plan.icon.name
        }
      })
      this.entries.push({
        id: 'plans',
        icon: 'las la-stream',
        label: 'PlanMenu.PLANS_LABEL',
        route: { name: 'plans-activity', params: { contextId } }
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-menu'] = this.$load('menu/KMenu')
    // Setup the menu
    this.refresh()
  } 
}
</script>
