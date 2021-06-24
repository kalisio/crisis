<template>
  <div>
    <k-card 
      v-bind="$props" 
      :header="header" 
      :actions="itemActions" 
      :bind-actions="false"
      :dense="dense">
      <!--
        Card content
       -->
      <template v-slot:card-content>
         <!-- location section -->
        <k-card-section :title="$t('EventCard.LOCATION_SECTION')" :actions="locationActions" :dense="dense" :context="$props">
          <div v-if="item.location" class="row items-center justify-between no-wrap">
            <k-text-area class="light-paragraph" :text="locationName" />
            <q-btn icon="las la-map-marker" color="grey-7" flat dense round>
              <q-tooltip>
                {{ $t('EventCard.LOCATE_LABEL') }}
              </q-tooltip>
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-card style="width: 350px; height: 400px">
                  <k-location-map v-model="item.location" :editable="false" />
                </q-card>
              </q-popup-proxy>
            </q-btn>
          </div>
          <div v-else>
            <k-stamp :text="'EventCard.UNDEFINED_LOCATION_LABEL'" direction="horizontal" />
          </div>
        </k-card-section>
        <!-- Parcitipants section -->
        <k-card-section :title="$t('EventCard.PARTICIPANTS_SECTION')" :actions="participantsActions" :dense="dense" :context="$props">
          <div v-if="participantLabel">{{ participantLabel }}</div>
        </k-card-section>
        <!-- Comment section -->
         <k-card-section :title="$t('EventCard.COMMENT_SECTION')" :dense="dense"> 
          <k-text-area v-if="comment" class="light-paragraph" :text="comment" :length="100" />
         </k-card-section>
        <!-- Coordinators section -->
        <k-card-section :title="$t('EventCard.COORDINATORS_SECTION')" :actions="coordinatatorsActions" :dense="dense" :context="$props">
          <div v-if="coordinatorLabel">{{ coordinatorLabel }}</div>
        </k-card-section>
        <!-- Timestamps section -->
        <k-card-section :dense="dense">
          <div v-if="createdAt || updatedAt">
            <cite v-if="createdAt"><small>{{$t('EventCard.CREATED_AT_LABEL')}} {{createdAt.toLocaleString()}}</small></cite><br />
            <cite v-if="updatedAt"><small>{{$t('EventCard.UPDATED_AT_LABEL')}} {{updatedAt.toLocaleString()}}</small></cite>
          </div>
        </k-card-section>
      </template>
    </k-card>
    <k-modal ref="followUpModal" v-if="hasParticipantInteraction" :title="followUpTitle" :buttons="getFollowUpButtons()">
      <div slot="modal-content">
        <k-form ref="form" :schema="schema"/>
      </div>
    </k-modal>
    <k-modal ref="uploaderModal" :toolbar="getUploaderToolbar()" >
      <div slot="modal-content">
        <k-uploader ref="uploader" :resource="item._id" :base-query="uploaderQuery()"
          :options="uploaderOptions()" @uploader-ready="initializeMedias"/>
      </div>
    </k-modal>
    <k-media-browser ref="mediaBrowser" :options="mediaBrowserOptions()" />
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { Dialog } from 'quasar'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'
import mixins from '../mixins'

export default {
  name: 'event-card',
  mixins: [
    kCoreMixins.baseItem,
    kCoreMixins.service,
    kCoreMixins.schemaProxy,
    kCoreMixins.refsResolver(['form']),
    kMapMixins.navigator,
    mixins.events,
    mixins.alerts
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
      let components = _.filter(this.itemActions, { scope: 'header' })
      components.splice(0, 0, { component: 'QSpace' })
      if (this.item.objective) components.splice(0, 0, {
        component: 'QBadge', label: this.item.objective, color: 'grey-7'
      })
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
    locationName () {
      // Event generated from alert ?
      return (this.item.alert ? this.getAlertLocationName(this.item.alert) : _.get(this.item, 'location.name', ''))
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
    followUpTitle () {
      return this.participantStep.title ? this.participantStep.title : 'Enter your choice'
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
    coordinatatorsActions () {
      return _.filter(this.itemActions, { scope: 'coordinators' })
    },
  },
  data () {
    return {
      participantStep: {},
      participantState: {},
      participantLabel: '',
      nbParticipantsWaitingCoordination: 0,
      coordinatorLabel: '',
      zoomDescription: false
    }
  },
  methods: {
    getDescription () {
      // Event generated from alert ?
      return this.item.alert ? this.getAlertDetailsAsHtml(this.item.alert) : this.item.description
    },
    canCapturePhoto () {
      if (!this.$q.platform.is.cordova) return false
      return true
    },
    getFollowUpButtons () {
      return [{
        id: 'save-button',
        label: this.$t('EventCard.FOLLOWUP_MODAL_SAVE_BUTTON'),
        renderer: 'form-button',
        handler: () => this.logParticipantState()
      }]
    },
    getUploaderToolbar () {
      return [{
        id: 'close-action',
        label: this.$t('EventCard.UPLOADER_MODAL_CLOSE_ACTION'),
        icon: 'las la-times',
        handler: () => {
          this.$refs.uploaderModal.close()
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
      // Load layer schema if any first
      await this.loadLayerSchema(this.event.layer)
      this.schema = await this.generateSchemaForStep(this.participantStep)
      return this.schema
    },
    configureActions () {
      // Required alias for the event logs mixin
      this.event = this.item
      // Generate configured actions
      kCoreMixins.baseItem.methods.configureActions.call(this)
      let hasFollowUp = false
      let tooltip = this.$t('EventCard.FOLLOW_UP_LABEL')
      let warning = false
      if (this.isParticipant) {
        hasFollowUp = this.item.hasWorkflow &&
                      (this.waitingInteraction(this.participantStep, this.participantState, 'participant') ||
                       this.waitingInteraction(this.participantStep, this.participantState, 'coordinator'))
      }
      if (this.isCoordinator) {
        hasFollowUp |= this.item.hasWorkflow &&
                       (this.nbParticipantsWaitingCoordination > 0)
      }
      if (hasFollowUp) {
        if (this.isParticipant) {
          if (this.waitingInteraction(this.participantStep, this.participantState, 'participant')) {
            tooltip = this.participantStep.title + ' : ' + this.$t('EventCard.ACTION_REQUIRED_WARNING')
            warning = true
          } else if (this.waitingInteraction(this.participantStep, this.participantState, 'coordinator')) {
            tooltip = this.participantStep.title + ' : ' + this.$t('EventCard.WAITING_COORDINATION_WARNING')
            warning = true
          }
        } 
        // Participant warning if any overrides coordinator warning
        if (!warning && this.isCoordinator) {
          if (this.nbParticipantsWaitingCoordination > 0) {
            tooltip = this.$t('EventCard.ACTION_REQUIRED_WARNING')
            warning = true
          }
        }
        if (!warning) {
          this.itemActions.splice(0, 0, {
            id: 'follow-up', tooltip, icon: 'las la-comment',
            visible: this.$can('read', 'events', this.contextId, this.item), handler: this.followUp
          })
        } else {
          this.itemActions.splice(0, 0, {
            id: 'follow-up', tooltip, icon: 'las la-comment', 
            badge: { floating: true, color: 'red', transparent: true, icon: { name: 'las la-exclamation', size: '12px' } }, 
            visible: this.$can('read', 'events', this.contextId, this.item), handler: this.followUp
          })
        }
      }
      // Find the add media action and push the browse media action just after
      const index = _.findIndex(this.itemActions, (action) => action.id === 'add-media')
      this.itemActions.splice(index + 1, 0, {
        id: 'browse-media', tooltip: 'EventCard.BROWSE_MEDIA_LABEL', icon: 'las la-photo-video', handler: this.browseMedia, 
        badge: { label: this.mediasCount().toString(), floating: true },
        visible: this.hasMedias() && this.$can('read', 'events', this.contextId, this.item)
      })
    },
    uploadMedia () {
      this.$refs.uploaderModal.open()
      // If the modal has already been created the uploader is ready otherwise wait for event
      if (this.$refs.uploader) this.initializeMedias()
    },
    initializeMedias () {
      this.$refs.uploader.initialize(this.item.attachments)
      // Open file dialog the first time
      if (!this.item.attachments || (this.item.attachments.length === 0)) this.$refs.uploader.openFileInput()
    },
    browseMedia () {
      this.$refs.mediaBrowser.show(this.item.attachments)
    },
    capturePhoto () {
      navigator.camera.getPicture(this.onPhotoCaptured, null, {
        correctOrientation: true,
        quality: 75,
        destinationType: navigator.camera.DestinationType.DATA_URL,
        sourceType: navigator.camera.PictureSourceType.CAMERA
      })
    },
    async onPhotoCaptured (photoDataUri) {
      const storageService = this.$api.getService('storage', this.contextId)
      const name = moment().format('YYYYMMDD_HHmmss.jpg')
      const id = this.item._id + '/' + name
      photoDataUri = 'data:image/jpg;base64,' + photoDataUri
      kCoreUtils.createThumbnail(photoDataUri, 200, 200, 50, async thumbnailDataUri => {
        // Store once everything has been computed
        await storageService.create({ id: id + '.thumbnail', uri: thumbnailDataUri })
        await storageService.create({ id, uri: photoDataUri, name,
          resourcesService: 'events', resource: this.item._id, field: 'attachments',
          notification: this.$t('EventNotifications.UPDATE_MEDIA') })
        this.refresh()
      })
    },
    launchNavigation () {
      const longitude = this.item.location.longitude
      const latitude = this.item.location.latitude
      this.navigate(longitude, latitude)
    },
    removeEvent () {
      Dialog.create({
        title: this.$t('EventCard.REMOVE_DIALOG_TITLE', { event: this.item.name }),
        message: this.$t('EventCard.REMOVE_DIALOG_TITLE', { event: this.item.name }),
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
        eventsService.remove(this.item._id, { query: { notification: this.$t('EventNotifications.REMOVE') } })
      })
    },
    async followUp () {
      if (this.hasParticipantInteraction) {
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
      } else if (this.isCoordinator) {
        this.$router.push({ name: 'event-activity', params: { objectId: this.item._id, contextId: this.contextId } })
      }
    },
    viewMap () {
      this.$router.push({ name: 'event-activity', params: { objectId: this.item._id, contextId: this.contextId } })
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
            this.Create(log)
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
      // Awaiting status in priority
      if (this.waitingInteraction(this.participantStep, this.participantState, 'participant')) {
        this.participantLabel = this.participantStep.title + ' : ' + this.$t('EventCard.WAITING_FOR_PARTICIPANT_LABEL')
      } else if (this.waitingInteraction(this.participantStep, this.participantState, 'coordinator')) {
        this.participantLabel = this.participantStep.title + ' : ' + this.$t('EventCard.WAITING_FOR_COORDINATOR_LABEL')
      } else if (interaction) {
        // Don't use current step here as the interaction can be recorded on the previous one
        const step = this.getUserInteractionStep(this.participantState)
        this.participantLabel = step.title + ' : ' + interaction
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
        } else {
          this.coordinatorLabel = this.$t('EventCard.NO_PARTICPANTS_AWAITING_LABEL')
        }
        if (logs.data.length < logs.total) {
          this.$events.$emit('error', new Error(this.$t('errors.EVENT_LOG_LIMIT')))
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
        if (this.item.alert) this.loadAlertLayer(this.item.alert)
        // Update content according to user role
        if (this.isParticipant) {
          this.subscribeParticipantLog()
        }
        if (this.isCoordinator) {
          this.subscribeCoordinatorLog()
        }
      }
    },
    async logParticipantState () {
      await this.logStep(this.$refs.form, this.participantStep, this.participantState)
      this.$refs.followUpModal.close()
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-form'] = this.$load('form/KForm')
    this.$options.components['k-uploader'] = this.$load('input/KUploader')
    this.$options.components['k-media-browser'] = this.$load('media/KMediaBrowser')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
  },
  created () {
    // Required alias for the event logs mixin
    this.event = this.item
    // Set the required actor
    if (this.$store.get('user')) this.refresh()
    this.$events.$on('user-changed', this.refresh)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refresh)
    this.unsubscribeParticipantLog()
    this.unsubscribeCoordinatorLog()
  }
}
</script>

<style>
  .event-card-description {
    transition: font-size .2s;
  }
  .event-card-description-zoomed {
    font-size: larger;
  }
</style>
