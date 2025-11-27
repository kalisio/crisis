<template>
  <div>
    <Card
      v-bind="$props"
      :header="header"
      :actions="itemActions"
      :bind-actions="false"
      :dense="dense"
      :expandable="true"
      @expanded="isExpanded = true"
      @collapsed="isExpanded = false">
      <!--
        Card content
       -->
      <template v-slot:card-content>
        <!-- Plan section is only visible in event dashbord -->
        <KCardSection
          v-if="planName"
          :title="$t('EventCard.PLAN_SECTION')"
          :hideHeader="!isExpanded"
          :actions="planActions"
          :context="$props"
          :dense="dense"
        >
          <div class="row full-width items-center">
          <q-badge :color="planColor" :multi-line="true">
            {{ planName }}
            <q-tooltip v-if="planDescription">
              {{ planDescription }}
            </q-tooltip>
          </q-badge>
          <q-space />
          <k-panel v-if="!isExpanded" :content="planActions" :context="$props" />
          <KStamp v-if="!planName" :text="'EventCard.UNDEFINED_PLAN_LABEL'" direction="horizontal" />
          </div>
        </KCardSection>
        <!-- Objective section is only visible in plan dashbord -->
        <KCardSection
          v-if="plan && !planName && (isExpanded || objective)"
          :title="$t('EventCard.OBJECTIVE_SECTION')"
          :hideHeader="!isExpanded"
          :actions="objectiveActions"
          :context="$props"
          :dense="dense"
        >
          <q-badge v-if="objective" :label="objective" color="grey-7" :multi-line="true" />
          <KStamp v-else :text="'EventCard.UNDEFINED_OBJECTIVE_LABEL'" direction="horizontal" />
        </KCardSection>
        <!-- Interaction section -->
        <KCardSection v-if="participantLabel || coordinatorLabel"
          :context="$props"
          :dense="dense"
        >
          <div v-if="participantLabel" v-html="participantLabel"></div>
          <div v-if="coordinatorLabel" v-html="coordinatorLabel"></div>
        </KCardSection>
        <!-- Comment section -->
        <KCardSection v-if="comment"
          :title="$t('EventCard.COMMENT_SECTION')"
          :dense="dense">
          <k-text-area class="light-paragraph" :text="comment" :length="100" />
        </KCardSection>
        <!-- Location section -->
        <KLocationCardSection
          v-if="isExpanded"
          :item="item"
          :actions="locationActions"
          :context="$props"
          :dense="dense"
        />
        <!-- Participants section -->
        <KCardSection
          v-if="isExpanded"
          :title="$t('EventCard.PARTICIPANTS_SECTION')"
          :actions="participantsActions"
          :context="$props"
          :dense="dense"
        >
          <div v-if="hasParticipants">
            <ChipsPane
              class="q-pl-sm"
              :chips="item.participants"
              :value-path="['profile.name', 'value', 'name']"
              :removable="canEditItem()"
              @chip-removed="onParticipantRemoved" />
          </div>
          <div v-else>
            {{ $t('EventCard.UNDEFINED_PARTICIPANTS_LABEL')}}
          </div>
        </KCardSection>
        <!-- Coordinators section -->
        <KCardSection v-if="isExpanded"
          :title="$t('EventCard.COORDINATORS_SECTION')"
          :actions="coordinatorsActions"
          :context="$props"
          :dense="dense"
        >
          <ChipsPane
            class="q-pl-sm"
            :chips="item.coordinators"
            :value-path="['profile.name', 'value', 'name']"
            :removable="canEditItem()"
            @chip-removed="onCoordinatorRemoved" />
        </KCardSection>
        <!-- Timestamps section -->
        <KCardSection v-if="isExpanded" :dense="dense">
          <div v-if="createdAt || updatedAt || expireAt">
            <cite v-if="createdAt">
              <small>{{ $t('EventCard.CREATED_AT_LABEL') }} {{ createdAt.toLocaleString() }}</small>
            </cite>
            <br />
            <cite v-if="updatedAt">
              <small>{{ $t('EventCard.UPDATED_AT_LABEL') }} {{ updatedAt.toLocaleString() }}</small>
            </cite>
            <br />
            <cite v-if="expireAt">
              <small>{{ $t('EventCard.EXPIRE_AT_LABEL') }} {{ expireAt.toLocaleString() }}</small>
            </cite>
          </div>
        </KCardSection>
      </template>
    </Card>
    <!--
      Follow up modal
    -->
    <k-modal ref="followUpModal" v-if="hasParticipantInteraction"
      :title="followUpTitle"
      :buttons="getFollowUpButtons()"
    >
      <k-form :ref="onFollowUpFormCreated" :schema="schema"/>
    </k-modal>
    <!--
      Logs modal
    -->
    <k-modal ref="eventLogsModal"
      :title="$t('EventCard.EVENT_LOGS_MODAL_TITLE')"
      :toolbar="getEventLogsToolbar()"
      :buttons="getEventLogsButtons()"
    >
      <event-logs-list ref="eventLogsList" :contextId="contextId" :event="item"/>
    </k-modal>
    <!--
      Media browser
    -->
    <MediaBrowser ref="mediaBrowser" :options="mediaBrowserOptions()"/>
  </div>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils, Storage } from '@kalisio/kdk/core.client'
import { Navigator } from '@kalisio/kdk/map.client.map'
import { useAlerts, useOrganisations } from '../composables'
import mixins from '../mixins'
import ChipsPane from './ChipsPane.vue'
import MediaBrowser from './MediaBrowser.vue'
import Card from './Card.vue'

export default {
  name: 'event-card',
  components: {
    EventLogsList: kCoreUtils.loadComponent('EventLogsList'),
    ChipsPane,
    MediaBrowser,
    Card
  },
  mixins: [
    kCoreMixins.baseItem,
    kCoreMixins.service,
    kCoreMixins.schemaProxy,
    mixins.events
  ],
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    item: function () {
      // Some actions are not fully reactive and need to be updated manually
      this.configureActions()
    }
  },
  computed: {
    header () {
      let components = []
      if (this.isExpanded) {
        components.push({ component: 'QSpace' })
        components = components.concat(_.filter(this.itemActions, { scope: 'header' }))
      }
      return components
    },
    icon () {
      return kCoreUtils.getIconName(this.getUserIcon(this.participantState, this.participantStep))
    },
    iconColor () {
      return _.get(this.item, 'icon.color', '')
    },
    iconName () {
      return kCoreUtils.getIconName(this.item)
    },
    hasDescription () {
      return !_.isEmpty(this.description)
    },
    descriptionActions () {
      return _.filter(this.itemActions, { scope: 'description' })
    },
    plan () {
      return this.item.plan
    },
    planName () {
      // Plan is only populated when required
      return _.get(this.item, 'plan.name')
    },
    planColor () {
      // Plan is only populated when required
      return _.get(this.item, 'plan.icon.color', 'grey-7')
    },
    planDescription () {
      // Plan is only populated when required
      return _.get(this.item, 'plan.description')
    },
    planActions () {
      return _.filter(this.itemActions, { scope: 'plan' })
    },
    objective () {
      return this.item.objective
    },
    objectiveActions () {
      return _.filter(this.itemActions, { scope: 'objective' })
    },
    locationActions () {
      return _.filter(this.itemActions, { scope: 'location' })
    },
    comment () {
      return this.getUserComment(this.participantState)
    },
    participantsActions () {
      return _.filter(this.itemActions, { scope: 'participants' })
    },
    hasParticipants () {
      return !_.isEmpty(this.item.participants)
    },
    coordinatorsActions () {
      return _.filter(this.itemActions, { scope: 'coordinators' })
    },
    followUpTitle () {
      return this.participantStep.title ? this.participantStep.title : this.$t('EventCard.FOLLOW_UP_MODAL_TITLE')
    },
    hasParticipantInteraction () {
      return this.waitingInteraction(this.participantStep, this.participantState, 'participant')
    },
    createdAt () {
      return this.item.createdAt ? new Date(this.item.createdAt) : null
    },
    updatedAt () {
      return this.item.updatedAt ? new Date(this.item.updatedAt) : null
    },
    expireAt () {
      return this.item.expireAt ? new Date(this.item.expireAt) : null
    },
    hasPosition () {
      return _.has(this.item, 'location.geometry.coordinates')
    },
    contextId () {
      const { CurrentOrganisation } = useOrganisations()
      return CurrentOrganisation.value._id
    }
  },
  data () {
    return {
      participantStep: {},
      participantState: {},
      participantLabel: '',
      nbParticipantsWaitingCoordination: 0,
      coordinatorLabel: '',
      zoomedDescription: false,
      isExpanded: false
    }
  },
  methods: {
    getFollowUpButtons () {
      return [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.$refs.followUpModal.close() },
        { id: 'save-button', label: this.$t('EventCard.FOLLOWUP_MODAL_SAVE_BUTTON'), renderer: 'form-button', handler: () => this.logParticipantState() }
      ]
    },
    getEventLogsToolbar () {
      return [{
        id: 'export-data',
        tooltip: this.$t('EventCard.EVENT_LOGS_MODAL_EXPORT_DATA_LABEL'),
        icon: 'las la-file-download',
        handler: () => {
          this.$refs.eventLogsList.downloadEventLogsData()
        }
      }]
    },
    getEventLogsButtons () {
      return [{
        id: 'close-action',
        label: this.$t('EventCard.EVENT_LOGS_MODAL_CLOSE_ACTION'),
        icon: 'las la-times',
        renderer: 'form-button',
        handler: () => {
          this.$refs.eventLogsModal.close()
          this.refresh()
        }
      }]
    },
    getLocationToolbar () {
      return [{
        name: 'close-action',
        label: this.$t('EventCard.LOCATION_MAP_MODAL_CLOSE_ACTION'),
        icon: 'las la-times',
        handler: () => this.$refs.locationModal.close()
      }]
    },
    getService () {
      return this.$api.getService('event-logs', this.contextId)
    },
    async loadSchema () {
      this.schema = this.generateSchemaForStep(this.participantStep)
      return this.schema
    },
    configureActions () {
      // Required alias for the event logs mixin
      this.event = this.item
      this.refreshUser()
      // Generate configured actions
      kCoreMixins.baseItem.methods.configureActions.call(this)
      if (this.isParticipant) {
        const hasFollowUp = this.item.hasWorkflow &&
                      (this.waitingInteraction(this.participantStep, this.participantState, 'participant') ||
                       this.waitingInteraction(this.participantStep, this.participantState, 'coordinator'))
        if (hasFollowUp) {
          const followUpAction = {
            id: 'follow-up',
            icon: 'las la-comment',
            scope: 'footer',
            badge: { floating: true, color: 'red', transparent: true, icon: { name: 'las la-exclamation', size: '12px' } },
            visible: this.$can('read', 'events', this.contextId, this.item),
            handler: this.followUp
          }
          if (this.waitingInteraction(this.participantStep, this.participantState, 'participant')) {
            followUpAction.tooltip = this.participantStep.title + ' : ' + this.$t('EventCard.ACTION_REQUIRED_WARNING')
          } else if (this.waitingInteraction(this.participantStep, this.participantState, 'coordinator')) {
            followUpAction.tooltip = this.participantStep.title + ' : ' + this.$t('EventCard.WAITING_COORDINATION_WARNING')
          }
          this.itemActions.splice(0, 0, followUpAction)
        }
      }
      if (this.isCoordinator) {
        const followUpAction = {
          id: 'event-logs',
          tooltip: this.$t('EventCard.EVENT_LOGS_LABEL'),
          icon: 'las la-users',
          scope: 'footer',
          visible: this.$can('update', 'events', this.contextId, this.item),
          handler: this.eventLogs
        }
        const hasFollowUp = this.item.hasWorkflow && (this.nbParticipantsWaitingCoordination > 0)
        if (hasFollowUp) {
          followUpAction.tooltip += ' : ' + this.$t('EventCard.ACTION_REQUIRED_WARNING')
          followUpAction.badge = { floating: true, color: 'red', transparent: true, icon: { name: 'las la-exclamation', size: '12px' } }
        }
        this.itemActions.splice(0, 0, followUpAction)
      }
      const browseAction = {
        id: 'browse-media',
        tooltip: 'EventCard.BROWSE_MEDIA_LABEL',
        icon: 'las la-photo-video',
        scope: 'footer',
        handler: this.browseMedia,
        visible: this.$can('read', 'events', this.contextId, this.item)
      }
      // Add badge with media if any
      if (this.mediasCount() > 0) browseAction.badge = { label: this.mediasCount().toString(), floating: true }
      // Find the event map action and push the browse media action just before
      const index = _.findIndex(this.itemActions, (action) => action.id === 'event-map')
      this.itemActions.splice(index, 0, browseAction)
    },
    getLatitude () {
      return _.get(this.item, 'location.geometry.coordinates[1]')
    },
    getLongitude () {
      return _.get(this.item, 'location.geometry.coordinates[0]')
    },
    onNavigateTo () {
      if (this.hasPosition) Navigator.navigateTo(this.getLatitude(), this.getLongitude())
    },
    browseMedia () {
      this.$refs.mediaBrowser.show(this.attachments)
    },
    removeEvent () {
      this.showRemoveEventDialog(this.item)
    },
    followUp () {
      if (this.hasParticipantInteraction) {
        this.$refs.followUpModal.open()
      } else if (this.isCoordinator) {
        this.$router.push({
          name: 'event-activity',
          params: { objectId: this.item._id, contextId: this.contextId },
          // Depending if event is in a plan we get it as ID or object
          query: { plan: _.get(this.item, 'plan._id', _.get(this.item, 'plan')) }
        })
      }
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
    async eventLogs () {
      this.$refs.eventLogsModal.open()
    },
    viewMap () {
      this.$router.push({
        name: 'event-activity',
        params: { objectId: this.item._id, contextId: this.contextId },
        // Depending if event is in a plan we get it as ID or object
        query: { plan: _.get(this.item, 'plan._id', _.get(this.item, 'plan')) }
      })
    },
    async refreshParticipantState (logs) {
      // As we also update the previous log state in the backend the refresh can be raised
      // while logs are in a "temporary" state in the DB...
      // FIXME: we should probably use a transaction to make things better
      // Meanwhile, we add checks to avoid initiate the same logs multiple times
      if (this.refreshInProgress) return // Avoid reentrance
      this.refreshInProgress = true
      try {
        // No last log yet => initiate the workflow by a log acting as a read receipt
        if (logs.total === 0) {
          const count = await this.getService().find({
            query: {
              $limit: 0,
              participant: this.userId,
              event: this.item._id
            }
          })
          if (count.total === 0) {
            this.participantState = {}
            this.participantStep = this.getWorkflowStep() || {} // Use empty object by default to simplify display
            const log = await this.createParticipantLog(this.participantStep, this.participantState)
            this.getService().create(log)
            // Real-time event should trigger a new refresh for current state
          }
        } else if (logs.data.length > 0) {
          this.participantState = logs.data[0]
          this.participantStep = this.getWorkflowStep(this.participantState) || {} // Use empty object by default to simplify display
          // When no workflow to be fulfilled
          if (_.isEmpty(this.participantStep)) return
          // When participant has just fullfilled a step we need to initiate the next one (if any) by a log acting as a read receipt
          // We know this when we get a higher step in workflow from the current state
          if (this.isBeforeInWorkflow(this.participantState.step, this.participantStep.name)) {
            const count = await this.getService().find({
              query: {
                $limit: 0,
                participant: this.userId,
                event: this.item._id,
                step: this.participantStep.name
              }
            })
            if (count.total === 0) {
              const log = await this.createParticipantLog(this.participantStep, this.participantState)
              this.getService().create(log)
              // Real-time event should trigger a new refresh for current state
            }
          }
        }
      } catch (_) {
      }
      // Update actions according to user state
      this.configureActions()
      this.participantLabel = ''
      const interaction = this.getUserInteraction(this.participantState)
      if (interaction) {
        // Don't use current step here as the interaction can be recorded on the previous one
        const step = this.getUserInteractionStep(this.participantState)
        this.participantLabel = step.title + ' : ' + interaction + '</br>'
      }
      // Awaiting status
      if (this.waitingInteraction(this.participantStep, this.participantState, 'participant')) {
        this.participantLabel += this.participantStep.title + ' : ' + this.$t('EventCard.WAITING_FOR_PARTICIPANT_LABEL')
      } else if (this.waitingInteraction(this.participantStep, this.participantState, 'coordinator')) {
        this.participantLabel += this.participantStep.title + ' : ' + this.$t('EventCard.WAITING_FOR_COORDINATOR_LABEL')
      }
      this.refreshInProgress = false
    },
    subscribeParticipantLog () {
      // Remove previous listener if any
      this.unsubscribeParticipantLog()
      this.participantLogListener = this.getService().watch({ listStrategy: 'always' })
        .find({
          query: {
            $sort: { createdAt: -1 }, // sort by newest ones
            $limit: 1,
            participant: this.userId,
            event: this.item._id,
            lastInEvent: true
          }
        })
      // We can then load the last state of the user
        .subscribe(this.refreshParticipantState)
    },
    unsubscribeParticipantLog () {
      if (this.participantLogListener) {
        this.participantLogListener.unsubscribe()
        this.participantLogListener = null
      }
    },
    refreshCoordinatorState (logs) {
      if (this.refreshInProgress) return // Avoid reentrance
      this.refreshInProgress = true
      try {
        this.nbParticipantsWaitingCoordination = logs.data.filter(
          log => (log.stakeholder === 'coordinator') && !this.hasStateInteraction(log)
        ).length
        // Update actions according to user state
        this.configureActions()
        // Then label
        if (this.nbParticipantsWaitingCoordination > 0) {
          this.coordinatorLabel = this.$t('EventCard.PARTICPANTS_AWAITING_LABEL', { number: this.nbParticipantsWaitingCoordination })
        } else if (this.item.hasWorkflow) {
          this.coordinatorLabel = this.$t('EventCard.NO_PARTICPANTS_AWAITING_LABEL')
        }
        if (logs.data.length < logs.total) {
          this.$events.emit('error', new Error(this.$t('errors.EVENT_LOG_LIMIT')))
        }
      } catch (_) {
      }
      this.refreshInProgress = false
    },
    subscribeCoordinatorLog () {
      // Remove previous listener if any
      this.unsubscribeCoordinatorLog()
      this.coordinatorLogListener = this.getService().watch({ listStrategy: 'smart' })
        .find({
          query: {
            $sort: { createdAt: -1 }, // sort by newest ones
            event: this.item._id,
            lastInEvent: true
          }
        })
      // We can then load the last state of the user
        .subscribe(this.refreshCoordinatorState)
    },
    unsubscribeCoordinatorLog () {
      if (this.coordinatorLogListener) {
        this.coordinatorLogListener.unsubscribe()
        this.coordinatorLogListener = null
      }
    },
    refresh () {
      this.refreshUser()
      if (this.userId) {
        if (this.item.alert) {
          this.loadAlertLayer(this.item.alert)
          // When created from alert automatically fill the description in if not overriden by user content
          if (!this.item.description) this.item.description = this.getAlertDetailsAsHtml(this.item.alert)
        }
        // Update content according to user role
        if (this.isParticipant) {
          this.subscribeParticipantLog()
        }
        if (this.isCoordinator) {
          this.subscribeCoordinatorLog()
        }
      }
    },
    async refreshAttachments () {
      await this.loadAttachments()
      // Some actions depends on medias
      this.configureActions()
    },
    async logParticipantState () {
      await this.logStep(this.form, this.participantStep, this.participantState)
      this.$refs.followUpModal.close()
    },
    async onParticipantRemoved (chip) {
      const service = this.$api.getService('events', this.contextId)
      const participants = this.item.participants.filter(participant => participant._id !== chip._id)
      await service.patch(this.item._id, { participants })
    },
    async onCoordinatorRemoved (chip) {
      const service = this.$api.getService('events', this.contextId)
      const coordinators = this.item.coordinators.filter(coordinator => coordinator._id !== chip._id)
      await service.patch(this.item._id, { coordinators })
    }
  },
  async created () {
    // Required alias for the event logs mixin
    this.event = this.item
    await this.refreshAttachments()
    // Set the required actor
    if (this.$store.get('user')) this.refresh()
    this.$events.on('user-changed', this.refresh)
    // Keep track of changes on medias once loaded
    const storageService = Storage.getService(this.contextId)
    storageService.on('object-put', this.refreshAttachments)
    storageService.on('multipart-upload-completed', this.refreshAttachments)
    storageService.on('removed', this.refreshAttachments)
  },
  beforeUnmount () {
    // Releases listeners
    const storageService = Storage.getService(this.contextId)
    storageService.off('object-put', this.refreshAttachments)
    storageService.off('multipart-upload-completed', this.refreshAttachments)
    storageService.off('removed', this.refreshAttachments)
    this.$events.off('user-changed', this.refresh)
    this.unsubscribeParticipantLog()
    this.unsubscribeCoordinatorLog()
  },
  setup () {
    return {
      ...useAlerts()
    }
  }
}
</script>

<style lang="scss">
  .event-card-description {
    transition: font-size .2s;
  }
  .event-card-description-zoomed {
    font-size: larger;
  }
</style>
