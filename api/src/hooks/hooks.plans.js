import _ from 'lodash'
import makeDebug from 'debug'
import { getItems } from 'feathers-hooks-common'
const debug = makeDebug('aktnmap:plans:hooks')

export function isObjectiveEqual (objective1, objective2) {
  return (objective1.name === objective2.name)
}

export async function updateEventsObjective (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'updateEventsObjective\' hook should only be used as a \'after\' hook.')
  }

  const previousObjectives = _.get(hook, 'params.previousItem.objectives', [])
  const objectives = _.get(hook, 'data.objectives', [])
  // Find common objectives
  const commonObjectives = _.intersectionWith(objectives, previousObjectives, isObjectiveEqual)
  // Then removed objectives
  const removedObjectives = _.differenceWith(previousObjectives, commonObjectives, isObjectiveEqual)
  if (!_.isEmpty(removedObjectives)) {
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
