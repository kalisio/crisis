<template>
  <div>
    <!--
      Event logs filters
    -->
    <q-item v-if="event.hasWorkflow">
      <q-checkbox v-model="itemsToggled" @update:modelValue="onItemsToggled(toggled)"/>
      <q-item-section><q-select id="workflow-step" v-model="selectedStep" :label="$t('EventLogsList.STEP')" stack-label
        :options="stepOptions" emit-value map-options /></q-item-section>
      <q-item-section v-if="selectedStep"><q-select id="step-interaction" v-model="selectedInteraction" :label="$t('EventLogsList.INTERACTION')" stack-label
        :options="interactionOptions" emit-value map-options /></q-item-section>
      <q-item-section><q-select id="nb-items-per-page" v-model="nbItemsPerPage" :label="$t('EventLogsList.NB_ITEMS_PER_PAGE')" stack-label
        :options="nbItemsPerPageOptions" emit-value map-options /></q-item-section>
    </q-item>
    <!--
      Event logs list
    -->
    <KGrid
      ref="list"
      :service="getServiceName()"
      :renderer="renderer"
      :contextId="contextId"
      :base-query="baseQuery"
      :filter-query="filterQuery"
      :list-strategy="'smart'"
      :nb-items-per-page="nbItemsPerPage"
      :processor="onCollectionRefreshed"
      @item-toggled="onItemToggled">
        <template v-slot:empty-section>
          <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_LABEL')" />
        </template>
      </KGrid>
    <!--
      Follow up modal
    -->
    <KModal ref="followUpModal"
      :title="followUpTitle"
      :buttons="getFollowUpButtons()"
    >
      <KForm :ref="onFollowUpFormCreated" @form-ready="onFollowUpFormReady" :schema="schema" />
    </KModal>
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
      nbItemsPerPage: 50,
      nbItemsPerPageOptions: [{
        value: 25, label: '25'
      }, {
        value: 50, label: '50', default: true
      }, {
        value: 100, label: '100'
      }, {
        value: 500, label: '500'
      }],
      itemsToggled: false,
      toggledParticipants: []
    }
  },
  computed: {
    renderer () {
      return {
        component: 'EventLogItem',
        class: 'col-12',
        event: this.event,
        actions: [{
          id: 'follow-up',
          icon: 'las la-sms',
          color: 'red',
          handler: (item) => this.onUserFollowUp(item)
        }, {
          id: 'location-map',
          component: 'menu/KMenu',
          tooltip: 'EventLogsList.VIEW_LOCATION',
          dropdownIcon: 'las la-map-marker',
          dropdownAnimation: false,
          dense: true,
          content: [{
            component: 'location/KLocationMap',
            editable: false,
            style: 'min-width: 360px; max-width: 360px; min-height: 360px; max-height: 360px;'
          }]
        }],
        options: {
          // Individual toggle if not all selected
          toggle: !this.itemsToggled
        }
      }
    },
    baseQuery () {
      return { lastInEvent: true, event: this.event._id, $sort: { createdAt: -1 } }
    },
    filterQuery () {
      const filter = {}
      if (this.selectedStep) {
        Object.assign(filter, {
          lastInEvent: { $in: [true, false] },
          step: this.selectedStep
        })
        if (this.selectedInteraction) {
          Object.assign(filter, {
            'properties.interaction.value': this.selectedInteraction
          })
        } else {
          const step = _.find(this.event.workflow, step => step.name === this.selectedStep)
          if (step) {
            Object.assign(filter, {
              'properties.interaction.value': { $in: step.interaction.map(interaction => interaction.value) }
            })
          }
        }
      }
      return filter
    },
    stepOptions () {
      const stepOptions = [{
        value: '', label: this.$i18n.t('EventLogsList.ALL_STEPS')
      }]
      return stepOptions.concat(this.event.workflow.map(step => ({ value: step.name, label: step.title })))
    },
    interactionOptions () {
      let interactionOptions = [{
        value: '', label: this.$i18n.t('EventLogsList.ALL_INTERACTIONS')
      }]
      if (this.selectedStep) {
        const step = _.find(this.event.workflow, step => step.name === this.selectedStep)
        if (step) {
          interactionOptions = interactionOptions.concat(
            step.interaction.map(interaction => ({ value: interaction.value, label: interaction.value })))
        }
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
      this.schema = this.generateSchemaForStep(this.selectedParticipantStep)
      return this.schema
    },
    onItemsToggled (toggled) {
      // Clear toggled items
      this.toggledParticipants = []
    },
    onItemToggled (item, toggled) {
      if (toggled) this.toggledParticipants.push(item)
      else _.remove(this.toggledParticipants, participant => participant._id === item._id)
    },
    onCollectionRefreshed (items) {
      // Clear toggled items
      this.toggledParticipants = []
      // Process logs to make it usable as a more convenient object by adding icon, etc.
      return this.processStates(items)
    },
    getFollowUpButtons () {
      return [{
        id: 'cancel-button',
        outline: true,
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
    onUserFollowUp (context) {
      this.selectedParticipantState = context.item
      this.selectedParticipantStep = this.getWorkflowStep(this.selectedParticipantState)
      this.$refs.followUpModal.open()
    },
    async onFollowUpFormCreated (reference) {
      if (this.form !== reference) {
        this.form = reference
        if (this.form) {
          await this.loadSchema()
        } else {
          this.schema = null
        }
      }
    },
    onFollowUpFormReady () {
      this.form.clear()
    },
    async logParticipantStates () {
      // Check for multi-selection: all or individually selected items
      let participants = (this.itemsToggled ? this.$refs.list.items : this.toggledParticipants)
      // Check if we don't mix different steps
      for (let i = 0; i < participants.length; i++) {
        const participantStep = this.getWorkflowStep(participants[i])
        if (participantStep.name !== this.selectedParticipantStep.name) {
          await kCoreUtils.dialog({
            title: this.$t('EventLogsList.UNMATCHING_STEPS'),
            message: this.$t('EventLogsList.CANNOT_LOG_UNMATCHING_STEPS'),
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
        await this.logStep(this.form, this.selectedParticipantStep, participants[i])
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
      let properties = ['participant', 'email', 'createdAt']
      if (this.event.hasWorkflow) properties = properties.concat(['step', 'interaction'])
      const json = response.data.map(item => {
        const interaction = this.getUserInteraction(item)
        item.interaction = interaction || this.$t('EventLog.AWAITING_INFORMATION')
        // Don't use current step as the interaction can be recorded on the previous one
        item.step = (interaction ? this.getUserInteractionStep(item) : this.getWorkflowStep(item))
        // Change from step ID to label
        item.step = _.get(item, 'step.title', '')
        // Keep track of email before replacing participant object
        item.email = _.get(item, 'participant.email', '')
        // Change from object to string
        item.participant = _.get(item, 'participant.profile.name', this.$t('EventLog.UNAMED'))
        // Delete what is not exported
        return _.pick(item, properties)
      })
      const data = Papa.unparse(json)

      kCoreUtils.downloadAsBlob(data, this.$t('EventLogsList.EVENT_LOGS_EXPORT_FILE'), 'text/csv;charset=utf-8;')
    }
  },
  created () {
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
  }
}
</script>
