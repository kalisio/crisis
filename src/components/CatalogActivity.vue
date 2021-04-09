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
import { Dialog } from 'quasar'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

const activityMixin = kCoreMixins.baseActivity()

export default {
  name: 'catalog-activity',
  mixins: [
    kCoreMixins.refsResolver(['map']),
    activityMixin,
    kMapMixins.activity,
    kCoreMixins.baseCollection,
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
    mixins.alerts
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
    loadService () {
      return this.$api.getService('alerts')
    },
    getCollectionBaseQuery () {
      return { geoJson: true }
    },
    getCollectionPaginationQuery () {
      // No pagination on map items
      return {}
    },
    async configureActivity () {
      // Wait until map is ready
      await this.initializeMap()
      activityMixin.methods.configureActivity.call(this)
      // Flag required actions as "beta"
      let actions = this.$store.get('fab.actions')
      actions.forEach(action => {
        if ((action.id === 'probe-location') || (action.id === 'add-layer')) {
          action.badge = { color: 'primary', floating: true, transparent: true, label: 'beta' }
        }
      })
      this.setCurrentTime(moment.utc())
      // Then update geo alerts
      this.refreshCollection()
    },
    async getCatalogLayers () {
      let layers = await kMapMixins.activity.methods.getCatalogLayers.call(this)
      // Add a "virtual" layer for alerts
      layers.push({
        name: this.$t('CatalogActivity.ALERTS_LAYER'),
        type: 'OverlayLayer',
        icon: 'fas fa-bell',
        isStorable: false,
        isEditable: false,
        isSelectable: false,
        isStyleEditable: false,
        featureId: '_id',
        leaflet: {
          type: 'geoJson',
          isVisible: true,
          realtime: true,
          popup: { pick: [] }
        }
      })
      // Flag required layers as "beta"
      layers.forEach(layer => {
        if (layer.type !== 'BaseLayer') {
          layer.badge = { color: 'primary', transparent: true, label: 'beta' }
        }
      })
      
      return layers
    },
    getFeatureActions (feature, layer) {
      let featureActions = []
      // When clicked on map
      if (!feature) {
        // We can initiate an event
        featureActions.push({
          name: 'create-event',
          icon: 'whatshot',
          handler: this.onSelectEventTemplateAction,
          label: this.$t('CatalogActivity.CREATE_EVENT_LOCATION_ACTION'),
          badge: { color: 'primary', floating: true, transparent: true, label: 'beta' }
        })
        // Check if weather layer activated
        const selectedLayer = _.values(this.layers).filter(sift({
          isVisible: true, type: 'OverlayLayer', tags: { $in: ['weather'] }
        }))
        if (selectedLayer.length > 0) featureActions.push({
          name: 'create-alert',
          icon: 'las la-bell',
          handler: this.onCreateWeatherAlertAction,
          label: this.$t('CatalogActivity.CREATE_WEATHER_ALERT_ACTION'),
          badge: { color: 'primary', floating: true, transparent: true, label: 'beta' }
        })
      } else if (!this.isLayerEdited(layer.name)) { // Not in edition mode
        // Only on feature services targeting non-user data
        if (layer.variables) {
          featureActions.push({
            name: 'create-alert',
            icon: 'las la-bell',
            handler: this.onCreateMeasureAlertAction,
            label: this.$t('CatalogActivity.CREATE_MEASURE_ALERT_ACTION'),
            badge: { color: 'primary', floating: true, transparent: true, label: 'beta' }
          })
        } else if (layer.name !== this.$t('CatalogActivity.ALERTS_LAYER')) {
          // Could be an internal feature or external one (eg WFS layer)
          let id = _.get(layer, 'featureId', '_id')
          id = _.get(feature, 'properties.' + id, _.get(feature, id))
          if (id) { // Only on saved features
            featureActions.push({
              name: 'create-event',
              icon: 'whatshot',
              handler: this.onSelectEventTemplateAction,
              label: this.$t('CatalogActivity.CREATE_EVENT_FEATURE_ACTION'),
              badge: { color: 'primary', floating: true, transparent: true, label: 'beta' }
            })
          }
        }
      }
      return featureActions
    },
    refreshAlertsLayer () {
      this.updateLayer(this.$t('CatalogActivity.ALERTS_LAYER'), { type: 'FeatureCollection', features: this.items })
    },
    onAlertCollectionRefreshed () {
      this.refreshAlertsLayer()
      // We do not manage pagination now
      if (this.items.length < this.nbTotalItems) {
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
        const alert = await this.$api.getService('alerts').create(result.values)
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
    }
  },
  created () {
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
    this.registerStyle('tooltip', this.getProbedLocationForecastTooltip)
    this.registerStyle('markerStyle', this.getProbedLocationForecastMarker)

    // Check if option has been subscribed
    this.$checkBillingOption('catalog')
  },
  mounted () {
    this.$on('collection-refreshed', this.onAlertCollectionRefreshed)
  },
  beforeDestroy () {
    this.$off('collection-refreshed', this.onAlertCollectionRefreshed)
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
