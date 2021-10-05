import _ from 'lodash'
import makeDebug from 'debug'
const debug = makeDebug('aktnmap:event-templates:hooks')

export function updateEventTemplateResource (resourceScope) {
  return async function (hook) {
    if (hook.type !== 'after') {
      throw new Error('The \'updateEventTemplateResource\' hook should only be used as a \'after\' hook.')
    }
    // Only applicable to update/remove operations
    if ((hook.method === 'get' || hook.method === 'find' || hook.method === 'create')) return hook

    const app = hook.app
    // Retrieve the list of templates
    const orgEventTemplatesService = app.getService('event-templates', hook.service.getContextId())
    const templates = await orgEventTemplatesService.find({
      query: { [resourceScope]: { $elemMatch: { _id: hook.result._id } } },
      paginate: false
    })
    // Update each template
    await Promise.all(templates.map(template => {
      let resources = _.get(template, resourceScope, [])
      let updateTemplate = false
      // Check for removal or update
      if (hook.method === 'remove') {
        const removedResources = _.remove(resources, resource => resource._id && (resource._id.toString() === hook.result._id.toString()))
        updateTemplate = (removedResources.length > 0)
      } else {
        let resource = _.find(resources, { _id: hook.result._id })
        if (resource) {
          Object.assign(resource, hook.result)
          updateTemplate = true
        }
      }
      
      // In case of matching resource update template object
      if (updateTemplate) {
        debug(`Updating resources on scope ${resourceScope} for event template ${template._id} of organisation ` + hook.result._id)
        return orgEventTemplatesService.patch(template._id, { [resourceScope]: resources })
      } else {
        return Promise.resolve()
      }
    }))

    debug(`Updated resource ${hook.result._id} on scope ${resourceScope} for event templates of organisation ` + hook.result._id)
    return hook
  }
}
