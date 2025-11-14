<template>
  <KPage>
    <!-- Map -->
    <div :ref="configureMap" :style="viewStyle">
      <q-resize-observer @resize="onMapResized" />
    </div>
    <MediaBrowser ref="mediaBrowser" :options="mediaBrowserOptions()" />
    <router-view service="events"></router-view>
  </KPage>
</template>

<script>
import _ from 'lodash'
import config from 'config'
import logger from 'loglevel'
import L from 'leaflet'
import chroma from 'chroma-js'
import centroid from '@turf/centroid'
import { ref, toRef } from 'vue'
import { useRoute } from 'vue-router'
import { mixins as kCoreMixins, composables as kCoreComposables, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import { Planets, mixins as kMapMixins, composables as kMapComposables } from '@kalisio/kdk/map.client.map'
import { usePlan } from '../composables'
import mixins from '../mixins'
import MediaBrowser from './MediaBrowser.vue'

const name = 'eventActivity'
const activityMixin = kCoreMixins.baseActivity(name)

export default {
  provide () {
    return {
      kActivity: this,
      kMap: this
    }
  },
  components: {
    MediaBrowser
  },
  mixins: [
    kMapMixins.map.baseMap,
    kMapMixins.map.geojsonLayers,
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
  computed: {
    // FIXME: Need to add this computed in order to be able to watch
    // Should be fixed when component will be migrated to composition API
    eventLogsItems () { return this.eventLogs.items.value }
  },
  watch: {
    eventLogsItems: {
      handler () {
        this.onEventLogsCollectionRefreshed()
      }
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
    async configureActivity () {
      this.event = await this.$api.getService(this.archived ? 'archived-events' : 'events', this.contextId).get(this.objectId)
      await this.loadAttachments()
      this.refreshUser()
      // If we'd like to only work in real-time
      // Time.setCurrentTime(moment.utc())
      activityMixin.methods.configureActivity.call(this)
      const color = kCoreUtils.getHtmlColor(_.get(this.event, 'icon.color', 'blue'))
      const icon = kCoreUtils.getIconName(this.event) || 'fas fa-circle'
      // Located event ?
      if (this.hasLocationGeometry()) {
        const feature = this.getLocationAsFeature()
        // Add event layer
        const layer = L.geoJson(feature, {
          style: () => ({ color, fillColor: chroma(color).alpha(0.5).hex() }) // Transparency
        })
        this.map.addLayer(layer)
        // Recenter map
        const location = centroid(feature)
        this.center(_.get(location, 'geometry.coordinates[0]'), _.get(location, 'geometry.coordinates[1]'), 15)
      } else if (this.hasLocation()) {
        const feature = this.getLocationAsFeature()
        // Add event marker
        const marker = L.shapeMarker([_.get(feature, 'geometry.coordinates[1]'), _.get(feature, 'geometry.coordinates[0]')], {
          fillColor: color,
          icon: {
            classes: icon
          }
        })
        // Address as popup
        marker.bindPopup(_.get(feature, 'properties.name'))
        marker.addTo(this.map)
        // Recenter map
        this.center(_.get(feature, 'geometry.coordinates[0]'), _.get(feature, 'geometry.coordinates[1]'), 15)
      }
      // Add participants layer if coordinator or archived mode as managers can see all
      if (this.isCoordinator || this.archived) {
        this.eventLogs.refreshCollection()
      }
    },
    async getCatalogLayers () {
      const planetLayers = await this.getLayers()
      return planetLayers
    },
    async getCatalogCategories () {
      const planetCategories = await this.getCategories()
      return planetCategories
    },
    async getCatalogSublegends () {
      const planetSublegends = await this.getSublegends()
      return planetSublegends
    },
    browseMedia () {
      this.$refs.mediaBrowser.show(this.attachments)
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
      _.filter(this.processedEventLogs, (log) => this.filterItem(log)).forEach(log => this.participants.push(log))
      this.updateLayer(this.$t('EventActivity.PARTICIPANTS_LAYER_NAME'), { type: 'FeatureCollection', features: this.participants })
    },
    getParticipantMarker (feature, options) {
      if (options.name !== this.$t('EventActivity.PARTICIPANTS_LAYER_NAME')) return

      return {
        shape: 'circle',
        color: kCoreUtils.getHtmlColor(_.get(feature, 'icon.color'), 'blue'),
        icon: {
          classes: kCoreUtils.getIconName(feature) || 'fas fa-user',
          color: 'white'
        }
      }
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
      const name = _.get(feature, 'participant.profile.name', this.$t('EventActivity.UNAMED'))
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
    onEventLogsCollectionRefreshed () {
      // Process logs to make it usable as a more conveient object by adding icon, etc.
      // It will also avoid any doublon in case of data duplication
      let count = this.eventLogsItems.length
      this.processedEventLogs = this.processStates(this.eventLogsItems)
      // Update total count accordingly
      if (count > this.processedEventLogs.length) {
        this.eventLogs.nbTotalItems -= (count - this.processedEventLogs.length)
      }
      // We do not manage pagination now
      if (this.eventLogsItems.length < this.eventLogs.nbTotalItems) {
        this.$events.emit('error', new Error(this.$t('errors.EVENT_LOG_LIMIT')))
      }
      this.refreshParticipantsLayer()
    },
    goBack () {
      const route = {
        name: (this.archived ? 'archived-events-activity' : 'events-activity')
      }
      if (this.planId) Object.assign(route, { query: { plan: this.planId } })
      this.$router.push(route)
    }
  },
  created () {
    this.setCurrentActivity(this)
    // Load the required components
    this.registerStyle('tooltip', this.getParticipantTooltip)
    this.registerStyle('popup', this.getParticipantPopup)
    this.registerStyle('point', this.getParticipantMarker)
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
  async setup (props) {
    // Initialize state
    const activity = kMapComposables.useActivity(name, {
      state: { timeSeries: [] }
    })
    const plan = usePlan({ contextId: props.contextId })
    // Archived mode ?
    const route = useRoute()
    const archived = _.get(route, 'query.archived')
    const eventLogs = kCoreComposables.useCollection({
      service: ref(archived ? 'archived-event-logs' : 'event-logs'),
      contextId: toRef(props, 'contextId'),
      baseQuery: ref({ lastInEvent: true, event: props.objectId, $sort: { createdAt: -1 } }),
      filterQuery: ref({}),
      nbItemsPerPage: ref(0)
    })
    // Initialize project
    const { project, loadProject } = kMapComposables.useProject({ route: false, planetApi: Planets.get('kalisio-planet') })
    // Select the right project, to be done after some composables like useActivity because await setup and no lifecycle hooks should be registered after
    const projectQuery = _.get(config, 'planets.kalisio-planet.project.default')
    await loadProject(projectQuery)
    logger.info('[CRISIS] Kalisio Planet project loaded')
    // Use planet catalog
    const { getCategories, getLayers, getSublegends } = kMapComposables.useCatalog({ project: project.value, planetApi: Planets.get('kalisio-planet') })
    
    return {
      ..._.omit(activity, 'CurrentActivityContext'),
      ...activity.CurrentActivityContext,
      ...kMapComposables.useWeather(name),
      getLayers,
      getCategories,
      getSublegends,
      // We need to flag which API to be used to retrieve forecast models
      getWeacastApi: () => Planets.get('kalisio-planet'),
      archived,
      eventLogs,
      ...plan
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
