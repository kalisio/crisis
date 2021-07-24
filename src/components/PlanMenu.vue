<template>
  <q-btn-dropdown v-if="plan"
    class="q-pl-sm ellipsis-2-lines"
    :label="label"
    :icon="icon"
    :size="size"
    flat
    dense
    no-caps
    square
    menu-anchor="bottom middle"
    menu-self="top middle">
    <template v-slot:default>
      <q-card class="bg-white" style="width: 300px;">
        <div class="row full-width justify-center items-center q-pa-md q-gutter-x-sm text-subtitle1 bg-grey-4">
          <k-avatar 
            :class="$q.screen.lt.sm ? 'q-pa-none' : 'q-pa-xs'" 
            :object="plan" 
            :contextId="organisation._id"
            size="sm" />
          <div>
            {{ plan.name }}
          </div>
        </div>
        <div class="q-pa-xs">
          <k-text-area class="light-paragraph q-pa-sm" :text="plan.description" />
          <!-- Objectives section -->
          <k-card-section>
            <template v-for="(objective, index) in plan.objectives">
              <div :key="objective" class="row full-width items-center justify-between">
                <q-toggle v-model="objectiveFilters[index]" :label="objective.value" />
              </div>
            </template>
          </k-card-section>
        </div>
      </q-card>
    </template>
  </q-btn-dropdown>
</template>

<script>
import _ from 'lodash'
import { QBtnDropdown } from 'quasar'
import mixins from '../mixins'

export default {
  name: 'plan-menu',
  mixins: [
    mixins.plans
  ],
  components: {
    QBtnDropdown
  },
  inject: ['kActivity'],
  computed: {
    label () {
      return (this.$q.screen.gt.sm && this.plan ? this.plan.name : '')
    },
    icon () {
      return _.get(this.plan, 'icon.name', 'las la-stream')
    },
    color () {
      return _.get(this.plan, 'icon.color', 'grey-7')
    },
    size () {
      return this.$q.screen.lt.sm ? 'sm' : 'md'
    },
    canManagePlan () {
      return this.$can('update', 'plans', this.organisation._id, this.plan)
    }
  },
  data () {
    return {
      organisation: this.$store.get('context'),
      objectiveFilters: this.kActivity.objectiveFilters
    }
  },
  watch:{
    plan: {
      handler () {
        if (this.plan) this.objectiveFilters = _.fill(Array(this.plan.objectives.length), false)
      }
    },
    objectiveFilters: {
      handler () {
        if (!this.plan) return
        let filters = []
        for (let i = 0; i < this.objectiveFilters.length; i++) {
          if (this.objectiveFilters[i]) filters.push(_.get(this.plan, `objectives[${i}].value`))
        }
        this.kActivity.objectiveFilters = filters
      }
    }
  },
  methods: {
    onManagePlan () {
      this.$router.push({ name: 'plans-activity', params: { contextId: this.organisation._id } })
    }
  },
  async beforeCreate () {
    // Loads the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
  },
  async created () {
    await this.loadPlan()
  }
}
</script>