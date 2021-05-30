<template>
  <k-page :padding="false">
    <template v-slot:page-content>
      <!-- Map -->
      <div ref="map" :style="viewStyle">
        <q-resize-observer @resize="onMapResized" />
      </div>

      <k-modal ref="templateModal"
        :title="$t('CatalogActivity.CREATE_EVENT_TITLE')"
        :buttons="[]" :options="{ padding: '4px', minWidth: '40vw', maxWidth: '60vw', minHeight: '20vh' }">
        <k-list ref="templates" slot="modal-content" service="event-templates" :contextId="contextId"
          :list-strategy="'smart'" @selection-changed="onCreateEvent" />
      </k-modal>

      <k-modal ref="alertModal"
        :title="$t('CatalogActivity.CREATE_ALERT_TITLE')"
        :buttons="[]" :options="{}">
        <div slot="modal-content">
          <alert-form :class="{ 'light-dimmed': inProgress }" ref="alertForm"
            :layer="alertLayer" :feature="alertFeature" :forecastModel="forecastModel"/>
          <div class="row justify-end" style="padding: 12px">
            <q-btn id="apply-button" color="primary" flat :label="$t('CREATE')" @click="onCreateAlert"/>
          </div>
          <q-spinner-cube color="primary" class="fixed-center" v-if="inProgress" size="4em"/>
        </div>
      </k-modal>
      <!-- Child views -->
      <router-view />
    </template>
  </k-page>
</template>

<script>
import moment from 'moment'
import sift from 'sift'
import centroid from '@turf/centroid'
import Vue from 'vue'
import { Dialog } from 'quasar'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
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
    kMapMixins.time,
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
  methods: {
    formatDate (date) {
      return date.toLocaleString(kCoreUtils.getLocale(),
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    async configureActivity () {
      // Wait until map is ready
      await this.initializeMap()
      activityMixin.methods.configureActivity.call(this)
      this.setCurrentTime(moment.utc())
      // Then update events/alerts
      this.alerts.refreshCollection()
      this.events.refreshCollection()
    },
    getFeatureActions (feature, layer) {
      let featureActions = []
      // When clicked on map
      if (!feature) {
        // We can initiate an event
        featureActions.push({
          name: 'create-event',
          icon: 'las la-fire',
          handler: this.onSelectEventTemplateAction,
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
        // Could be an internal feature or external one (eg WFS layer)
        let id = _.get(layer, 'featureId', '_id')
        id = _.get(feature, 'properties.' + id, _.get(feature, id))
        if (id) { // Only on saved features
          featureActions.push({
            name: 'create-event',
            icon: 'las la-fire',
            handler: this.onSelectEventTemplateAction,
            label: this.$t('CatalogActivity.CREATE_EVENT_FEATURE_ACTION')
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
      this.updateLayer(this.$t('CatalogActivity.EVENTS_LAYER'), { type: 'FeatureCollection', features: this.events.items })
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
      this.updateLayer(this.$t('CatalogActivity.ALERTS_LAYER'), { type: 'FeatureCollection', features: this.alerts.items })
    },
    onAlertCollectionRefreshed () {
      this.refreshAlertsLayer()
      // We do not manage pagination now
      if (this.alerts.items.length > MAX_ITEMS) {
        this.$events.$emit('error', new Error(this.$t('errors.ALERTS_LIMIT')))
      }
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
    getEventPopup (feature, layer, options) {
      if (options.name !== this.$t('CatalogActivity.EVENTS_LAYER')) return null

      const description = _.get(feature, 'description')
      if (!description) return null
      const popup = L.popup({ autoPan: false }, layer)
      return popup.setContent(description)
    },
    getEventTooltip (feature, layer, options) {
      if (options.name !== this.$t('CatalogActivity.EVENTS_LAYER')) return null

      const tooltip = L.tooltip({ permanent: false }, layer)
      const name = _.get(feature, 'name')
      const date = new Date(_.get(feature, 'createdAt'))
      return tooltip.setContent('<b>' + name + '</b> - ' + this.formatDate(date))
    },
    onSelectEventTemplateAction (data) {
      // Extract event location
      if (data.feature) {
        const location = centroid(data.feature)
        this.eventParams = {
          longitude: _.get(location, 'geometry.coordinates[0]'),
          latitude: _.get(location, 'geometry.coordinates[1]')
          /* Not yet used
          layerId: data.feature.layer,
          featureId: data.feature._id
          */
        }
      } else {
        this.eventParams = {
          longitude: data.latlng.lng,
          latitude: data.latlng.lat
        }
      }
      this.$refs.templateModal.open()
    },
    onCreateEvent (template) {
      this.$router.push({
        name: 'create-event',
        params: Object.assign({
          contextId: this.contextId,
          templateId: template._id,
        }, this.eventParams)
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
    getAlertModalToolbar () {
      return [
        { id: 'close-action', label: this.$t('CLOSE'), icon: 'las la-times', handler: () => this.$refs.alertModal.close() }
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
    getTemplateModalToolbar () {
      return [
        { id: 'close-action', label: this.$t('CLOSE'), icon: 'las la-times', handler: () => this.$refs.templateModal.close() }
      ]
    },
    configureCollection (service, baseQuery, props = {}) {
      // As we'd like to use the collection mixin but need to require multiple services (alerts, events)
      // we create a specific component instance to manage each type of objects which are then added to the map.
      // Indeed we can only support one service if we directly use the mixin in the activity.
      const Component = Vue.extend({
        mixins: [kCoreMixins.baseCollection],
        methods: {
          loadService: () => this.$api.getService(service),
          getCollectionBaseQuery: () => baseQuery,
          // No pagination on map items
          getCollectionPaginationQuery: () => ({})
        }
      })
      return new Component({ propsData: props })
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
    this.registerStyle('tooltip', this.getProbedLocationForecastTooltip)
    this.registerStyle('markerStyle', this.getProbedLocationForecastMarker)
    // Handle plan
    await this.refreshPlan()
    // Check if option has been subscribed
    this.$checkBillingOption('catalog')
  },
  mounted () {
    this.alerts = this.configureCollection('alerts', { geoJson: true, $skip: 0, $limit: MAX_ITEMS }, { nbItemsPerPage: 0 })
    this.alerts.$on('collection-refreshed', this.onAlertCollectionRefreshed)
    const eventsBaseQuery = Object.assign({
      geoJson: true, $skip: 0, $limit: MAX_ITEMS,
      $select: ['_id', 'name', 'description', 'icon', 'location', 'createdAt', 'updatedAt', 'expireAt', 'deletedAt']
    }, this.planQuery())
    this.events = this.configureCollection('events', eventsBaseQuery, { nbItemsPerPage: 0 })
    this.events.$on('collection-refreshed', this.onEventCollectionRefreshed)
  },
  beforeDestroy () {
    this.alerts.$off('collection-refreshed', this.onAlertCollectionRefreshed)
    this.events.$off('collection-refreshed', this.onEventCollectionRefreshed)
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
