import _ from 'lodash'
import path from 'path-browserify'
import { Dialog } from 'quasar'
import { Geolocation } from '@kalisio/kdk/map.client.map'
import * as utils from '../utils'

const eventsMixin = {
  data () {
    const data = {
      userId: '',
      isParticipant: false,
      isCoordinator: false,
      event: {},
      attachments: []
    }
    // In event panel we inject the event as props from the activity instead
    // This avoids a warning of Vuejs about duplicated name in data/props
    if (_.has(this.$props, 'event')) delete data.event
    return data
  },
  methods: {
    getLocationAsFeature () {
      return utils.getLocationAsFeature(this.event)
    },
    hasLocation () {
      const feature = this.getLocationAsFeature()
      return feature && _.has(feature, 'geometry')
    },
    hasLocationGeometry () {
      const feature = this.getLocationAsFeature()
      return feature && _.has(feature, 'geometry') && (_.get(feature, 'geometry.type') !== 'Point')
    },
    hasAnyLocation () {
      return this.hasLocation() || this.hasLocationGeometry()
    },
    async loadAttachments () {
      this.attachments = []
      const storageService = this.$api.getService('storage', this.contextId)
      if (storageService) {
        this.attachments = await storageService.find({ query: { Prefix: this.event._id || this.event } })
        // "Folders" are retrieved but are zero-sized
        this.attachments = this.attachments.filter(item => item.Size > 0)
          .map(item => ({
          // From key name we extract the filename
            name: path.basename(item.Key),
            key: item.Key,
            size: item.Size
          }))
      }
    },
    hasMedias () {
      return (this.attachments.length > 0)
    },
    mediasCount () {
      return this.attachments.length
    },
    // Check if there is a defined user interaction on target step
    hasStepUserInteraction (step) {
      if (_.isEmpty(step)) return false
      else return !_.isEmpty(step.interaction)
    },
    // Check if there is a defined interaction on target step
    hasStepInteraction (step) {
      return this.hasStepUserInteraction(step)
    },
    // Check if there is a recorded user interaction on target state
    hasStateUserInteraction (state) {
      if (_.isEmpty(state)) return false
      else return !_.isEmpty(_.get(state, 'properties.interaction'))
    },
    // Check if there is a recorded interaction on target state
    hasStateInteraction (state) {
      return this.hasStateUserInteraction(state)
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
      return _.get(state, 'participant.profile.name', this.$t('EventLog.UNAMED'))
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
    processStates (states) {
      states.forEach(state => {
        state.icon = this.getUserIcon(state, this.getWorkflowStep(state) || {}) // Take care when no workflow
      })
      // It appears that in some weird cases we can have duplicated logs,
      // e.g. https://github.com/kalisio/crisis/issues/247
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
    generateSchemaForStep (step) {
      // Start from schema template and clone it because modifications
      // will be shared by all caller otherwise
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://www.kalisio.xyz/schemas/event-logs.create.json#',
        title: 'Event Log Creation',
        description: 'Event log creation schema',
        type: 'object',
        properties: {},
        required: []
      }
      // Then add step interaction
      if (this.hasStepUserInteraction(step)) {
        const options = step.interaction.map(option => { return { label: option.value, value: option } })
        schema.properties.interaction = {
          type: 'object',
          field: {
            component: 'form/KSelectField',
            label: step.description,
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
          label: this.$t('schemas.EVENTS_LOG_COMMENT_FIELD_LABEL')
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
        if (Geolocation.hasLocation()) {
          log.geometry = Geolocation.getGeometry()
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
        const log = await this.createParticipantLog(step, state)
        _.merge(log.properties, result.values)
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
    mediaBrowserOptions () {
      return {
        storage: {
          context: this.contextId,
          prefix: this.event._id || this.event,
          uploadQuery: {
            notification: {
              body: this.$t('EventNotifications.UPDATE_MEDIA')
            }
          }
        },
        backgroundColor: 'black',
        controlColor: 'white'
      }
    },
    showRemoveEventDialog (event) {
      if (!event) event = this.event
      Dialog.create({
        title: this.$t('mixins.REMOVE_EVENT_DIALOG_TITLE', { event: event.name }),
        message: this.$t('mixins.REMOVE_EVENT_DIALOG_MESSAGE', { event: event.name }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(() => {
        const eventsService = this.$api.getService('events', this.contextId)
        eventsService.remove(event._id, { query: { notification: { body: this.$t('EventNotifications.REMOVE') } } })
      })
    }
  }
}

export default eventsMixin
