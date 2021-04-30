import _ from 'lodash'
import sift from 'sift'
import { Geolocation } from '@kalisio/kdk/map.client.map'

const eventsMixin = {
  data () {
    return {
      userId: '',
      isParticipant: false,
      isCoordinator: false,
      event: {}
    }
  },
  methods: {
    hasLocation () {
      return _.has(this.event, 'location.latitude') && _.has(this.event, 'location.longitude')
    },
    hasMedias () {
      return _.has(this.event, 'attachments') && (this.event.attachments.length > 0)
    },
    mediasCount () {
      return _.has(this.event, 'attachments') ? this.event.attachments.length : 0
    },
    hasStepUserInteraction (step) {
      if (_.isEmpty(step)) return false
      else return !_.isEmpty(step.interaction)
    },
    hasStepFeatureInteraction (step) {
      if (_.isEmpty(step)) return false
      else return !_.isEmpty(step.featureInteraction)
    },
    hasStepInteraction (step) {
      return this.hasStepUserInteraction(step) || this.hasStepFeatureInteraction(step)
    },
    hasStateUserInteraction (state) {
      if (_.isEmpty(state)) return false
      else return !_.isEmpty(_.get(state, 'properties.interaction'))
    },
    hasStateFeatureInteraction (state) {
      if (_.isEmpty(state)) return false
      else return !_.isEmpty(state.properties)
    },
    hasStateInteraction (state) {
      return this.hasStateUserInteraction(state) || this.hasStateFeatureInteraction(state)
    },
    waitingInteraction (step, state, stakeholder) {
      return (this.hasStepInteraction(step) && !this.hasStateInteraction(state) && (step.stakeholder === stakeholder))
    },
    getUserInteraction (state = {}) {
      // When last step had a recorded interaction use it if any
      if (_.has(state, 'properties.interaction')) return _.get(state, 'properties.interaction.value')
      // If we wait for an interaction use previous state if any
      if (state.previous) return this.getUserInteraction(state.previous)
      return ''
    },
    hasEnd (step) {
      return !_.isEmpty(step.end)
    },
    endWorkflow (step, state) {
      return (this.hasEnd(step) && this.hasStateInteraction(state) && step.end.includes(this.getUserInteraction(state)))
    },
    getUserIcon (state = {}, step = {}) {
      // When last step was an interaction use it as icon
      if (this.hasStateUserInteraction(state)) return _.get(state, 'properties.interaction.icon')
      // When last step was a feature interaction use a specific icon
      if (this.hasStateFeatureInteraction(state)) return { name: 'fa-edit', color: 'blue' }
      // If we wait for an interaction use previous state icon
      if (this.hasStateUserInteraction(state.previous)) return this.getUserIcon(state.previous, step)
      // Otherwise use workflow icon for current step
      if (step && step.icon) return step.icon
      // In case of no workflow
      // FIXME: not sure we'd like to have the same icon for all participants in this case, should be different from event one
      // if (this.event && this.event.icon) return this.event.icon
      return { name: 'fa-user', color: 'blue' }
    },
    getUserComment (state = {}) {
      // When last step had a recorded interaction use its comment if any
      if (_.has(state, 'properties.comment')) return _.get(state, 'properties.comment')
      // If we wait for an interaction use previous state comment if any
      if (state.previous) return this.getUserComment(state.previous)
      return ''
    },
    isBeforeInWorkflow (stateName, stepName) {
      const stateIndex = this.event.workflow.findIndex(workflowStep => workflowStep.name === stateName)
      const stepIndex = this.event.workflow.findIndex(workflowStep => workflowStep.name === stepName)

      return (stepIndex > stateIndex)
    },
    getWorkflowStep (state = {}) {
      if (_.isNil(this.event.workflow)) return null

      const currentStepIndex = this.event.workflow.findIndex(step => step.name === state.step)
      // No log yet, the user is at the first step of the workflow
      if (currentStepIndex < 0) {
        return this.event.workflow[0]
      }
      const currentStep = this.event.workflow[currentStepIndex]
      // For interacting steps check if interaction already recorded
      if (this.waitingInteraction(currentStep, state, state.stakeholder)) {
        return currentStep
      }
      // Check if the last interaction was a workflow end
      if (this.endWorkflow(currentStep, state)) {
        return currentStep
      }
      const nextStepIndex = currentStepIndex + 1
      // End of workflow or next step to be fulfilled ?
      if (nextStepIndex >= 0 && nextStepIndex < this.event.workflow.length) {
        return this.event.workflow[nextStepIndex]
      } else {
        return currentStep
      }
    },
    canFollowUp (participant) {
      const step = this.getWorkflowStep(participant)
      return this.waitingInteraction(step, participant, 'coordinator')
    },
    doFollowUp (participantId) {
      this.$router.push({ name: 'event-log', params: { logId: participantId } })
    },
    async loadLayerSchema (layerId) {
      this.layerSchema = null
      if (!layerId) return
      const layer = await this.$api.getService('catalog', this.contextId).get(layerId)
      if (layer.schema) this.layerSchema = layer.schema.content
    },
    async loadFeatureProperties (featureId) {
      if (!featureId) return null
      const feature = await this.$api.getService('features', this.contextId).get(featureId)
      return (!_.isEmpty(feature.properties) ? feature.properties : null)
    },
    async loadFeatureGeometry (featureId) {
      if (!featureId) return null
      const feature = await this.$api.getService('features', this.contextId).get(featureId)
      return feature.geometry
    },
    async generateSchemaForStep (step) {
      // Start from schema template and clone it because modifications
      // will be shared by all caller otherwise
      if (!this.baseLogSchema) {
        this.baseLogSchema = await this.$load('event-logs.create', 'schema')
        // FIXME: not yet sure why this is now required, might be related to
        // https://forum.vuejs.org/t/solved-using-standalone-version-but-getting-failed-to-mount-component-template-or-render-function-not-defined/19569/2
        if (this.baseLogSchema.default) this.baseLogSchema = this.baseLogSchema.default
      }
      let schema = _.cloneDeep(this.baseLogSchema)
      // Then add step interactions
      if (this.hasStepFeatureInteraction(step)) {
        if (this.layerSchema) {
          schema.properties = _.pickBy(this.layerSchema.properties, (value, property) => step.featureInteraction.includes(property))
          schema.required = _.filter(this.layerSchema.required, (property) => step.featureInteraction.includes(property))
        }
      }
      if (this.hasStepUserInteraction(step)) {
        const options = step.interaction.map(option => { return { label: option.value, value: option } })
        schema.properties.interaction = {
          type: 'object',
          field: {
            component: 'form/KSelectField',
            helper: step.description,
            options
          }
        }
        if (step.interaction.length > 0) {
          schema.properties.interaction.default = step.interaction[0]
        }
        schema.required.push('interaction')
      }
      // Add a user comment field
      schema.properties.comment = {
        type: 'string',
        field: {
          component: 'form/KTextareaField',
          helper: this.$t('schemas.EVENTS_LOG_COMMENT_FIELD_LABEL')
        }
      }
      return schema
    },
    async createParticipantLog (step = {}, state = {}) {
      const log = {
        type: 'Feature',
        participant: this.userId,
        event: this.event._id || this.event,
        // Set this as default in case of no workflow for read receipt
        stakeholder: 'participant',
        properties: {}
      }
      // Could be missing when no workflow
      if (step.name) {
        log.step = step.name
      }
      if (step.stakeholder) {
        log.stakeholder = step.stakeholder
      }
      // Participant position as geometry
      if (log.stakeholder === 'participant') {
        await Geolocation.update()
        const position = this.$store.get('geolocation.position')
        if (position) {
          log.geometry = {
            type: 'Point',
            coordinates: [position.longitude, position.latitude]
          }
        }
      } else {
        // Copy geometry from previous state for coordinator so that we keep the last known user position
        if (state.geometry) log.geometry = state.geometry
        // Copy also participant ID so that the ID of the coordinator is not used
        if (state.participant) log.participant = state.participant._id || state.participant
      }
      return log
    },
    async logStep (form, step, state = {}) {
      const result = form.validate()
      if (result.isValid) {
        // Directly store as GeoJson objects
        let log = await this.createParticipantLog(step, state)
        _.merge(log.properties, result.values)
        if (this.hasStateFeatureInteraction(log) && this.event.feature) {
          // Use feature geometry instead of user position in this case
          const geometry = await this.loadFeatureGeometry(this.event.feature)
          if (geometry) log.geometry = geometry
          // Update feature properties
          this.$api.getService('features', this.contextId).patch(this.event.feature,
            _.mapKeys(result.values, (value, key) => `properties.${key}`))
        }
        // Then create interaction log
        return this.serviceCreate(log)
      } else {
        throw new Error('Cannot log state because form is not valid')
      }
    },
    hasRoleInEvent (user, roles) {
      return _.findIndex(roles, role => {
        if (role.service === 'members' && role._id === user._id) return true
        if (role.service === 'groups' || role.service === 'organisations') {
          if ([user].filter(sift({ [role.service + '._id']: user._id }))) return true
        }
        if (role.service === 'tags') {
          if (user.tags) {
            if (_.findIndex(user.tags, { _id: role._id } >= 0)) return true
          }
        }
        return false
      }) >= 0
    },
    refreshUser () {
      const user = this.$store.get('user')
      if (user) {
        this.userId = user._id
        // Check user role in event
        this.isParticipant = this.hasRoleInEvent(user, this.event.participants)
        this.isCoordinator = this.hasRoleInEvent(user, this.event.coordinators)
      }
    },
    uploaderOptions () {
      return {
        service: this.contextId + '/storage',
        acceptedFiles: 'image/*,application/pdf',
        multiple: true,
        maxFilesize: 10,
        autoProcessQueue: true,
        resourcesService: 'events',
        storagePath: '<%= id %>/<%= file.name %>'
      }
    },
    uploaderQuery () {
      return {
        notification: this.$t('EventNotifications.UPDATE_MEDIA')
      }
    },
    mediaBrowserOptions () {
      return {
        service: this.contextId + '/storage',
        backgroundColor: 'black',
        controlColor: 'white'
      }
    }
  }
}

export default eventsMixin
