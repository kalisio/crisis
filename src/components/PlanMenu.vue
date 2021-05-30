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
      this.refreshMenu()
    }
  },
  methods: {
    async refreshMenu () {
      const contextId = this.$store.get('context')._id
      this.entries = []
      // Get the current plan
      this.planId = _.get(this.$route, 'query.plan', null)
      // If no plan set the menu to the NO PLAN entry
      // Otherwise add the entry in the menu
      if (!this.planId) {
        this.label = 'PlanMenu.NO_PLAN'
        this.icon = 'las la-times'
      } else {
        this.entries.push({
        id: 'no-plan',
        icon: 'las la-times',
        label: 'PlanMenu.NO_PLAN',
        route: { name: this.$route.name, params: { contextId } }
      }) 
      }
      // Add the plans to the entries
      const plansService = this.$api.getService('plans', contextId)
      const response = await plansService.find({})
      // Build the menu entries
      _.forEach(response.data, plan => {
        if (plan._id != this.planId) {
          this.entries.unshift({
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
      // Finaly add the entry to the plan activity
      this.entries.push({
        id: 'plans',
        icon: 'las la-stream',
        label: 'PlanMenu.PLANS',
        route: { name: 'plans-activity', params: { contextId } }
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-menu'] = this.$load('menu/KMenu')
    // Setup the menu
    this.refreshMenu()
  } 
}
</script>
