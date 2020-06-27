<template>
  <div>
    <k-card v-bind="$props" :itemActions="actions">
      <template v-slot:card-content>
        <q-separator />
        <!--
          Location section
         -->
        <div v-if="item.location">
          <div class="q-pa-sm row items-center">
            <k-text-area class="light-paragraph" :length="40" :text="item.location.name" />
            <q-btn icon="las la-map-marker" color="grey-7" flat dense round>
              <q-tooltip>
                {{ $t('EventCard.LOCATE_LABEL') }}
              </q-tooltip>
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <k-location-map v-model="item.location" :editable="false" />
              </q-popup-proxy>
            </q-btn>
          </div>
          <q-separator />
        </div>
        <!--
          Parcitipant section
         -->
        <div v-if="participantLabel">
          <div class="q-pa-sm">{{ participantLabel }}</div>
          <q-separator />
        </div>
        <!--
          Comment section
         -->
        <div v-if="comment">
          <k-text-area class="q-pa-sm light-paragraph" :length="20" :text="comment" />
          <q-separator />
        </div>
        <!--
          Coordinator section
         -->
        <div v-if="coordinatorLabel">
          <div class="q-pa-sm">{{ coordinatorLabel }}</div>
          <q-separator />
        </div>
        <!--
          Timestamps section
         -->
        <div v-if="createdAt || updatedAt" class="q-pa-sm">
          <cite v-if="createdAt"><small>{{$t('EventCard.CREATED_AT_LABEL')}} {{createdAt.toLocaleString()}}</small></cite><br />
          <cite v-if="updatedAt"><small>{{$t('EventCard.UPDATED_AT_LABEL')}} {{updatedAt.toLocaleString()}}</small></cite>
        </div>
      </template>
    </k-card>
    <k-modal ref="followUpModal" v-if="hasParticipantInteraction" :title="followUpTitle" :toolbar="getFollowUpToolbar()" :buttons="getFollowUpButtons()" :route="false" >
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
    mixins.eventLogs
  ],
  computed: {
    icon () {
      return this.getUserIcon(this.participantState, this.participantStep)
    },
    iconColor () {
      return _.get(this.item, 'icon.color', '')
    },
    iconName () {
      return kCoreUtils.getIconName(this.item)
    },
    comment () {
      return this.getUserComment(this.participantState)
    },
    createdAt () {
      return this.item.createdAt ? new Date(this.item.createdAt) : null
    },
    updatedAt () {
      return this.item.updatedAt ? new Date(this.item.updatedAt) : null
    },
    followUpTitle () {
      return this.participantStep.title ? this.participantStep.title : 'Enter your choice'
    },
    hasParticipantInteraction () {
      return this.waitingInteraction(this.participantStep, this.participantState, 'participant')
    }
  },
  data () {
    return {
      participantStep: {},
      participantState: {},
      participantLabel: '',
      nbParticipantsWaitingCoordination: 0,
      coordinatorLabel: ''
    }
  },
  methods: {
    canCapturePhoto () {
      if (!this.$q.platform.is.cordova) return false
      return true
    },
    getFollowUpToolbar () {
      return [{
        name: 'close-action',
        label: this.$t('EventCard.FOLLOWUP_MODAL_CLOSE_ACTION'),
        icon: 'las la-times',
        handler: () => this.$refs.followUpModal.close()
      }]
    },
    getFollowUpButtons () {
      return [{
        name: 'save-button',
        label: this.$t('EventCard.FOLLOWUP_MODAL_SAVE_BUTTON'),
        handler: () => this.logParticipantState()
      }]
    },
    getUploaderToolbar () {
      return [{
        name: 'close-action',
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
    loadService () {
      this._service = this.$api.getService('event-logs', this.contextId)
      return this._service
    },
    async loadSchema () {
      // Load layer schema if any first
      await this.loadLayerSchema(this.event.layer)
      this.schema = await this.generateSchemaForStep(this.participantStep)
      return this.schema
    },
    refreshActions () {
      // Required alias for the event logs mixin
      this.event = this.item
      // Item actions
      this.clearActions()
      if (this.$can('remove', 'events', this.contextId, this.item)) {
        this.registerMenuAction({
          name: 'remove-event', label: this.$t('EventCard.REMOVE_LABEL'), icon: 'las la-minus-circle', handler: this.removeEvent
        })
      }
      if (this.$can('update', 'events', this.contextId, this.item)) {
        this.registerPaneAction({
          name: 'edit-event',
          label: this.$t('EventCard.EDIT_LABEL'),
          icon: 'las la-file-alt',
          route: { name: 'edit-event', params: { contextId: this.contextId, objectId: this.item._id } }
        })
      }
      if (this.$can('read', 'events', this.contextId, this.item)) {
        let hasFollowUp = false
        let label = this.$t('EventCard.FOLLOW_UP_LABEL')
        let icon = 'las la-map-marked-alt'
        let warning = false
        if (this.isParticipant) {
          hasFollowUp = this.item.hasWorkflow &&
                        (this.waitingInteraction(this.participantStep, this.participantState, 'participant') ||
                         this.waitingInteraction(this.participantStep, this.participantState, 'coordinator'))
        }
        if (this.isCoordinator) {
          // If we'd like to always have a map even when no workflow available switch this value to true
          // Otherwise use the workflow flag
          hasFollowUp = true // this.item.hasWorkflow
        }
        if (hasFollowUp) {
          if (this.isParticipant) {
            icon = 'las la-comment'
            if (this.waitingInteraction(this.participantStep, this.participantState, 'participant')) {
              label = this.$t('EventCard.ACTION_REQUIRED_WARNING')
              warning = true
            } else if (this.waitingInteraction(this.participantStep, this.participantState, 'coordinator')) {
              label = this.$t('EventCard.WAITING_COORDINATION_WARNING')
              warning = true
            }
          } 
          // Participant warning if any overrides coordinator warning
          if (!warning && this.isCoordinator) {
            if (this.nbParticipantsWaitingCoordination > 0) {
              label = this.$t('EventCard.ACTION_REQUIRED_WARNING')
              warning = true
            }
          }
          if (!warning) {
            this.registerPaneAction({
              name: 'follow-up', label: label, icon, handler: this.followUp
            })
          } else {
            this.registerPaneAction({
              name: 'follow-up', label: label, icon, 
              badge: { floating: true, color: 'red', transparent: true, icon: { name: 'las la-exclamation', size: '12px' } }, 
              handler: this.followUp 
            })
          }
        }
      }
      if (this.$can('read', 'events', this.contextId, this.item)) {
        if (this.canCapturePhoto()) this.registerPaneAction({
          name: 'capture-photo', label: this.$t('EventCard.ADD_MEDIA_LABEL'), icon: 'las la-camera', handler: this.capturePhoto
        })
        this.registerPaneAction({
          name: 'add-media', label: this.$t('EventCard.ADD_MEDIA_LABEL'), icon: 'las la-paperclip', handler: this.uploadMedia
        })
        if (this.hasMedias()) this.registerPaneAction({
          name: 'browse-media', label: this.$t('EventCard.BROWSE_MEDIA_LABEL'), icon: 'las la-photo-video', 
          badge: { label: this.getMediasCount(), floating: true },
          handler: this.browseMedia
        })
      }
      if (this.hasLocation() && this.canNavigate()) {
        this.registerPaneAction({
          name: 'navigate', label: this.$t('EventCard.NAVIGATE_LABEL'), icon: 'las la-location-arrow', handler: this.launchNavigation
        })
      }
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
      const storageService = this.$api.getService('storage')
      const name = moment().format('YYYYMMDD_HHmmss.jpg')
      const id = this.item._id + '/' + name
      photoDataUri = 'data:image/jpg;base64,' + photoDataUri
      kCoreUtils.createThumbnail(photoDataUri, 200, 200, 50, async thumbnailDataUri => {
        await storageService.create({ id: id + '.thumbnail', uri: thumbnailDataUri })
      })
      await storageService.create({ id, uri: photoDataUri, name, resourcesService: 'events', resource: this.item._id, field: 'attachments' })
      this.refresh()
    },
    launchNavigation () {
      const longitude = this.item.location.longitude
      const latitude = this.item.location.latitude
      this.navigate(longitude, latitude)
    },
    removeEvent (event) {
      Dialog.create({
        title: this.$t('EventCard.REMOVE_DIALOG_TITLE', { event: event.name }),
        message: this.$t('EventCard.REMOVE_DIALOG_TITLE', { event: event.name }),
        html: true,
        ok: {
          label: this.$t('OK')
        },
        cancel: {
          label: this.$t('CANCEL')
        }
      }).onOk(() => {
        const eventsService = this.$api.getService('events', this.contextId)
        eventsService.remove(event._id, { query: { notification: this.$t('EventNotifications.REMOVE') } })
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
      } else if (this.isCoordinator) {
        this.$router.push({ name: 'event-activity', params: { objectId: this.item._id, contextId: this.contextId } })
      }
    },
    async refreshParticipantState (logs) {
      if (logs.total === 0) {
        // No last log yet => initiate the workflow by a log acting as a read receipt
        // FIXME: don't know really why but it seems that during some temporary state
        // the refresh is raised without any active logs while they are tagged as is in the DB...
        // We just add a check to avoid initiate the workflow multiple times
        const count = await this.serviceFind({
          query: {
            $limit: 0,
            participant: this.userId,
            event: this.item._id
          }
        })
        if (count.total === 0) {
          this.participantState = {}
          this.participantStep = this.getWorkflowStep() || {} // Use empty object by default to simplify display
          const log = this.createParticipantLog(this.participantStep, this.participantState)
          this.serviceCreate(log)
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
          const log = this.createParticipantLog(this.participantStep, this.participantState)
          this.serviceCreate(log)
          // Real-time event should trigger a new refresh for current state
        }
      }

      // Update actions according to user state
      this.refreshActions()
      this.participantLabel = ''
      if (this.waitingInteraction(this.participantStep, this.participantState, 'participant')) {
        this.participantLabel = this.$t('EventCard.WAITING_FOR_PARTICIPANT_LABEL')
      } else if (this.waitingInteraction(this.participantStep, this.participantState, 'coordinator')) {
        this.participantLabel = this.$t('EventCard.WAITING_FOR_COORDINATOR_LABEL')
      }
    },
    subscribeParticipantLog () {
      // Remove previous listener if any
      this.unsubscribeParticipantLog()
      this.participantLogListener = this.loadService().watch({ listStrategy: 'always' })
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
      this.nbParticipantsWaitingCoordination = logs.data.filter(
        log => (log.stakeholder === 'coordinator') && !this.hasStateInteraction(log)
      ).length
      // Update actions according to user state
      this.refreshActions()
      // Then label
      if (this.nbParticipantsWaitingCoordination > 0) {
        this.coordinatorLabel = this.$t('EventCard.PARTICPANTS_AWAITING_LABEL', { number: this.nbParticipantsWaitingCoordination })
      } else {
        this.coordinatorLabel = this.$t('EventCard.NO_PARTICPANTS_AWAITING_LABEL')
      }
      if (logs.data.length < logs.total) {
        this.$events.$emit('error', new Error(this.$t('errors.EVENT_LOG_LIMIT')))
      }
    },
    subscribeCoordinatorLog () {
      // Remove previous listener if any
      this.unsubscribeCoordinatorLog()
      this.coordinatorLogListener = this.loadService().watch({ listStrategy: 'smart' })
        .find({
          query: {
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
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-form'] = this.$load('form/KForm')
    this.$options.components['k-uploader'] = this.$load('input/KUploader')
    this.$options.components['k-media-browser'] = this.$load('media/KMediaBrowser')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
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
  .card-separator {
    margin: 8px
  }
</style>
