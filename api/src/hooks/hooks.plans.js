import _ from 'lodash'
import makeDebug from 'debug'
import { getItems } from 'feathers-hooks-common'
const debug = makeDebug('aktnmap:plans:hooks')

export function isObjectiveEqual (objective1, objective2) {
  return (objective1.id === objective2.id)
}

export async function updateEventsObjective (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'updateEventsObjective\' hook should only be used as a \'after\' hook.')
  }

  const previousObjectives = _.get(hook, 'params.previousItem.objectives', [])
  const objectives = _.get(hook, 'data.objectives', [])
  // Find common objectives
  const commonObjectives = _.intersectionWith(objectives, previousObjectives, isObjectiveEqual)
  if (!_.isEmpty(commonObjectives)) {
    // Filter renamed objectives
    const updatedObjectives = commonObjectives.filter(objective => {
      const previousObjective = _.find(previousObjectives, item => item.id === objective.id)
      return previousObjective.name !== objective.name
    })
    debug('Updating objectives on events', updatedObjectives)
    // Update events accordingly
    const service = hook.service
    const eventsService = hook.app.getService('events', service.context)
    await Promise.all(
      updatedObjectives.map(objective => {
        const previousObjective = _.find(previousObjectives, item => item.id === objective.id)
        eventsService.patch(null, { objective: objective.name }, { query: { objective: previousObjective.name } })
      })
    )
  }
  // Then removed objectives
  const removedObjectives = _.differenceWith(previousObjectives, commonObjectives, isObjectiveEqual)
  if (!_.isEmpty(removedObjectives)) {
    debug('Removing objectives on events', removedObjectives)
    // Update events accordingly
    const service = hook.service
    const eventsService = hook.app.getService('events', service.context)
    await Promise.all(
      removedObjectives.map(objective => 
        eventsService.patch(null, { objective: null }, { query: { objective: objective.name } })
      )
    )
  }
  
  return hook
}

export async function removeEventsPlan (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'removeEventsFromPlan\' hook should only be used as a \'after\' hook.')
  }

  const service = hook.service
  const object = getItems(hook)
  const eventsService = hook.app.getService('events', service.context)
  await eventsService.remove(null, { query: { plan: object._id } })
  
  return hook
}
