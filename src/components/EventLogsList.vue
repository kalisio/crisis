<template>
  <div>
    <!--
      Event logs filters
    -->
    <q-item v-if="event.hasWorkflow">
      <q-item-section><q-select id="workflow-step" v-model="selectedStep" :label="$t('EventLogsList.STEP')" stack-label
        :options="stepOptions" emit-value map-options /></q-item-section>
      <q-item-section v-if="selectedStep"><q-select id="step-interaction" v-model="selectedInteraction" :label="$t('EventLogsList.INTERACTION')" stack-label
        :options="interactionOptions" emit-value map-options /></q-item-section>
    </q-item>
    <!--
      Event logs list
    -->
    <k-list
      ref="list"
      :service="getServiceName()" 
      :renderer="renderer" 
      :contextId="contextId"
      :base-query="baseQuery" 
      :filter-query="filterQuery" 
      :list-strategy="'smart'"
      @toggle-changed="onItemToggled"
      @collection-refreshed="onCollectionRefreshed">
        <template slot="empty-section">
          <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KList.EMPTY_LIST')" />
        </template>
      </k-list>
    <!--
      Follow up modal
    -->
    <k-modal ref="followUpModal" :title="followUpTitle" :buttons="getFollowUpButtons()">
      <div slot="modal-content">
        <k-form ref="form" :schema="schema"/>
      </div>
    </k-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import Papa from 'papaparse'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

// For export or statistics we get all event logs at once to avoid managing pagination
const MAX_EVENT_LOGS = 5000

export default {
  name: 'event-logs-list',
  mixins: [
    kCoreMixins.refsResolver(['form']),
    kCoreMixins.schemaProxy,
    mixins.events
  ],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    event: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selectedStep: '',
      selectedInteraction: '',
      selectedParticipantState: {},
      selectedParticipantStep: {},
      toggledParticipants: []
    }
  },
  computed: {
    renderer () {
      return {
        component: 'EventLogItem',
        event: this.event,
        actions: [{
          id: 'follow-up',
          icon: 'las la-sms',
          color: 'red',
          handler: (item) => this.onUserFollowUp(item)
        }, {
          id: 'location-map',
          component: 'frame/KPopupAction',
          tooltip: 'EventLogsList.LOCATION_MAP',
          icon: 'las la-map-marker',
          content: [{ 
            component: 'KLocationMap', 
            editable: false, 
            style: 'min-width: 360px; max-width: 360px; min-height: 360px; max-height: 360px;'
          }]
        }]
      }
    },
    baseQuery () {
      return { lastInEvent: true, event: this.event._id, $sort: { createdAt: -1 } }
    },
    filterQuery () {
      let filter = {}
      if (this.selectedStep) {
        Object.assign(filter, { step: this.selectedStep })
      }
      if (this.selectedInteraction) {
        Object.assign(filter, { 'properties.interaction.value': this.selectedInteraction })
      }
      return filter
    },
    stepOptions () {
      let stepOptions = [{
        value: '', label: this.$i18n.t('EventLogsList.ALL_STEPS')
      }]
      return  stepOptions.concat(this.event.workflow.map(step => ({ value: step.name, label: step.title })))
    },
    interactionOptions () {
      let interactionOptions = [{
        value: '', label: this.$i18n.t('EventLogsList.ALL_INTERACTIONS')
      }]
      if (this.selectedStep) {
        const step = _.find(this.event.workflow, step => step.name === this.selectedStep)
        if (step) interactionOptions = interactionOptions.concat(
          step.interaction.map(interaction => ({ value: interaction.value, label: interaction.value })))
      }
      return interactionOptions
    },
    followUpTitle () {
      return this.selectedParticipantStep ? this.selectedParticipantStep.title : this.$t('EventLogsList.FOLLOW_UP_MODAL_TITLE')
    }
  },
  methods: {
    getServiceName () {
      // Archived mode ?
      return (this.archived ? 'archived-event-logs' : 'event-logs')
    },
    getService () {
      // Archived mode ?
      return this.$api.getService(this.getServiceName())
    },
    async loadSchema () {
      // Load layer schema if any first
      await this.loadLayerSchema(this.event.layer)
      this.schema = await this.generateSchemaForStep(this.selectedParticipantStep)
      return this.schema
    },
    onItemToggled (item, toggled) {
      if (toggled) this.toggledParticipants.push(item)
      else _.remove(this.toggledParticipants, participant => participant._id === item._id)
    },
    onCollectionRefreshed (items) {
      // Process logs to make it usable as a more conveninet object by adding icon, etc.
      this.$refs.list.items = this.processStates(items)
      // Clear toggled items
      this.toggledParticipants = []
    },
    getFollowUpButtons () {
      return [{
        id: 'cancel-button', outline: true,
        label: this.$t('EventLogsList.FOLLOWUP_MODAL_CANCEL_BUTTON'),
        renderer: 'form-button',
        handler: () => this.$refs.followUpModal.close()
      }, {
        id: 'apply-button',
        label: this.$t('EventLogsList.FOLLOWUP_MODAL_APPLY_BUTTON'),
        renderer: 'form-button',
        handler: () => this.logParticipantStates()
      }]
    },
    async onUserFollowUp (context) {
      this.selectedParticipantState = context.item
      this.selectedParticipantStep = this.getWorkflowStep(this.selectedParticipantState)
      this.$refs.followUpModal.open()
      // We can then load the schema and local refs in parallel
      await Promise.all([
        this.loadSchema(),
        this.loadRefs()
      ])
      await this.$refs.form.build()
      const properties = await this.loadFeatureProperties(this.event.feature)
      if (properties) this.$refs.form.fill(properties)
      else this.$refs.form.clear()
    },
    async logParticipantStates () {
      // Check for multi-selection
      let participants = this.toggledParticipants
      // Check if we don't mix different steps
      for (let i = 0; i < participants.length; i++) {
        const participantStep = this.getWorkflowStep(participants[i])
        if (participantStep.name !== this.selectedParticipantStep.name) {
          await kCoreUtils.dialog({
            title: this.$t('EventLogsList.MATCHING_RESULTS', { total: response.total }),
            message: this.$t('EventLogsList.MAXIMUM_RESULTS', { max: MAX_EVENT_LOGS }),
            ok: {
              label: this.$t('CLOSE'),
              flat: true
            }
          })
          return
        }
      }
      // If no selection use picked item
      if (_.isEmpty(participants)) participants = participants.concat([this.selectedParticipantState])
      // Then proceed for each participant
      for (let i = 0; i < participants.length; i++) {
        await this.logStep(this.$refs.form, this.selectedParticipantStep, participants[i])
      }
      this.$refs.followUpModal.close()
    },
    async downloadEventLogsData () {
      // Make full request to avoid pagination and filter required data
      const response = await this.getService().find({
        query: Object.assign({
          $skip: 0, $limit: MAX_EVENT_LOGS
        }, this.baseQuery, this.filterQuery)
      })
      // Check if overpass max limit
      if (response.total > MAX_EVENT_LOGS) {
        this.$q.dialog({
          title: this.$t('EventLogsList.MATCHING_RESULTS', { total: response.total }),
          message: this.$t('EventLogsList.MAXIMUM_RESULTS', { max: MAX_EVENT_LOGS })
        })
      }
      // Define properties to be exported
      let properties = ['participant', 'createdAt']
      if (this.event.hasWorkflow) properties = properties.concat(['step', 'interaction'])
      const json = response.data.map(item => {
        const interaction = this.getUserInteraction(item)
        item.interaction = interaction || this.$t('EventLog.AWAITING_INFORMATION')
        // Don't use current step as the interaction can be recorded on the previous one
        item.step = (interaction ? this.getUserInteractionStep(item) : this.getWorkflowStep(item))
        // Change from step ID to label
        item.step = _.get(item, 'step.title', '')
        // Change from object to string
        item.participant = _.get(item, 'participant.name', this.$t('EventLog.UNAMED'))
        // Delete what is not exported
        return _.pick(item, properties)
      })
      const data = Papa.unparse(json)
      
      kCoreUtils.downloadAsBlob(data, this.$t('EventLogsList.EVENT_LOGS_EXPORT_FILE'), 'text/csv;charset=utf-8;')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-list'] = this.$load('collection/KList')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
    this.$options.components['k-action'] = this.$load('frame/KAction')
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
  }
}
</script>
