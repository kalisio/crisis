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
            :subject="plan"
            :contextId="organisation._id"
            size="sm"
          />
          <div>
            {{ plan.name }}
          </div>
        </div>
        <div class="q-pa-xs">
          <KTextArea
            :text="plan.description"
            class="light-paragraph q-pa-sm"
          />
          <!-- Objectives section -->
          <KCardSection :hide-header="true">
            <template v-for="(objective, index) in plan.objectives" :key="objective.id">
              <div class="row full-width items-center justify-between no-wrap">
                <q-toggle
                  class="col-8"
                  v-model="objectiveFilters"
                  :val="objective.name"
                  :label="objective.name"
                />
                <div class="row items-center q-gutter-x-sm no-wrap q-pr-sm">
                  <KPanel id="objective-actions" :content="getObjectiveActions(objective)" :dense="true" />
                  <q-knob
                    v-if="objectivePercents[index]"
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
import { usePlan } from '../composables'

export default {
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
        this.objectiveFilters = []
      }
    },
    objectiveFilters: {
      handler () {
        this.kActivity.objectiveFilters = this.objectiveFilters
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
          dropdownIcon: 'las la-file-alt',
          tooltip: 'PlanMenu.VIEW_DESCRIPTION',
          dropdownAnimation: false,
          dense: true,
          content: [{
            component: 'KTextArea',
            text: objective.description,
            maxHeight: '300',
            class: 'q-pa-md bg-grey-2',
            style: 'min-width: 300px; width: 50vw'
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
  },
  setup (props) {
    return {
      ...usePlan({ contextId: props.contextId })
    }
  }
}
</script>
