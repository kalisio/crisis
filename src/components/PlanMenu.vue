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
    menu-self="top middle"
    @show="refreshPercentages">
    <template v-slot:default>
      <q-card v-if="plan" class="bg-white" :style="computedStyle">
        <div class="row full-width justify-center items-center q-pa-md q-gutter-x-sm text-subtitle1 bg-grey-4">
          <KAvatar
            :class="$q.screen.lt.sm ? 'q-pa-none' : 'q-pa-xs'"
            :object="plan"
            :contextId="organisation._id"
            size="sm"
          />
          <div>
            {{ plan.name }}
          </div>
        </div>
        <div class="q-pa-xs">
          <k-text-area class="light-paragraph q-pa-sm" :text="plan.description" />
          <!-- Objectives section -->
          <KCardSection>
            <template v-for="(objective, index) in plan.objectives" :key="objective.id">
              <div class="row full-width items-center justify-between no-wrap">
                <q-toggle class="col-8" v-model="objectiveFilters[index]" :label="objective.name" />
                <div class="row items-center q-gutter-x-sm no-wrap q-pr-sm">
                  <KPanel id="objective-actions" :content="getObjectiveActions(objective)" :dense="true" />
                  <q-knob
                    readonly
                    show-value
                    v-model="objectivePercents[index]"
                    size="24px"
                    :thickness="0.25"
                    color="primary"
                    track-color="grey-5"
                  >
                    <q-tooltip>
                      {{ $t('PlanMenu.PERCENT_LABEL', { percent: objectivePercents[index] }) }}
                    </q-tooltip>
                  </q-knob>
                </div>
              </div>
            </template>
          </KCardSection>
        </div>
      </q-card>
    </template>
  </q-btn-dropdown>
</template>

<script>
import _ from 'lodash'
import { QKnob } from 'quasar'
import mixins from '../mixins'

export default {
  name: 'plan-menu',
  mixins: [
    mixins.plans
  ],
  components: {
    QKnob
  },
  inject: ['kActivity'],
  computed: {
    computedStyle () {
      if (this.$q.screen.lt.sm) return 'min-width: 100vw;'
      if (this.$q.screen.lt.md) return 'min-width: 80vw;'
      if (this.$q.screen.lt.lg) return 'min-width: 60vw;'
      if (this.$q.screen.lt.xl) return 'min-width: 40vw;'
      return 'min-width: 20vw;'
    },
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
      objectiveFilters: this.kActivity.objectiveFilters,
      objectivePercents: []
    }
  },
  watch: {
    planId: {
      async handler () {
        await this.loadPlan()
      }
    },
    plan: {
      handler () {
        if (this.plan) this.objectiveFilters = _.fill(Array(_.size(this.plan.objectives), false))
      }
    },
    objectiveFilters: {
      handler () {
        if (!this.plan) return
        const filters = []
        for (let i = 0; i < this.objectiveFilters.length; i++) {
          if (this.objectiveFilters[i]) filters.push(_.get(this.plan, `objectives[${i}].name`))
        }
        this.kActivity.objectiveFilters = filters
      }
    }
  },
  methods: {
    getObjectiveActions (objective) {
      const actions = []
      if (objective.description) {
        actions.push({
          id: 'show-objective-description',
          component: 'menu/KMenu',
          dropdownIcon: 'las la-ellipsis-v',
          tooltip: 'PlanMenu.VIEW_DESCRIPTION',
          icon: 'las la-file-alt',
          content: [{
            component: 'KTextArea',
            text: objective.description,
            length: 8192,
            class: 'q-pa-sm bg-grey-5'
          }]
        })
      }
      if (objective.location) {
        actions.push({
          id: 'show-objective-location',
          component: 'menu/KMenu',
          dropdownIcon: 'las la-ellipsis-v',
          tooltip: 'PlanMenu.VIEW_LOCATION',
          icon: 'las la-map-marker',
          content: [{
            component: 'KLocationMap',
            value: objective.location,
            editable: false,
            style: 'min-width: 360px; max-width: 360px; min-height: 360px; max-height: 360px;'
          }]
        })
      }
      return actions
    },
    onManagePlan () {
      this.$router.push({ name: 'plans-activity', params: { contextId: this.organisation._id } })
    },
    async refreshPercentages () {
      // Initialize the whole array as we have some async operations here
      // so that the rendering could be triggered and is refering to the array by index
      this.objectivePercents = _.fill(Array(_.size(this.plan.objectives), 0))
      if (this.plan.objectives) {
        for (let i = 0; i < this.plan.objectives.length; i++) {
          const nbEvents = await this.countEvents({ objective: this.plan.objectives[i].name })
          const nbClosedEvents = await this.countClosedEvents({ objective: this.plan.objectives[i].name })
          const percent = nbEvents !== 0 ? Math.round((nbClosedEvents / nbEvents) * 100) : 0
          this.objectivePercents[i] = percent
        }
      }
    }
  }
}
</script>
