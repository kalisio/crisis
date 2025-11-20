<template>
  <KPage>
    <!-- Map -->
    <div id="map" :ref="configureMap" :style="viewStyle">
      <q-resize-observer @resize="onMapResized" />
    </div>
    <!-- Event templates selector modal -->
    <KModal ref="templateModal"
      :title="$t('MapActivity.CREATE_EVENT_TITLE')"
      :buttons="getTemplateModalButtons()"
      :options="{ padding: '4px', minWidth: '40vw', maxWidth: '60vw', minHeight: '20vh' }"
    >
      <KGrid
        ref="templates"
        service="event-templates"
        :contextId="contextId"
        :list-strategy="'smart'"
        @selection-changed="onCreateEvent"
      />
    </KModal>
    <!-- Alert editor modal -->
    <AlertEditor
      ref="alertEditor"
      :layer="alertLayer"
      :feature="alertFeature"
      :forecastModel="forecastModel"
      :router-mode="false"
    />
    <!-- Feature actions menu -->
    <KFeatureActionButton color="primary"/>
  </KPage>
</template>

<script>
import _ from 'lodash'
import config from 'config'
import logger from 'loglevel'
import L from 'leaflet'
import moment from 'moment'
import chroma from 'chroma-js'
import sift from 'sift'
import { ref, toRef, computed } from 'vue'
import { Layout, mixins as kCoreMixins, composables as kCoreComposables, utils as kCoreUtils, Time } from '@kalisio/kdk/core.client'
import { Planets, mixins as kMapMixins, composables as kMapComposables, utils as kdkMapUtils } from '@kalisio/kdk/map.client.map'
import KFeatureActionButton from '@kalisio/kdk/map/client/components/KFeatureActionButton.vue'
import mixins from '../mixins'
import { usePlan, useAlerts } from '../composables'

import AlertEditor from './AlertEditor.vue'

const name = 'mapActivity'
const activityMixin = kCoreMixins.baseActivity(name)

// For mapping we get all events at once to avoid managing pagination
const MAX_ITEMS = 5000

export default {
  components: {
    AlertEditor,
    KFeatureActionButton
  },
  mixins: [
    kMapMixins.map.baseMap,
    kMapMixins.map.canvasLayers,
    kMapMixins.map.geojsonLayers,
    kMapMixins.map.heatmapLayers,
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
    kMapMixins.activity,
    kMapMixins.style,
    kMapMixins.featureSelection,
    kMapMixins.featureService,
    kMapMixins.infobox,
    kMapMixins.weacast,
    kMapMixins.context
  ],
  provide () {
    return {
      kActivity: this,
      kMap: this
    }
  },
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      baseTemplateQuery: {
        $sort: { name: 1 }
      },
      alertLayer: null,
      alertFeature: null,
      inProgress: false
    }
  },
  computed: {
    // FIXME: Need to add this computed in order to be able to watch
    // Should be fixed when component will be migrated to composition API
    alertItems () { return this.alerts.items.value },
    eventItems () { return this.events.items.value }
  },
  watch: {
    alertItems: {
      handler () {
        this.onAlertsCollectionRefreshed()
      }
    },
    eventItems: {
      handler () {
        this.onEventsCollectionRefreshed()
      }
    },
    objectiveFilters: {
      handler () {
        this.events.refreshCollection()
        this.refreshObjectivesLayer()
      }
    },
    planId: {
      async handler () {
        await this.loadPlan({ geoJson: true, $select: ['objectives'] })
      }
    },
    plan: {
      handler () {
        this.refreshObjectivesLayer()
      }
    }
  },
  methods: {
    formatDate (date) {
      return date.toLocaleString(kCoreUtils.getLocale(),
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    async configureMap (container) {
      // Avoid reentrance during awaited operations
      if (!container || this.mapContainer) return
      this.mapContainer = container
      // Wait until map is ready
      await this.initializeMap(container)
    },
    async configureActivity () {
      activityMixin.methods.configureActivity.call(this)
      Time.setCurrentTime(moment.utc())
      // Then update events, alerts, plan
      this.alerts.refreshCollection()
      this.events.refreshCollection()
      this.refreshObjectivesLayer()
    },
    getFeatureActions (feature, layer) {
      const featureActions = []
      // When clicked on map
      if (!feature) {
        // We can initiate an event from location
        featureActions.push({
          name: 'create-event',
          icon: 'las la-fire',
          handler: this.onSelectEventTemplateForLocationAction,
          label: this.$t('MapActivity.CREATE_EVENT_LOCATION_ACTION')
        })
        // Check if weather layer activated
        const selectedLayer = _.values(this.layers).filter(sift({
          isVisible: true, type: 'OverlayLayer', tags: { $in: ['weather'] }
        }))
        if (selectedLayer.length > 0) {
          featureActions.push({
            name: 'create-alert',
            icon: 'las la-bell',
            handler: this.onCreateWeatherAlertAction,
            label: this.$t('MapActivity.CREATE_WEATHER_ALERT_ACTION')
          })
        }
      } else if (!this.isLayerEdited(layer.name)) { // Not in edition mode
        // Only on feature services targeting non-user data
        if (layer.variables) {
          featureActions.push({
            name: 'create-alert',
            icon: 'las la-bell',
            handler: this.onCreateMeasureAlertAction,
            label: this.$t('MapActivity.CREATE_MEASURE_ALERT_ACTION')
          })
        } else if (layer.name === this.$t('MapActivity.ALERTS_LAYER')) {
          // Alert deletion
          featureActions.push({
            name: 'remove-alert',
            icon: 'las la-minus-circle',
            handler: this.onRemoveAlert,
            label: this.$t('MapActivity.REMOVE_ALERT_ACTION')
          })
        } else if (layer.name === this.$t('MapActivity.EVENTS_LAYER')) {
          // Event deletion
          featureActions.push({
            name: 'remove-event',
            icon: 'las la-minus-circle',
            handler: this.onRemoveEvent,
            label: this.$t('MapActivity.REMOVE_EVENT_ACTION')
          })
        }
        // We can initiate an event from location and feature
        featureActions.push({
          name: 'create-event',
          icon: 'las la-fire',
          handler: this.onSelectEventTemplateForLocationAction,
          label: this.$t('MapActivity.CREATE_EVENT_LOCATION_ACTION')
        })
        // Could be an internal feature or external one (eg WFS layer)
        let id = _.get(layer, 'featureId', '_id')
        id = _.get(feature, 'properties.' + id, _.get(feature, id))
        // For point geometry it's actually the same as creating from location so don't show it twice
        if (id && (_.get(feature, 'geometry.type') !== 'Point')) { // Only on saved features
          featureActions.push({
            name: 'create-feature-event',
            icon: 'las la-expand',
            handler: this.onSelectEventTemplateForFeatureAction,
            label: this.$t('MapActivity.CREATE_EVENT_FEATURE_ACTION')
          })
        }
        // Could be a population analysis
        const populationService = this.$api.getService('population')
        if (populationService && ((_.get(feature, 'geometry.type') === 'Polygon') || (_.get(feature, 'geometry.type') === 'MultiPolygon'))) {
          featureActions.push({
            name: 'analyze-population',
            icon: 'las la-users',
            handler: this.onAnalyzePopulation,
            label: this.$t('MapActivity.ANALYZE_POPULATION_FEATURE_ACTION')
          })
        }
      }
      return featureActions
    },
    async refreshEventsLayer () {
      // Add a "virtual" layer for events if required
      const layer = this.getLayerByName(this.$t('MapActivity.EVENTS_LAYER'))
      if (!layer) {
        await this.addLayer({
          name: this.$t('MapActivity.EVENTS_LAYER'),
          scope: 'activity',
          type: 'OverlayLayer',
          icon: 'las la-fire',
          featureId: '_id',
          isSelectable: false,
          leaflet: {
            type: 'geoJson',
            isVisible: true,
            realtime: true,
            popup: { pick: [] }
          }
        })
      }
      this.updateLayer(this.$t('MapActivity.EVENTS_LAYER'),
        { type: 'FeatureCollection', features: this.eventItems })
    },
    onEventsCollectionRefreshed () {
      this.refreshEventsLayer()
      // We do not manage pagination now
      if (this.events.nbTotalItems.value > MAX_ITEMS) {
        this.$events.emit('error', new Error(this.$t('errors.EVENTS_LIMIT')))
      }
    },
    async refreshAlertsLayer () {
      // Add a "virtual" layer for alerts if required
      const layer = this.getLayerByName(this.$t('MapActivity.ALERTS_LAYER'))
      if (!layer) {
        await this.addLayer({
          name: this.$t('MapActivity.ALERTS_LAYER'),
          scope: 'activity',
          type: 'OverlayLayer',
          icon: 'las la-bell',
          featureId: '_id',
          isSelectable: false,
          leaflet: {
            type: 'geoJson',
            isVisible: true,
            realtime: true,
            popup: { pick: [] }
          }
        })
      }
      this.updateLayer(this.$t('MapActivity.ALERTS_LAYER'),
        { type: 'FeatureCollection', features: this.alertItems })
    },
    onAlertsCollectionRefreshed () {
      this.refreshAlertsLayer()
      // We do not manage pagination now
      if (this.alerts.nbTotalItems.value > MAX_ITEMS) {
        this.$events.emit('error', new Error(this.$t('errors.ALERTS_LIMIT')))
      }
    },
    async refreshObjectivesLayer () {
      // If no active plan no objective to visualize
      if (!this.planId) return
      // Add a "virtual" layer for objectives if required
      const layer = this.getLayerByName(this.$t('MapActivity.OBJECTIVES_LAYER'))
      if (!layer) {
        await this.addLayer({
          name: this.$t('MapActivity.OBJECTIVES_LAYER'),
          scope: 'activity',
          type: 'OverlayLayer',
          icon: 'las la-bullseye',
          featureId: 'id',
          isSelectable: false,
          leaflet: {
            type: 'geoJson',
            isVisible: true,
            realtime: true,
            popup: { pick: [] }
          }
        })
      }
      // Take care of any objective filter
      let objectives = _.get(this.plan, 'objectives', [])
      if (!_.isEmpty(this.objectiveFilters)) {
        objectives = objectives.filter(sift({ name: { $in: this.objectiveFilters } }))
      }
      this.updateLayer(this.$t('MapActivity.OBJECTIVES_LAYER'),
        { type: 'FeatureCollection', features: objectives })
    },
    async updateSelection () {
      await kMapMixins.featureSelection.methods.updateSelection.call(this)
      if (!this.hasProbedLocation() && !this.hasSelectedItems()) {
        // Hide the window
        Layout.setWindowVisible('top', false)
      }
    },
    async updateProbedLocationHighlight () {
      await kMapMixins.featureSelection.methods.updateProbedLocationHighlight.call(this)
      if (this.hasProbedLocation()) {
        this.unhighlight(this.getProbedLocation(), this.getProbedLayer() || { name: kdkMapUtils.ForecastProbeId })
        // Find time serie for probe, probed location is shared by all series
        const probedLocation = await _.get(this.state.timeSeries, '[0].series[0].probedLocationData')
        if (!probedLocation) return
        const isWeatherProbe = this.isWeatherProbe(probedLocation)
        const feature = (isWeatherProbe
          ? this.getProbedLocationForecastAtCurrentTime(probedLocation)
          : this.getProbedLocationMeasureAtCurrentTime(probedLocation))
        this.highlight(feature, this.getProbedLayer() || { name: kdkMapUtils.ForecastProbeId })
      }
    },
    getHighlightMarker (feature, options) {
      if ((options.name === kMapComposables.HighlightsLayerName) && this.isWeatherProbe(feature)) {
        return {
          icon: this.createWindBarbIcon(feature)
        }
      }
    },
    getHighlightTooltip (feature, layer, options) {
      if ((options.name === kMapComposables.HighlightsLayerName) && this.isWeatherProbe(feature)) {
        // Get labels from forecast layers
        const layers = _.values(this.layers).filter(sift({ tags: ['weather', 'forecast'] }))
        const variables = _.reduce(layers, (result, layer) => result.concat(_.get(layer, 'variables', [])), [])
        const fields = this.getProbedLocationForecastFields(variables)
        const html = this.getForecastAsHtml(feature, fields)
        return L.tooltip({ permanent: false }, layer).setContent(`<b>${html}</b>`)
      }
    },
    getAlertStyle (feature, options) {
      if (options.name !== this.$t('MapActivity.ALERTS_LAYER')) return null

      const isActive = _.get(feature, 'status.active')
      const hasError = _.get(feature, 'status.error')
      return {
        color: (hasError ? (isActive ? 'darkred' : 'darkgreen') : (isActive ? 'red' : 'green')),
        stoke: {
          color: (hasError ? (isActive ? 'darkred' : 'darkgreen') : (isActive ? 'red' : 'green'))
        }
      }
    },
    getAlertMarker (feature, latlng, options) {
      if (options.name !== this.$t('MapActivity.ALERTS_LAYER')) return null

      const isActive = _.get(feature, 'status.active')
      const hasError = _.get(feature, 'status.error')
      return kdkMapUtils.createMarkerFromPointStyle(latlng, {
        shape: 'circle',
        color: isActive ? '#FF0000' : '#008000',
        icon: {
          classes: 'fas fa-bell',
          color: hasError ? '#000000' : '#FFFFFF'
        }
      })
    },
    getAlertPopup (alert, layer, options) {
      if (options.name !== this.$t('MapActivity.ALERTS_LAYER')) return null

      const html = this.getAlertDetailsAsHtml(alert)
      return L.popup({ autoPan: false }, layer).setContent(html)
    },
    getAlertTooltip (alert, layer, options) {
      if (options.name !== this.$t('MapActivity.ALERTS_LAYER')) return null

      const html = this.getAlertStatusAsHtml(alert)
      return L.tooltip({ permanent: false }, layer).setContent(html)
    },
    getEventMarker (feature, options) {
      if (options.name !== this.$t('MapActivity.EVENTS_LAYER')) return null

      return {
        shape: 'circle',
        color: kCoreUtils.getHtmlColor(_.get(feature, 'icon.color'), 'blue'),
        icon: {
          classes: kCoreUtils.getIconName(feature) || 'las la-marker-map',
          color: 'white'
        }
      }
    },
    getEventStyle (event, options) {
      if (options.name !== this.$t('MapActivity.EVENTS_LAYER')) return null

      const color = kCoreUtils.getHtmlColor(_.get(event, 'icon.color'), 'blue')
      return {
        color: chroma(color).alpha(0.5).hex(), // Transparency
        stroke: {
          color
        }
      }
    },
    getEventPopup (event, layer, options) {
      if (options.name !== this.$t('MapActivity.EVENTS_LAYER')) return null

      const description = _.get(event, 'description')
      if (!description) return null
      const popup = L.popup({ autoPan: false }, layer)
      return popup.setContent(description)
    },
    getEventTooltip (event, layer, options) {
      if (options.name !== this.$t('MapActivity.EVENTS_LAYER')) return null

      const tooltip = L.tooltip({ permanent: false }, layer)
      const name = _.get(event, 'name')
      const createdAt = (_.has(event, 'createdAt') ? new Date(_.get(event, 'createdAt')) : null)
      const updatedAt = (_.has(event, 'updatedAt') ? new Date(_.get(event, 'updatedAt')) : null)
      const deletedAt = (_.has(event, 'deletedAt') ? new Date(_.get(event, 'deletedAt')) : null)
      let html = '<b>' + name + '</b></br>'
      if (createdAt) {
        html += this.$t('MapActivity.CREATED_AT_LABEL') + ' ' + createdAt.toLocaleString() + '</br>'
      }
      if (deletedAt) {
        html += this.$t('MapActivity.CLOSED_AT_LABEL') + ' ' + deletedAt.toLocaleString()
      } else {
        html += this.$t('MapActivity.UPDATED_AT_LABEL') + ' ' + updatedAt.toLocaleString()
      }
      return tooltip.setContent(html)
    },
    getObjectivePopup (objective, layer, options) {
      if (options.name !== this.$t('MapActivity.OBJECTIVES_LAYER')) return null

      const description = _.get(objective, 'description')
      return L.popup({ autoPan: false }, layer).setContent(description)
    },
    getObjectiveTooltip (objective, layer, options) {
      if (options.name !== this.$t('MapActivity.OBJECTIVES_LAYER')) return null

      const name = _.get(objective, 'name')
      return L.tooltip({ permanent: false }, layer).setContent('<b>' + name + '</b>')
    },
    onSelectEventTemplateForLocationAction (data) {
      // Extract event location
      this.eventParams = {
        longitude: data.latlng.lng,
        latitude: data.latlng.lat
      }
      this.$refs.templateModal.open()
    },
    onSelectEventTemplateForFeatureAction (data) {
      // Extract event location
      this.eventParams = {
        layerId: data.feature.layer,
        featureId: data.feature._id
      }
      this.$refs.templateModal.open()
    },
    onCreateEvent (template) {
      this.$router.push({
        name: 'create-event',
        params: Object.assign({
          contextId: this.contextId,
          templateId: template._id
        }, this.eventParams),
        query: { plan: this.planId }
      })
    },
    onRemoveAlert (data) {
      this.showRemoveAlertDialog(data.feature)
    },
    onRemoveEvent (data) {
      mixins.events.methods.showRemoveEventDialog.call(this, data.feature)
    },
    onCreateMeasureAlertAction (data) {
      this.alertFeature = data.feature
      this.alertLayer = data.layer
      this.$refs.alertEditor.openModal()
    },
    onCreateWeatherAlertAction (data) {
      // Retrieve weather layer activated
      const selectedLayer = _.values(this.layers).filter(sift({
        isVisible: true, type: 'OverlayLayer', tags: { $in: ['weather'] }
      }))
      if (selectedLayer.length > 0) {
        this.alertFeature = {
          geometry: {
            type: 'Point',
            coordinates: [
              data.latlng.lng,
              data.latlng.lat
            ]
          }
        }
        this.alertLayer = selectedLayer[0]
        this.$refs.alertEditor.openModal()
      }
    },
    async onAnalyzePopulation (data) {
      const populationService = this.$api.getService('population')
      const properties = ['Ind', 'Ind_0_3', 'Ind_4_5', 'Ind_6_10', 'Ind_11_17', 'Ind_18_24',
        'Ind_25_39', 'Ind_40_54', 'Ind_55_64', 'Ind_65_79', 'Ind_80p']
      // We aggregate all feature within the zone
      const matchStage = {
        geometry: {
          $geoIntersects: {
            $geometry: data.feature.geometry
          }
        }
      }
      const groupStage = {
        _id: null
      }
      properties.forEach(property => {
        groupStage[property] = { $sum: `$properties.${property}` }
      })
      // Now perform aggregation
      const result = await populationService.find({
        query: {
          $aggregation: {
            pipeline: [{
              $match: matchStage
            }, {
              $group: groupStage
            }]
          }
        }
      })
      // Then display result
      if (result.length) {
        const formatter = new Intl.NumberFormat()
        let html = ''
        properties.forEach(property => {
          const count = formatter.format(Math.round(result[0][property]))
          html += this.$t(`PopulationClasses.${property}`) + `: ${count}</br>`
        })
        await kCoreUtils.dialog({
          title: this.$t('MapActivity.POPULATION_ANALYSIS'),
          message: html,
          html: true,
          ok: {
            label: this.$t('OK'),
            flat: true
          }
        })
      } else {
        this.$notify({ message: this.$t('MapActivity.POPULATION_ANALYSIS_ERROR') })
      }
    },
    getTemplateModalButtons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', handler: () => this.$refs.templateModal.close() }
      ]
    },
    onEditStartEvent (event) {
      this.setTopPaneMode('edit-layer-data')
    },
    onEditStopEvent (event) {
      this.setTopPaneMode('default')
    }
  },
  created () {
    this.setCurrentActivity(this)
    this.registerStyle('tooltip', this.getAlertTooltip)
    this.registerStyle('popup', this.getAlertPopup)
    this.registerStyle('point', this.getAlertMarker)
    this.registerStyle('polygon', this.getAlertStyle)
    this.registerStyle('tooltip', this.getEventTooltip)
    this.registerStyle('popup', this.getEventPopup)
    this.registerStyle('point', this.getEventMarker)
    this.registerStyle('polygon', this.getEventStyle)
    this.registerStyle('tooltip', this.getObjectiveTooltip)
    this.registerStyle('popup', this.getObjectivePopup)
  },
  mounted () {
    // Check if we can create layers
    this.$checkQuota('catalog', 1)
    // Setup engine events listeners
    this.$engineEvents.on('edit-start', this.onEditStartEvent)
    this.$engineEvents.on('edit-stop', this.onEditStopEvent)
  },
  beforeUnmount () {
    this.clearHighlights()
    this.$engineEvents.off('edit-start', this.onEditStartEvent)
    this.$engineEvents.off('edit-stop', this.onEditStopEvent)
  },
  async setup (props) {
    // Initialize state
    const activity = kMapComposables.useActivity(name, {
      state: { timeSeries: [] }
    })
    const plan = usePlan({ contextId: props.contextId })
    const alerts = kCoreComposables.useCollection({
      service: ref('alerts'),
      contextId: toRef(props, 'contextId'),
      baseQuery: ref({ geoJson: true, $skip: 0, $limit: MAX_ITEMS }),
      nbItemsPerPage: ref(0)
    })
    const baseQuery = computed(() => Object.assign({
      geoJson: true,
      $skip: 0,
      $limit: MAX_ITEMS,
      $select: ['_id', 'name', 'description', 'icon', 'location', 'createdAt', 'updatedAt', 'expireAt', 'deletedAt']
    }, plan.planQuery.value))
    const filterQuery = computed(() => plan.planObjectiveQuery.value)
    const events = kCoreComposables.useCollection({
      service: ref('events'),
      contextId: toRef(props, 'contextId'),
      baseQuery,
      filterQuery,
      nbItemsPerPage: ref(0)
    })
    const weather = kMapComposables.useWeather()
    const measure = kMapComposables.useMeasure()
    // Initialize project
    const { project, loadProject } = kMapComposables.useProject({ route: false, planetApi: Planets.get('kalisio-planet') })
    // Select the right project, to be done after some composables like useActivity because await setup and no lifecycle hooks should be registered after
    const projectQuery = _.get(config, 'planets.kalisio-planet.project.default')
    await loadProject(projectQuery)
    logger.info('[CRISIS] Kalisio Planet project loaded')
    activity.setSelectionMode('multiple')

    return {
      ..._.omit(activity, 'CurrentActivityContext'),
      ...activity.CurrentActivityContext,
      ...weather,
      ...measure,
      // We need to flag which API to be used to retrieve forecast models
      getWeacastApi: () => Planets.get('kalisio-planet'),
      project,
      alerts,
      events,
      ...plan,
      ...useAlerts({ contextId: props.contextId })
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
