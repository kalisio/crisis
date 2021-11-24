import _ from 'lodash'
import sift from 'sift'
import { Geolocation } from '@kalisio/kdk/map.client.map'
import * as utils from '../utils'

const eventsMixin = {
  data () {
    let data = {
      userId: '',
      isParticipant: false,
      isCoordinator: false,
      event: {}
    }
    // In event panel we inject the event as props from the activity instead
    // This avoids a warning of Vuejs about duplicated name in data/props
    if (_.has(this.$props, 'event')) delete data.event
    return data
  },
  methods: {
    hasLocation () {
      return _.has(this.event, 'location.latitude') && _.has(this.event, 'location.longitude')
    },
    hasLocationGeometry () {
      return (_.has(this.event, 'location.type') && (_.get(this.event, 'location.type') !== 'Point'))
    },
    hasAnyLocation () {
      return this.hasLocation() || this.hasLocationGeometry()
    },
    hasMedias () {
      return _.has(this.event, 'attachments') && (this.event.attachments.length > 0)
    },
    mediasCount () {
      return _.has(this.event, 'attachments') ? this.event.attachments.length : 0
    },
    // Check if there is a defined user interaction on target step
    hasStepUserInteraction (step) {
      if (_.isEmpty(step)) return false
      else return !_.isEmpty(step.interaction)
    },
    // Check if there is a defined feature interaction on target step
    hasStepFeatureInteraction (step) {
      if (_.isEmpty(step)) return false
      else return !_.isEmpty(step.featureInteraction)
    },
    // Check if there is a defined interaction on target step
    hasStepInteraction (step) {
      return this.hasStepUserInteraction(step) || this.hasStepFeatureInteraction(step)
    },
    // Check if there is a recorded user interaction on target state
    hasStateUserInteraction (state) {
      if (_.isEmpty(state)) return false
      else return !_.isEmpty(_.get(state, 'properties.interaction'))
    },
    // Check if there is a recorded feature interaction on target state
    hasStateFeatureInteraction (state) {
      if (_.isEmpty(state)) return false
      else return !_.isEmpty(state.properties)
    },
    // Check if there is a recorded interaction on target state
    hasStateInteraction (state) {
      return this.hasStateUserInteraction(state) || this.hasStateFeatureInteraction(state)
    },
    // Check if we wait for an interaction at current state based on target step/stakeholder
    waitingInteraction (step, state, stakeholder) {
      return (this.hasStepInteraction(step) && !this.hasStateInteraction(state) && (step.stakeholder === stakeholder))
    },
    // Get last user interaction
    getUserInteraction (state = {}) {
      // When last step had a recorded interaction use it if any
      if (_.has(state, 'properties.interaction')) return _.get(state, 'properties.interaction.value')
      // If we wait for an interaction use previous state if any
      if (state.previous) return this.getUserInteraction(state.previous)
      return ''
    },
    // Get last user interaction step
    getUserInteractionStep (state = {}) {
      let stepName
      // When last step had a recorded interaction use it if any
      if (_.has(state, 'properties.interaction')) stepName = _.get(state, 'step')
      // If we wait for an interaction use previous state if any
      else if (state.previous) stepName = _.get(state, 'previous.step')
      const stepIndex = this.event.workflow.findIndex(workflowStep => workflowStep.name === stepName)
      return this.event.workflow[stepIndex]
    },
    // Does this step has an interaction ending the workflow
    hasEnd (step) {
      return !_.isEmpty(step.end)
    },
    // Does the current state has an interaction ending the workflow based on target step
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
      return { name: 'fas fa-user', color: 'blue' }
    },
    getUserName (state = {}) {
      // Manage the case the participant is not correctly populated
      return _.get(state, 'participant.name', this.$t('EventLog.UNAMED'))
    },
    getUserComment (state = {}) {
      // When last step had a recorded interaction use its comment if any
      if (_.has(state, 'properties.comment')) return _.get(state, 'properties.comment')
      // If we wait for an interaction use previous state comment if any
      if (state.previous) return this.getUserComment(state.previous)
      return ''
    },
    getUserFollowUp (state = {}) {
      const step = this.getWorkflowStep(state)
      return step.title + ' : ' + this.$t('EventLog.ACTION_REQUIRED_WARNING')
    },
    getUserState (state = {}) {
      const interaction = this.getUserInteraction(state)
      if (interaction) {
        // Don't use current step here as the interaction can be recorded on the previous one
        const step = this.getUserInteractionStep(state)
        return step.title + ' : ' + interaction
      } else {
        const step = this.getWorkflowStep(state)
        return step.title + ' : ' + this.$t('EventLog.AWAITING_INFORMATION')
      }
    },
    // Check if the coordinator has to perform an interaction according to given participant state
    canFollowUpUser (state) {
      const step = this.getWorkflowStep(state)
      return this.waitingInteraction(step, state, 'coordinator')
    },
    doUserFollowUp (participantId) {
      this.$router.push({ name: 'event-log', params: { logId: participantId } })
    },
    // Helper function to process logs as usual objects by adding an icon/coment property extracted from feature properties
    processStates(states) {
      states.forEach(state => {
        state.icon = this.getUserIcon(state, this.getWorkflowStep(state) || {}) // Take care when no workflow
      })
      // It appears that in some weird cases we can have duplicated logs,
      // e.g. https://github.com/kalisio/aktnmap/issues/247
      // As by default the list is ordered according to creation date,
      // simply keep the most recent one in case of doublons
      // Manage the case the participant is not correctly populated
      return _.uniqBy(states, state => _.get(state, 'participant._id', _.get(state, 'participant')))
    },
    // Check if the given state is related to a step before target one
    isBeforeInWorkflow (stateName, stepName) {
      const stateIndex = this.event.workflow.findIndex(workflowStep => workflowStep.name === stateName)
      const stepIndex = this.event.workflow.findIndex(workflowStep => workflowStep.name === stepName)

      return (stepIndex > stateIndex)
    },
    // Get current workflow step of the user
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
            valueField: 'value',
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
        return this.getService().create(log)
      } else {
        throw new Error('Cannot log state because form is not valid')
      }
    },
    refreshUser () {
      const user = this.$store.get('user')
      if (user) {
        this.userId = user._id
        // Check user role in event
        this.isParticipant = utils.hasRoleInEvent(user, this.event.participants)
        this.isCoordinator = utils.hasRoleInEvent(user, this.event.coordinators)
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
