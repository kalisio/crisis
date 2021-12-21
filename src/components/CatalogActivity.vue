<template>
  <k-page :padding="false">
    <template v-slot:page-content>
      <!-- Map -->
      <div ref="map" :style="viewStyle">
        <q-resize-observer @resize="onMapResized" />
      </div>

      <k-modal ref="templateModal"
        :title="$t('CatalogActivity.CREATE_EVENT_TITLE')"
        :buttons="getTemplateModalButtons()" 
        :options="{ padding: '4px', minWidth: '40vw', maxWidth: '60vw', minHeight: '20vh' }">
        <k-list ref="templates" slot="modal-content" service="event-templates" :contextId="contextId"
          :list-strategy="'smart'" @selection-changed="onCreateEvent" />
      </k-modal>

      <k-modal ref="alertModal"
        :title="$t('CatalogActivity.CREATE_ALERT_TITLE')"
        :buttons="getAlertModalButtons()" 
        :options="{}">
        <div slot="modal-content">
          <alert-form :class="{ 'light-dimmed': inProgress }" ref="alertForm"
            :layer="alertLayer" :feature="alertFeature" :forecastModel="forecastModel"/>
        </div>
      </k-modal>
      <!-- Child views -->
      <router-view />
    </template>
  </k-page>
</template>

<script>
import moment from 'moment'
import chroma from 'chroma-js'
import sift from 'sift'
import Vue from 'vue'
import { Dialog } from 'quasar'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'
import { mixins as kCoreMixins, utils as kCoreUtils, Time } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

const activityMixin = kCoreMixins.baseActivity()

// For mapping we get all events at once to avoid managing pagination
const MAX_ITEMS = 5000

export default {
  name: 'catalog-activity',
  mixins: [
    kCoreMixins.refsResolver(['map']),
    activityMixin,
    kMapMixins.activity,
    kMapMixins.featureSelection,
    kMapMixins.featureService,
    kMapMixins.infobox,
    kMapMixins.style,
    kMapMixins.weacast,
    kMapMixins.context,
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
    mixins.alerts,
    mixins.plans
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
  watch: {
    objectiveFilters: function () {
      this.events.refreshCollection()
      this.refreshObjectivesLayer()
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
    async configureActivity () {
      // Wait until map is ready
      await this.initializeMap()
      activityMixin.methods.configureActivity.call(this)
      Time.setCurrentTime(moment.utc())
      // Then update events, alerts, plan
      this.alerts.refreshCollection()
      this.events.refreshCollection()
      this.refreshObjectivesLayer()
    },
    getFeatureActions (feature, layer) {
      let featureActions = []
      // When clicked on map
      if (!feature) {
        // We can initiate an event from location
        featureActions.push({
          name: 'create-event',
          icon: 'las la-fire',
          handler: this.onSelectEventTemplateForLocationAction,
          label: this.$t('CatalogActivity.CREATE_EVENT_LOCATION_ACTION')
        })
        // Check if weather layer activated
        const selectedLayer = _.values(this.layers).filter(sift({
          isVisible: true, type: 'OverlayLayer', tags: { $in: ['weather'] }
        }))
        if (selectedLayer.length > 0) featureActions.push({
          name: 'create-alert',
          icon: 'las la-bell',
          handler: this.onCreateWeatherAlertAction,
          label: this.$t('CatalogActivity.CREATE_WEATHER_ALERT_ACTION')
        })
      } else if (!this.isLayerEdited(layer.name)) { // Not in edition mode
        // Only on feature services targeting non-user data
        if (layer.variables) {
          featureActions.push({
            name: 'create-alert',
            icon: 'las la-bell',
            handler: this.onCreateMeasureAlertAction,
            label: this.$t('CatalogActivity.CREATE_MEASURE_ALERT_ACTION')
          })
        } else if (layer.name === this.$t('CatalogActivity.ALERTS_LAYER')) {
          // Alert deletion
          featureActions.push({
            name: 'remove-alert',
            icon: 'las la-minus-circle',
            handler: this.onRemoveAlert,
            label: this.$t('CatalogActivity.REMOVE_ALERT_ACTION')
          })
        }
        // We can initiate an event from location and feature
        featureActions.push({
          name: 'create-event',
          icon: 'las la-fire',
          handler: this.onSelectEventTemplateForLocationAction,
          label: this.$t('CatalogActivity.CREATE_EVENT_LOCATION_ACTION')
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
            label: this.$t('CatalogActivity.CREATE_EVENT_FEATURE_ACTION')
          })
        }
        // Could be a population analysis
        const populationService = this.$api.getService('population')
        if (populationService &&
            (_.get(feature, 'geometry.type') === 'Polygon') || (_.get(feature, 'geometry.type') === 'MultiPolygon')) {
          featureActions.push({
            name: 'analyze-population',
            icon: 'las la-users',
            handler: this.onAnalyzePopulation,
            label: this.$t('CatalogActivity.ANALYZE_POPULATION_FEATURE_ACTION')
          })
        }
      }
      return featureActions
    },
    async refreshEventsLayer () {
      // Add a "virtual" layer for events if required
      const layer = this.getLayerByName(this.$t('CatalogActivity.EVENTS_LAYER'))
      if (!layer) {
        await this.addLayer({
          name: this.$t('CatalogActivity.EVENTS_LAYER'),
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
      this.updateLayer(this.$t('CatalogActivity.EVENTS_LAYER'),
        { type: 'FeatureCollection', features: _.get(this.events, 'items', []) })
    },
    onEventCollectionRefreshed () {
      this.refreshEventsLayer()
      // We do not manage pagination now
      if (this.events.items.length > MAX_ITEMS) {
        this.$events.$emit('error', new Error(this.$t('errors.EVENTS_LIMIT')))
      }
    },
    async refreshAlertsLayer () {
      // Add a "virtual" layer for alerts if required
      const layer = this.getLayerByName(this.$t('CatalogActivity.ALERTS_LAYER'))
      if (!layer) {
        await this.addLayer({
          name: this.$t('CatalogActivity.ALERTS_LAYER'),
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
      this.updateLayer(this.$t('CatalogActivity.ALERTS_LAYER'),
        { type: 'FeatureCollection', features: _.get(this.alerts, 'items', []) })
    },
    onAlertCollectionRefreshed () {
      this.refreshAlertsLayer()
      // We do not manage pagination now
      if (this.alerts.items.length > MAX_ITEMS) {
        this.$events.$emit('error', new Error(this.$t('errors.ALERTS_LIMIT')))
      }
    },
    async refreshObjectivesLayer () {
      // If no active plan no objective to visualize
      if (!this.planId) return
      // Add a "virtual" layer for objectives if required
      const layer = this.getLayerByName(this.$t('CatalogActivity.OBJECTIVES_LAYER'))
      if (!layer) {
        await this.addLayer({
          name: this.$t('CatalogActivity.OBJECTIVES_LAYER'),
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
      this.updateLayer(this.$t('CatalogActivity.OBJECTIVES_LAYER'),
        { type: 'FeatureCollection', features: objectives })
    },
    getAlertStyle (feature, options) {
      if (options.name !== this.$t('CatalogActivity.ALERTS_LAYER')) return null

      const isActive = _.get(feature, 'status.active')
      const hasError = _.get(feature, 'status.error')
      return {
        'color': (hasError ? (isActive ? 'darkred' : 'darkgreen') : (isActive ? 'red' : 'green')),
        'fillColor': (hasError ? (isActive ? 'darkred' : 'darkgreen') : (isActive ? 'red' : 'green')),
      }
    },
    getAlertMarker (feature, latlng, options) {
      if (options.name !== this.$t('CatalogActivity.ALERTS_LAYER')) return null

      const isActive = _.get(feature, 'status.active')
      const hasError = _.get(feature, 'status.error')
      return this.createMarkerFromStyle(latlng, {
        icon: {
          type: 'icon.fontAwesome',
          options: {
            iconClasses: 'fas fa-bell',
            markerColor: (isActive ? '#FF0000' : '#008000'),
            iconColor: (hasError ? '#000000' : '#FFFFFF')
          }
        }
      })
    },
    getAlertPopup (alert, layer, options) {
      if (options.name !== this.$t('CatalogActivity.ALERTS_LAYER')) return null

      const html = this.getAlertDetailsAsHtml(alert)
      return L.popup({ autoPan: false }, layer).setContent(html)
    },
    getAlertTooltip (alert, layer, options) {
      if (options.name !== this.$t('CatalogActivity.ALERTS_LAYER')) return null

      const html = this.getAlertStatusAsHtml(alert)
      return L.tooltip({ permanent: false }, layer).setContent(html)
    },
    getEventMarker (feature, latlng, options) {
      if (options.name !== this.$t('CatalogActivity.EVENTS_LAYER')) return null

      return this.createMarkerFromStyle(latlng, {
        icon: {
          type: 'icon.fontAwesome',
          options: {
            iconClasses: kCoreUtils.getIconName(feature) || 'fas fa-map-marker-alt',
            // Conversion from palette to RGB color is required for markers
            markerColor: kCoreUtils.getColorFromPalette(_.get(feature, 'icon.color', 'blue')),
            iconColor: '#FFFFFF'
          }
        }
      })
    },
    getEventStyle (event, options) {
      if (options.name !== this.$t('CatalogActivity.EVENTS_LAYER')) return null

      const color = kCoreUtils.getColorFromPalette(_.get(event, 'icon.color', 'blue'))
      return { 'color': color, 'fillColor': chroma(color).alpha(0.5).hex() } // Transparency
    },
    getEventPopup (event, layer, options) {
      if (options.name !== this.$t('CatalogActivity.EVENTS_LAYER')) return null

      const description = _.get(event, 'description')
      if (!description) return null
      const popup = L.popup({ autoPan: false }, layer)
      return popup.setContent(description)
    },
    getEventTooltip (event, layer, options) {
      if (options.name !== this.$t('CatalogActivity.EVENTS_LAYER')) return null

      const tooltip = L.tooltip({ permanent: false }, layer)
      const name = _.get(event, 'name')
      const createdAt = (_.has(event, 'createdAt') ? new Date(_.get(event, 'createdAt')) : null)
      const updatedAt = (_.has(event, 'updatedAt') ? new Date(_.get(event, 'updatedAt')) : null)
      const deletedAt = (_.has(event, 'deletedAt') ? new Date(_.get(event, 'deletedAt')) : null)
      let html = '<b>' + name + '</b></br>'
      if (createdAt) {
        html += this.$t('CatalogActivity.CREATED_AT_LABEL') + ' ' + createdAt.toLocaleString() + '</br>'
      }
      if (deletedAt) {
        html += this.$t('CatalogActivity.CLOSED_AT_LABEL') + ' ' + deletedAt.toLocaleString()
      } else {
        html += this.$t('CatalogActivity.UPDATED_AT_LABEL') + ' ' + updatedAt.toLocaleString()
      }
      return tooltip.setContent(html)
    },
    getObjectivePopup (objective, layer, options) {
      if (options.name !== this.$t('CatalogActivity.OBJECTIVES_LAYER')) return null

      const description = _.get(objective, 'description')
      return L.popup({ autoPan: false }, layer).setContent(description)
    },
    getObjectiveTooltip (objective, layer, options) {
      if (options.name !== this.$t('CatalogActivity.OBJECTIVES_LAYER')) return null

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
          templateId: template._id,
        }, this.eventParams),
        query: { plan: this.planId }
      })
    },
    onRemoveAlert (data) {
      Dialog.create({
        title: this.$t('CatalogActivity.REMOVE_ALERT_DIALOG_TITLE'),
        message: this.$t('CatalogActivity.REMOVE_ALERT_DIALOG_MESSAGE'),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(async () => {
        await this.$api.getService('alerts').remove(data.feature._id)
      })
    },
    getAlertModalButtons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.$refs.alertModal.close() },
        { id: 'apply-button', label: 'DONE', renderer: 'form-button', handler: () => this.onCreateAlert() }
      ]
    },
    onCreateMeasureAlertAction (data) {
      this.alertFeature = data.feature
      this.alertLayer = data.layer
      this.$refs.alertModal.open()
    },
    async onCreateAlert () {
      const result = this.$refs.alertForm.validate()
      if (!result.isValid) return
      this.inProgress = true
      try {
        // Add notification prefix to be used at creation,
        // Indeed, as alerting is a background process it will not be able to easily guess the user locale
        let alert = Object.assign(result.values, {
          notification: {
            create: this.$t('EventNotifications.CREATE'),
            remove: this.$t('EventNotifications.REMOVE')
          }
        })
        alert = await this.$api.getService('alerts').create(alert)
      } catch (_) {
      }
      this.inProgress = false
      this.$refs.alertModal.close()
    },
    onCreateWeatherAlertAction (data) {
      // Retrieve weather layer activated
      const selectedLayer = _.values(this.layers).filter(sift({
        isVisible: true, type: 'OverlayLayer', tags: { $in: ['weather'] }
      }))
      if (selectedLayer.length > 0) {
        this.alertFeature = {
          geometry: {
            type: 'Point', coordinates: [
              data.latlng.lng,
              data.latlng.lat
            ]
          }
        }
        this.alertLayer = selectedLayer[0]
        this.$refs.alertModal.open()
      }
    },
    async onAnalyzePopulation (data) {
      const populationService = this.$api.getService('population')
      const properties = ['Ind', 'Ind_0_3','Ind_4_5', 'Ind_6_10', 'Ind_11_17', 'Ind_18_24',
                          'Ind_25_39', 'Ind_40_54', 'Ind_55_64', 'Ind_65_79', 'Ind_80p']
      // We aggregate all feature within the zone
      const matchStage = {
        geometry: {
          $geoIntersects: {
             $geometry: data.feature.geometry
          }
        }
      }
      let groupStage = {
        _id: null
      }
      properties.forEach(property => {
        groupStage[property] = { $sum: `$properties.${property}` }
      })
      // Now perform aggregation
      const result = await populationService.find({ query: {
        $aggregation: {
          pipeline: [{
            $match: matchStage
          }, {
            $group: groupStage
          }]
        }
      }})
      // Then display result
      if (result.length) {
        const formatter = new Intl.NumberFormat()
        let html = ''
        properties.forEach(property => {
          const count = formatter.format(Math.round(result[0][property]))
          html += this.$t(`PopulationClasses.${property}`) + `: ${count}</br>` 
        })
        await kCoreUtils.dialog({
          title: this.$t('CatalogActivity.POPULATION_ANALYSIS'),
          message: html,
          html: true,
          ok: {
            label: this.$t('OK'),
            flat: true
          }
        })
      } else {
        this.$toast({ message: this.$t('CatalogActivity.POPULATION_ANALYSIS_ERROR') })
      }
    },
    getTemplateModalButtons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', handler: () => this.$refs.templateModal.close() }
      ]
    },
    configureCollection (service, baseQuery, filterQuery, props = {}) {
      // As we'd like to use the collection mixin but need to require multiple services (alerts, events)
      // we create a specific component instance to manage each type of objects which are then added to the map.
      // Indeed we can only support one service if we directly use the mixin in the activity.
      const Component = Vue.extend({
        mixins: [kCoreMixins.baseCollection],
        methods: {
          getService: () => this.$api.getService(service),
          getCollectionBaseQuery: baseQuery,
          getCollectionFilterQuery: filterQuery,
          // No pagination on map items
          getCollectionPaginationQuery: () => ({})
        }
      })
      return new Component({ propsData: props })
    },
    onEditStartEvent (event) {
      this.setTopPaneMode('edit-layer-data')
    },
    onEditStopEvent (event) {
      this.setTopPaneMode('default')
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-color-legend'] = this.$load('KColorLegend')
    this.$options.components['k-feature-action-button'] = this.$load('KFeatureActionButton')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-list'] = this.$load('collection/KList')
    this.$options.components['alert-form'] = this.$load('AlertForm')

    this.registerStyle('tooltip', this.getAlertTooltip)
    this.registerStyle('popup', this.getAlertPopup)
    this.registerStyle('markerStyle', this.getAlertMarker)
    this.registerStyle('featureStyle', this.getAlertStyle)
    this.registerStyle('tooltip', this.getEventTooltip)
    this.registerStyle('popup', this.getEventPopup)
    this.registerStyle('markerStyle', this.getEventMarker)
    this.registerStyle('featureStyle', this.getEventStyle)
    this.registerStyle('tooltip', this.getObjectiveTooltip)
    this.registerStyle('popup', this.getObjectivePopup)
    this.registerStyle('tooltip', this.getProbedLocationForecastTooltip)
    this.registerStyle('markerStyle', this.getProbedLocationForecastMarker)
    // Check if option has been subscribed
    this.$checkBillingOption('catalog')
  },
  mounted () {
    this.alerts = this.configureCollection('alerts',
      () => ({ geoJson: true, $skip: 0, $limit: MAX_ITEMS }), () => ({}), { nbItemsPerPage: 0 })
    this.alerts.$on('collection-refreshed', this.onAlertCollectionRefreshed)
    this.events = this.configureCollection('events', () => Object.assign({
      geoJson: true, $skip: 0, $limit: MAX_ITEMS,
      $select: ['_id', 'name', 'description', 'icon', 'location', 'createdAt', 'updatedAt', 'expireAt', 'deletedAt']
    }, this.getPlanQuery()), () => this.getPlanObjectiveQuery(), { nbItemsPerPage: 0 })
    this.events.$on('collection-refreshed', this.onEventCollectionRefreshed)
    this.$on('edit-start', this.onEditStartEvent)
    this.$on('edit-stop', this.onEditStopEvent)
  },
  beforeDestroy () {
    this.alerts.$off('collection-refreshed', this.onAlertCollectionRefreshed)
    this.events.$off('collection-refreshed', this.onEventCollectionRefreshed)
    this.$off('edit-start', this.onEditStartEvent)
    this.$off('edit-stop', this.onEditStopEvent)
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
