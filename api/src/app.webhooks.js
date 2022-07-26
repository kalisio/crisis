import _ from 'lodash'
import moment from 'moment'
import mongodb from 'mongodb'
import { BadRequest } from '@feathersjs/errors'

const { ObjectID } = mongodb

export default function () {
  const app = this

  // Create webhook for events
  app.createWebhook('events', {
    filter: { service: { $in: ['events'] }, operation: { $in: ['create', 'patch', 'remove'] } },
    // Pre processor used to make some information implicit in payload
    preprocessor: async (req, res, payload) => {
      // Organisation alias
      if (payload.organisation) {
        payload.context = payload.organisation
        delete payload.organisation
      }
      if (!payload.service) payload.service = 'events'
      if (!payload.operation) payload.operation = 'create'
    },
    // Post processor used to find template by matching names
    postprocessor: async (service, args, payload) => {
      if (payload.operation !== 'create') return
      // Arguments for create operation are [data, params]
      let data = args[0]
      let params = args[1]
      // Retrieve template to create event from
      let template
      if (_.has(data, 'template')) {
        const eventTemplatesService = app.getService('event-templates', payload.context)
        if (ObjectID.isValid(template)) {
          template = await eventTemplatesService.get(_.get(data, 'template'))
        } else { // Template name is given
          const results = await eventTemplatesService.find({ query: { name: { $search: _.get(data, 'template') } }, paginate: false })
          if (results.length > 0) template = results[0]
        }
      } else {
        throw new BadRequest('Template ID or name must be provided')
      }
      if (!template) throw new BadRequest('Template could not be found')
      // Remove template id so that event has its own and avoir overwriting provided properties if any
      _.merge(data, _.omit(template, _.keys(data).concat(['_id'])))
      // Keep track of template based on its name for statistics
      // We don't keep ref/link for simplicity and making archived events will be self-consistent
      // No need to keep track of templates that have been removed, etc.
      data.template = template.name
      // Setup expiry date from template
      if (data.expiryDuration) {
        const expiryDate = moment().utc().add({ days: data.expiryDuration })
        data.expireAt = expiryDate.toISOString()
        delete data.expiryDuration
      }
      // Event notification must be passed as query param
      params.notification = _.get(data, 'notification', true) // Default is to notify
      delete data.notification
    }
  })
}