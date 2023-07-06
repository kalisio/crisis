<template>
  <KPage :padding="false">
    <template v-slot:page-content>
      <!-- Map -->
      <div :ref="configureMap" :style="viewStyle">
        <q-resize-observer @resize="onMapResized" />
      </div>

      <KMediaBrowser ref="mediaBrowser" :options="mediaBrowserOptions()" />

      <router-view service="events"></router-view>
    </template>
  </KPage>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import chroma from 'chroma-js'
import centroid from '@turf/centroid'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import { mixins as kMapMixins, composables as kMapComposables } from '@kalisio/kdk/map.client.map'
import { usePlan } from '../composables'
import mixins from '../mixins'

const name = 'eventActivity'
const activityMixin = kCoreMixins.baseActivity(name)

export default {
  provide () {
    return {
      kActivity: this,
      kMap: this
    }
  },
  mixins: [
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
    kMapMixins.map.gsmapLayers,
    activityMixin,
    kCoreMixins.baseCollection,
    kMapMixins.featureSelection,
    kMapMixins.featureService,
    kMapMixins.infobox,
    kMapMixins.style,
    kMapMixins.weacast,
    kMapMixins.activity,
    mixins.events
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
      participants: []
    }
  },
  methods: {
    async configureMap (container) {
      // Avoid reentrance during awaited operations
      if (!container || this.mapContainer) return
      this.mapContainer = container
      // Wait until map is ready
      await this.initializeMap(container)
    },
    getService () {
      // Archived mode ?
      return this.$api.getService(this.archived ? 'archived-event-logs' : 'event-logs')
    },
    getCollectionBaseQuery () {
      return { lastInEvent: true, event: this.objectId, $sort: { createdAt: -1 } }
    },
    getCollectionPaginationQuery () {
      // No pagination on map items
      return {}
    },
    async configureActivity () {
      // Archived mode ?
      this.archived = _.get(this.$route, 'query.archived')
      this.event = await this.$api.getService(this.archived ? 'archived-events' : 'events', this.contextId).get(this.objectId)
      this.refreshUser()
      // If we'd like to only work in real-time
      // Time.setCurrentTime(moment.utc())
      activityMixin.methods.configureActivity.call(this)
      const color = kCoreUtils.getColorFromPalette(_.get(this.event, 'icon.color', 'blue'))
      const icon = kCoreUtils.getIconName(this.event) || 'fas fa-circle'
      // Located event ?
      if (this.hasLocationGeometry()) {
        const feature = { type: 'Feature', geometry: this.event.location }
        // Add event layer
        const layer = L.geoJson(feature, {
          style: () => ({ color, fillColor: chroma(color).alpha(0.5).hex() }) // Transparency
        })
        this.map.addLayer(layer)
        // Recenter map
        const location = centroid(feature)
        this.center(_.get(location, 'geometry.coordinates[0]'), _.get(location, 'geometry.coordinates[1]'), 15)
      } else if (this.hasLocation()) {
        // Add event marker
        const marker = L.marker([this.event.location.latitude, this.event.location.longitude], {
          icon: L.icon.fontAwesome({
            iconClasses: icon,
            // Conversion from palette to RGB color is required for markers
            markerColor: color,
            iconColor: '#FFFFFF'
          })
        })
        // Address as popup
        marker.bindPopup(this.event.location.name)
        marker.addTo(this.map)
        // Recenter map
        this.center(this.event.location.longitude, this.event.location.latitude, 15)
      }
      // Add participants layer if coordinator or archived mode as managers can see all
      if (this.isCoordinator || this.archived) {
        this.refreshCollection()
      }
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
        return (this.getUserInteraction(item) === this.filter.interaction)
      }
      if (this.hasStateUserInteraction(item.previous)) {
        return (this.getUserInteraction(item.previous) === this.filter.interaction)
      }
      // If same step but no interaction found, filter if required
      return !_.get(this.filter, 'interaction')
    },
    async refreshParticipantsLayer () {
      // Create an empty layer used as a container for participants when required
      const layer = this.getLayerByName(this.$t('EventActivity.PARTICIPANTS_LAYER_NAME'))
      if (!layer) {
        await this.addLayer({
          name: this.$t('EventActivity.PARTICIPANTS_LAYER_NAME'),
          label: this.$t('EventActivity.PARTICIPANTS_LAYER_NAME'),
          scope: 'activity',
          type: 'OverlayLayer',
          icon: 'fas fa-user',
          featureId: (this.archived ? 'participant' : 'participant._id'),
          isSelectable: false,
          leaflet: {
            type: 'geoJson',
            realtime: true,
            isVisible: true,
            cluster: { spiderfyDistanceMultiplier: 5.0 }
          }
        })
      }
      this.participants.splice(0, this.participants.length)
      _.filter(this.items, (item) => this.filterItem(item)).forEach(item => this.participants.push(item))
      this.updateLayer(this.$t('EventActivity.PARTICIPANTS_LAYER_NAME'), { type: 'FeatureCollection', features: this.participants })
    },
    getParticipantMarker (feature, latlng, options) {
      if (options.name !== this.$t('EventActivity.PARTICIPANTS_LAYER_NAME')) return
      return this.createMarkerFromStyle(latlng, {
        icon: {
          type: 'icon.fontAwesome',
          options: {
            iconClasses: kCoreUtils.getIconName(feature) || 'fas fa-user',
            // Conversion from palette to RGB color is required for markers
            markerColor: kCoreUtils.getColorFromPalette(_.get(feature, 'icon.color', 'blue')),
            iconColor: '#FFFFFF'
          }
        }
      })
    },
    getParticipantPopup (feature, layer, options) {
      if (options.name !== this.$t('EventActivity.PARTICIPANTS_LAYER_NAME')) return
      const popup = L.popup({ autoPan: false }, layer)
      let step = this.getWorkflowStep(feature)
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
        // Don't use current step here as the interaction can be recorded on the previous one
        step = this.getUserInteractionStep(feature)
        return popup.setContent(step.title + ' : ' + interaction)
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
        return tooltip.setContent('<b>' + name + '<br>' + step.title + ' : ' + this.$t('EventActivity.ACTION_REQUIRED') + '</b>')
      } else if (!this.archived && this.waitingInteraction(step, feature, 'participant')) {
        return tooltip.setContent('<b>' + name + '<br>' + step.title + ' : ' + this.$t('EventActivity.AWAITING_INFORMATION') + '</b>')
      } else {
        return tooltip.setContent('<b>' + name + '</b>')
      }
    },
    onPopupOpen (event) {
      const feature = _.get(event, 'layer.feature')
      if (!feature || this.archived) return // No edition in archive
      if (this.canFollowUpUser(feature)) this.doUserFollowUp(feature._id)
    },
    onFeatureClicked (options, event) {
      const feature = _.get(event, 'target.feature')
      if (!feature || this.archived) return // No edition in archive
      if (this.canFollowUpUser(feature)) this.doUserFollowUp(feature._id)
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
        if (this.hasStateUserInteraction(participant)) {
          this.filter.interaction = this.getUserInteraction(participant)
        } else if (this.hasStateUserInteraction(participant.previous)) {
          this.filter.interaction = this.getUserInteraction(participant.previous)
        }
      } else {
        this.filter = null
      }
      this.refreshParticipantsLayer()
    },
    onCollectionRefreshed () {
      // Process logs to make it usable as a more conveient object by adding icon, etc.
      // It will also avoid any doublon in case of data duplication
      const count = this.items.length
      this.items = this.processStates(this.items)
      // Update total count accordingly
      if (count > this.items.length) {
        this.nbTotalItems -= (count - this.items.length)
      }
      // We do not manage pagination now
      if (this.items.length < this.nbTotalItems) {
        this.$events.emit('error', new Error(this.$t('errors.EVENT_LOG_LIMIT')))
      }
      this.refreshParticipantsLayer()
    },
    goBack () {
      if (this.archived) {
        this.$router.push({ name: 'archived-events-activity', query: { plan: this.planId } })
      } else {
        this.$router.push({ name: 'events-activity', query: { plan: this.planId } })
      }
    }
  },
  created () {
    this.setCurrentActivity(this)
    // Load the required components
    this.registerStyle('tooltip', this.getParticipantTooltip)
    this.registerStyle('popup', this.getParticipantPopup)
    this.registerStyle('markerStyle', this.getParticipantMarker)
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
  },
  mounted () {
    // Setup event connections
    // this.$on('popupopen', this.onPopupOpen)
    this.$engineEvents.on('click', this.onFeatureClicked)
    // Emitted from panel
    this.$events.on('zoom-to-participant', this.onZoomToParticipant)
    this.$events.on('filter-participant-states', this.onFilterParticipantStates)
  },
  beforeUnmount () {
    this.clearHighlights()
    // Remove event connections
    // this.$off('popupopen', this.onPopupOpen)
    this.$engineEvents.off('click', this.onFeatureClicked)
    this.$events.off('zoom-to-participant', this.onZoomToParticipant)
    this.$events.off('filter-participant-states', this.onFilterParticipantStates)
  },
  setup (props) {
    return {
      ...kMapComposables.useActivity(name),
      ...usePlan({ contextId: props.contextId })
    }
  }
}
</script>

<style lang="scss">
  .probe-cursor {
    cursor: crosshair;
  }
  .processing-cursor {
    cursor: wait;
  }
  .position-cursor {
    cursor: url('/icons/kdk/position-cursor.png'), auto;
  }
</style>
