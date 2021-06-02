<template>
  <div v-if="hasMenu">
    <k-menu
      id="plan-selector"
      :label="label"
      :icon="icon"
      :color="color"
      :size="size"
      :content="entries" 
      actionRenderer="item" />
  </div>
  <div v-else>
    <k-stamp :text="label" :icon="icon" :icon-size="size" direction="horizontal" :class="`text-${color}`" />
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'plan-menu',
  props: {
    icon: {
      type: String,
      default: undefined
    },
    label: {
      type: String,
      default: undefined
    },
    color: {
      type: String,
      default: 'grey-9'
    },
    size: {
      type: String,
      default: 'sm'
    }
  },
  data () {
    return {
      entries: []
    }
  },
  computed: {
    hasMenu () {
      return this.entries.length > 0
    }
  },
  watch:{
    $route: {
      handler () {
        this.refreshMenu()
      },
      immediate: true
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
      if (this.planId) {
        this.entries.push({
          id: 'no-plan',
          icon: 'las la-times',
          label: 'PlanMenu.NO_PLAN_LABEL',
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
        }
      })
    }
  },
  beforeCreate () {
    this.$options.components['k-menu'] = this.$load('menu/KMenu')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
  } 
}
</script>
