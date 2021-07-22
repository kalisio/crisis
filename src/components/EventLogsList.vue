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
      :service="getService()" 
      :renderer="renderer" 
      :contextId="contextId"
      :base-query="baseQuery" 
      :filter-query="filterQuery" 
      :list-strategy="'smart'"
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
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

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
      selectedParticipantStep: {}
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
    getService () {
      // Archived mode ?
      return (this.archived ? 'archived-event-logs' : 'event-logs')
    },
    async loadSchema () {
      // Load layer schema if any first
      await this.loadLayerSchema(this.event.layer)
      this.schema = await this.generateSchemaForStep(this.selectedParticipantStep)
      return this.schema
    },
    onCollectionRefreshed (items) {
      // Process logs to make it usable as a more conveninet object by adding icon, etc.
      this.$refs.list.items = this.processStates(items)
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
        handler: () => this.logParticipantState()
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
    async logParticipantState () {
      await this.logStep(this.$refs.form, this.selectedParticipantStep, this.selectedParticipantState)
      this.$refs.followUpModal.close()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-list'] = this.$load('collection/KList')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
  }
}
</script>
