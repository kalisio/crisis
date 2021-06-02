<template>
  <div v-if="organisation">
    <div v-if="menu">
      <div v-if="entries.length > 0">
        <q-btn-dropdown 
          flat
          no-caps
          fab-mini
          menu-anchor="bottom left"
          menu-self="top left">
          <template v-slot:label>
            <div>
              <k-avatar 
                :class="$q.screen.lt.sm ? 'q-pa-none' : 'q-pa-xs'" 
                :object="currentObject" 
                :contextId="organisation._id"
                :size="$q.screen.lt.sm ? '1.8rem' : '2rem'" />
            </div>
          </template>
          <template v-slot:default>
            <k-panel
              id="menu-entries"
              :content="entries"
              action-renderer="item"
              direction="vertical" />
          </template>
        </q-btn-dropdown>
      </div>
    </div>
    <div v-else>
      <k-avatar 
        :class="$q.screen.lt.sm ? 'q-pa-xs' : 'q-pa-sm'" 
        :object="organisation" 
        :contextId="organisation._id"
        :size="$q.screen.lt.sm ? '2rem' : '2.2rem'" />
    </div>
  </div>
</template>
  
</template>

<script>
import { QBtnDropdown } from 'quasar'
import mixins from '../mixins'

export default {
  name: 'k-organisation-avatar',
  mixins: [
    mixins.plans
  ],
  components: {
    QBtnDropdown
  },
  props: {
    menu: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      organisation: this.$store.get('context'),
      currentObject: this.$store.get('context'),
      entries: []
    }
  },
  watch:{
    $route: {
      async handler (to, from) {
        await this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    async refresh () {
      this.organisation = this.$store.get('context')
      this.currentObject = this.organisation
      this.entries = []
      const planId = _.get(this.$route, 'query.plan', null)
      // If no plan set the menu to the NO PLAN entry
      // Otherwise add the entry in the menu
      if (planId) {
        this.entries.push({
          id: 'no-plan',
          icon: 'las la-times',
          label: 'PlanMenu.NO_PLAN',
          route: { name: this.$route.name, params: { contextId: this.organisation._id } }
        }) 
      }
      // Add the plans to the entries
      const plansService = this.$api.getService('plans', this.organisation._id)
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
          this.currentObject = plan
        }
      })
      // Finaly add the entry to the plan activity
      this.entries.push({
        id: 'plans',
        icon: 'las la-stream',
        label: 'PlanMenu.PLANS',
        route: { name: 'plans-activity', params: { contextId: this.organisation._id } }
      })
    }
  },
  beforeCreate () {
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  }
}
</script>