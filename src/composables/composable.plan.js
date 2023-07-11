import _ from 'lodash'
import { ref, computed, watch, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '@kalisio/kdk/core.client'

export function usePlan(options) {

  // Data
  const route = useRoute()
  const planId = ref(null)
  const plan = ref(null)
  const objectiveFilters = ref([])
  let planService = ''

  // Computed
  const planQuery = computed(() => {
    return _.isEmpty(planId.value) ? {} : { plan: planId.value }
  })
  const planObjectiveQuery = computed(() => {
    return _.isEmpty(objectiveFilters.value) ? {} : { objective: { $in: objectiveFilters.value } }
  })

  // Functions
  function hasPlan () {
    return planId.value
  }
  function hasPlanLocation () {
    return _.has(plan.value, 'location.latitude') && _.has(plan.value, 'location.longitude')
  }
  function hasPlanObjectives () {
    return (_.get(plan.value, 'objectives', []).length > 0)
  }
  async function loadPlan (query = {}) {
    if (!planId.value) {
      plan.value = null
    } else {
      plan.value = await api.getService(planService, options.contextId).get(planId.value, { query })
    }
  }
  function onPlanUpdated (updatedPlan) {
    if (plan.value && (updatedPlan._id === plan.value._id)) {
      plan.value = updatedPlan
    }
  }
  function onPlanRemoved (removedPlan) {
    if (plan.value && (removedPlan._id === plan.value._id)) {
      plan.value = null
      planId.value = null
    }
  }
  function refreshPlanId () {
    const id = _.get(route, 'query.plan', null)
    if (planId.value !== id) planId.value = id
  }
  async function countEvents (query = {}) {
    const eventsService = api.getService('archived-events', options.contextId)
    const response = await eventsService.find({ query: Object.assign(query, planQuery.value), $limit: 0 })
    return response.total
  }
  async function countClosedEvents (query = {}) {
    const eventsService = api.getService('archived-events', options.contextId)
    const response = await eventsService.find({ query: Object.assign(query, { deletedAt: { $exists: true } }, planQuery.value), $limit: 0 })
    return response.total
  }

  // Lifecycle hooks
  watch(() => route.to, refreshPlanId)
  
  onBeforeMount(() => {
    // Jump to archive whenever required
    planService = (_.get(route, 'name').includes('archived') ? 'archived-plans' : 'plans')
    refreshPlanId()
    const plansService = api.getService(planService, options.contextId)
    // Keep track of changes once plan is loaded
    plansService.on('patched', onPlanUpdated)
    plansService.on('updated', onPlanUpdated)
    plansService.on('removed', onPlanRemoved)
  })

  // Cleanup for appendItems
  onBeforeUnmount(() => {
    const plansService = api.getService(planService, options.contextId)
    plansService.off('patched', onPlanUpdated)
    plansService.off('updated', onPlanUpdated)
    plansService.off('removed', onPlanRemoved)
  })

  return {
    plan,
    planId,
    objectiveFilters,
    hasPlan,
    hasPlanLocation,
    hasPlanObjectives,
    loadPlan,
    planQuery,
    planObjectiveQuery,
    countEvents,
    countClosedEvents
  }
}
