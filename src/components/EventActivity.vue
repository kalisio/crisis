<template>
  <k-page :padding="false">
    <template v-slot:page-content>
      <!--
        Map
       -->
      <div ref="map" :style="viewStyle">
        <q-resize-observer @resize="onMapResized" />
      </div>
      <!--
        NavigationBar
       -->
      <q-page-sticky position="top">
        <k-opener-proxy position="top" component="KNavigationBar" :opened="true" />
      </q-page-sticky>
      <!--
        TimeLine
       -->
      <q-page-sticky position="bottom">
        <k-opener-proxy position="bottom" component="KTimeline" />
      </q-page-sticky>
      <!--
        ColorLegend
       -->
      <q-page-sticky position="left" :offset="[18, 0]">
        <k-color-legend />
      </q-page-sticky>

    <k-modal ref="uploaderModal" :toolbar="getUploaderToolbar()">
      <div slot="modal-content">
        <k-uploader ref="uploader" :resource="objectId" :base-query="uploaderQuery()"
          :options="uploaderOptions()" @uploader-ready="initializeMedias"/>
      </div>
    </k-modal>

    <k-media-browser ref="mediaBrowser" :options="mediaBrowserOptions()" />
    <router-view service="events" :router="router()"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'
import mixins from '../mixins'

const activityMixin = kMapMixins.activity('event')

export default {
  name: 'event-activity',
  provide () {
    return {
      kActivity: this,
      kMap: this
    }
  },
  mixins: [
    kCoreMixins.refsResolver(['map']),
    kCoreMixins.baseActivity,
    kCoreMixins.baseCollection,
    kMapMixins.featureSelection,    
    kMapMixins.featureService,
    kMapMixins.style,
    kMapMixins.infobox,
    kMapMixins.weacast,
    kMapMixins.time,
    activityMixin,
    kMapMixins.map.baseMap,
    kMapMixins.map.geojsonLayers,
    kMapMixins.map.forecastLayers,
    kMapMixins.map.fileLayers,
    kMapMixins.map.editLayers,
    kMapMixins.map.style,
    kMapMixins.map.tooltip,
    kMapMixins.map.popup,
    kMapMixins.map.activity,
    kMapMixins.map.tiledMeshLayers,
    kMapMixins.map.tiledWindLayers,
    kMapMixins.map.mapillaryLayers,
    mixins.eventLogs
  ],
  props: {
    contextId: {
      type: String,
      required: true
    },
    objectId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      filter: null,
      event: {},
      participants: []
    }
  },
  methods: {
    getUploaderToolbar () {
      return [{
        name: 'close-action',
        label: this.$t('EventActivity.UPLOADER_MODAL_CLOSE_ACTION'),
        icon: 'las la-times',
        handler: () => this.$refs.uploaderModal.close()
      }]
    },
    router () {
      return {
        onApply: { name: 'event-activity', params: { contextId: this.contextId, objectId: this.objectId } },
        onDismiss: { name: 'event-activity', params: { contextId: this.contextId, objectId: this.objectId } }
      }
    },
    loadService () {
      // Archived mode ?
      return this.$api.getService(this.archived ? 'archived-event-logs' : 'event-logs')
    },
    getCollectionBaseQuery () {
      return { lastInEvent: true, event: this.objectId }
    },
    getCollectionPaginationQuery () {
      // No pagination on map items
      return {}
    },
    async refreshActivity () {
      // Archived mode ?
      this.archived = _.get(this.$route, 'query.archived')
      this.clearActivity()
      this.clearNavigationBar()
      // Wait until map is ready
      await this.initializeMap()
      this.event = await this.$api.getService(this.archived ? 'archived-events' : 'events', this.contextId).get(this.objectId)
      this.setTitle(this.event.name)
      // Setup the right drawer
      this.setRightDrawer('EventActivityPanel', this.$data)
      // Setup the widgets
      this.registerWidget('information-box', 'las la-digital-tachograph', 'widgets/KInformationBox', this.selection)
      this.registerWidget('time-series', 'las la-chart-line', 'widgets/KTimeSeries', this.$data)
      if (this.mapillaryClientID) this.registerWidget('mapillary-viewer', 'img:statics/mapillary-icon.svg', 'widgets/KMapillaryViewer')
      // If we'd like to only work in real-time
      // this.setCurrentTime(moment.utc())
      this.registerActivityActions()
      // Custom actions
      if (this.$can('update', 'events', this.contextId, this.event)) {
        this.registerFabAction({
          name: 'add-media', label: this.$t('EventActivity.ADD_MEDIA_LABEL'), icon: 'add_a_photo', handler: this.uploadMedia
        })
      }
      if (this.$can('read', 'events', this.contextId, this.event)) {
        if (this.hasMedias()) this.registerFabAction({
          name: 'browse-media', label: this.$t('EventActivity.BROWSE_MEDIA_LABEL'), icon: 'photo_library', handler: this.browseMedia
        })
      }
      if (this.$can('update', 'events', this.contextId, this.event)) {
        this.registerFabAction({
          name: 'edit-event',
          label: this.$t('EventActivity.EDIT_LABEL'),
          icon: 'las la-file-alt',
          route: { name: 'edit-event', params: { contextId: this.contextId, service: 'events', objectId: this.objectId } }
        })
      }
      // Located event ?
      if (this.event.location && this.event.location.longitude && this.event.location.latitude) {
        // Recenter map
        this.center(this.event.location.longitude, this.event.location.latitude, 15)
        // And add event marker
        const marker = L.marker([this.event.location.latitude, this.event.location.longitude], {
          icon: L.icon.fontAwesome({
            iconClasses: kCoreUtils.getIconName(this.event) || 'fas fa-circle',
            // Conversion from palette to RGB color is required for markers
            markerColor: kCoreUtils.getColorFromPalette(_.get(this.event, 'icon.color', 'blue')),
            iconColor: '#FFFFFF'
          })
        })
        // Address as popup
        marker.bindPopup(this.event.location.name)
        marker.addTo(this.map)
      }
      // Create an empty layer used as a container for participants
      this.addLayer({
        name: this.$t('EventActivity.PARTICIPANTS_LAYER_NAME'),
        label: this.$t('EventActivity.PARTICIPANTS_LAYER_NAME'),
        type: 'OverlayLayer',
        icon: 'fas fa-user',
        featureId: 'participant._id',
        leaflet: {
          type: 'geoJson',
          realtime: true,
          isVisible: true,
          cluster: { spiderfyDistanceMultiplier: 5.0 }
        }
      })
      // Then update it
      this.refreshCollection()
    },
    async getCatalogLayers () {
      let layers = await activityMixin.methods.getCatalogLayers.call(this)
      // Flag required layers as "beta"
      layers.forEach(layer => {
        if (layer.type !== 'BaseLayer') {
          layer.badge = { color: 'primary', transparent: true, label: 'beta' }
        }
      })
      
      return layers
    },
    registerActivityActions () {
      activityMixin.methods.registerActivityActions.call(this)
      // Flag required actions as "beta"
      let actions = this.$store.get('fab.actions')
      actions.forEach(action => {
        if (action.name === 'probe') {
          action.badge = { color: 'primary', floating: true, transparent: true, label: 'beta' }
        }
      })
    },
    uploadMedia () {
      this.$refs.uploaderModal.open()
      // If the modal has already been created the uploader is ready otherwise wait for event
      if (this.$refs.uploader) this.initializeMedias()
    },
    initializeMedias () {
      this.$refs.uploader.initialize(this.event.attachments)
      // Open file dialog the first time
      if (!this.event.attachments || (this.event.attachments.length === 0)) this.$refs.uploader.openFileInput()
    },
    browseMedia () {
      this.$refs.mediaBrowser.show(this.event.attachments)
    },
    filterItem (item) {
      // Is there any filter active ?
      if (!this.filter) return true
      // Is it the same step ?
      if (item.step !== this.filter.step) return false
      // Is it the same interaction ?
      if (this.hasStateUserInteraction(item)) {
        if (this.getUserInteraction(item) === this.filter.interaction) return true
        return false
      }
      if (this.hasStateUserInteraction(item.previous)) {
        if (this.getUserInteraction(item.previous) === this.filter.interaction) return true
        return false
      }
      return true
    },
    refreshParticipantsLayer () {
      this.participants.splice(0, this.participants.length)
      _.filter(this.items, (item) => this.filterItem(item)).forEach(item => this.participants.push(item))
      this.updateLayer(this.$t('EventActivity.PARTICIPANTS_LAYER_NAME'), { type: 'FeatureCollection', features: this.participants })
    },
    getParticipantMarker (feature, latlng, options) {
      if (options.name !== this.$t('EventActivity.PARTICIPANTS_LAYER_NAME')) return
      const icon = this.getUserIcon(feature, this.getWorkflowStep(feature))
      return this.createMarkerFromStyle(latlng, {
        icon: {
          type: 'icon.fontAwesome',
          options: {
            iconClasses: kCoreUtils.getIconName(icon, 'name') || 'fas fa-user',
            // Conversion from palette to RGB color is required for markers
            markerColor: kCoreUtils.getColorFromPalette(_.get(icon, 'color', 'blue')),
            iconColor: '#FFFFFF'
          }
        }
      })
    },
    getParticipantPopup (feature, layer, options) {
      if (options.name !== this.$t('EventActivity.PARTICIPANTS_LAYER_NAME')) return
      const popup = L.popup({ autoPan: false }, layer)
      const step = this.getWorkflowStep(feature)
      // Check for any recorded interaction to be displayed
      // Nothing visible because clicking on the marker opens a dialog in this case
      if (!this.archived && this.waitingInteraction(step, feature, 'coordinator')) {
        return null
      }
      // Already shown in tooltip
      /*
      if (this.waitingInteraction(step, feature, 'participant')) {
        return popup.setContent('Awaiting information')
      }
      */
      // Recall last interaction state
      const interaction = this.getUserInteraction(feature)
      if (interaction) {
        return popup.setContent(interaction)
      } else {
        // Feature interaction will be managed through standard properties popup
        return null
      }
    },
    getParticipantTooltip (feature, layer, options) {
      if (options.name !== this.$t('EventActivity.PARTICIPANTS_LAYER_NAME')) return
      // Default content is participant name
      const tooltip = L.tooltip({ permanent: true }, layer)
      const step = this.getWorkflowStep(feature)
      const name = _.get(feature, 'participant.name', this.$t('EventActivity.UNAMED'))
      // Check for any interaction to be performed
      if (!this.archived && this.waitingInteraction(step, feature, 'coordinator')) {
        return tooltip.setContent('<b>' + name + '<br>' + this.$t('EventActivity.ACTION_REQUIRED') + '</b>')
      } else if (!this.archived && this.waitingInteraction(step, feature, 'participant')) {
        return tooltip.setContent('<b>' + name + '<br>' + this.$t('EventActivity.AWAITING_INFORMATION') + '</b>')
      } else {
        return tooltip.setContent('<b>' + name + '</b>')
      }
    },
    onPopupOpen (event) {
      const feature = _.get(event, 'layer.feature')
      if (!feature || this.archived) return // No edition in archive
      if (this.canFollowUp(feature)) this.doFollowUp(feature._id)
    },
    onFeatureClicked (options, event) {
      const feature = _.get(event, 'target.feature')
      if (!feature || this.archived) return // No edition in archive
      if (this.canFollowUp(feature)) this.doFollowUp(feature._id)
    },
    onZoomToParticipant (participant) {
      const coordinates = _.get(participant, 'geometry.coordinates')
      if (coordinates) this.center(coordinates[0], coordinates[1])
    },
    onFilterParticipantStates (participant) {
      const step = this.getWorkflowStep(participant)
      // Not applicable when no workflow
      if (!step) return
      // If a filter is alredy active then clear it
      if (!this.filter) {
        // Defines the filter to the participant's state
        this.filter = {
          step: step.name,
          interaction: undefined
        }
        if (this.hasStateUserInteraction(participant)) this.filter.interaction = this.getUserInteraction(participant)
        else if (this.hasStateUserInteraction(participant.previous)) this.filter.interaction = this.getUserInteraction(participant.previous)
      } else {
        this.filter = null
      }
      this.refreshParticipantsLayer()
    },
    onCollectionRefreshed () {
      this.items.forEach((item) => {
        item.icon = this.getUserIcon(item, this.getWorkflowStep(item) || {}) // Take care when no workflow
        item.comment = this.getUserComment(item)
      })
      this.refreshParticipantsLayer()
      // We do not manage pagination now
      if (this.items.length < this.nbTotalItems) {
        this.$events.$emit('error', new Error(this.$t('errors.EVENT_LOG_LIMIT')))
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-opener-proxy'] = this.$load('frame/KOpenerProxy')
    this.$options.components['k-navigation-bar'] = this.$load('KNavigationBar')
    this.$options.components['k-timeline'] = this.$load('KTimeline')
    this.$options.components['k-color-legend'] = this.$load('KColorLegend')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-uploader'] = this.$load('input/KUploader')
    this.$options.components['k-media-browser'] = this.$load('media/KMediaBrowser')
    this.registerStyle('tooltip', this.getParticipantTooltip)
    this.registerStyle('popup', this.getParticipantPopup)
    this.registerStyle('markerStyle', this.getParticipantMarker)
    this.registerStyle('tooltip', this.getProbedLocationForecastTooltip)
    this.registerStyle('markerStyle', this.getProbedLocationForecastMarker)
    this.registerStyle('tooltip', this.getVigicruesTooltip)
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
  },
  mounted () {
    // Setup event connections
    // this.$on('popupopen', this.onPopupOpen)
    this.$on('click', this.onFeatureClicked)
    this.$on('collection-refreshed', this.onCollectionRefreshed)
    // Emitted from panel
    this.$events.$on('zoom-to-participant', this.onZoomToParticipant)
    this.$events.$on('filter-participant-states', this.onFilterParticipantStates)
  },
  beforeDestroy () {
    // Remove event connections
    // this.$off('popupopen', this.onPopupOpen)
    this.$off('click', this.onFeatureClicked)
    this.$off('collection-refreshed', this.onCollectionRefreshed)
    this.$events.$off('zoom-to-participant', this.onZoomToParticipant)
    this.$events.$off('filter-participant-states', this.onFilterParticipantStates)
  }
}
</script>

<style lang="stylus">
  .probe-cursor {
    cursor: crosshair;
  }
  .processing-cursor {
    cursor: wait;
  }
  .position-cursor {
    cursor: url('../statics/position-cursor.png'), auto; 
  }
</style>
