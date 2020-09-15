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
        Feature actions
       -->
      <k-feature-action-button />
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

      <k-modal ref="templateModal"
        :title="$t('CatalogActivity.CREATE_EVENT_TITLE')"
        :toolbar="getTemplateModalToolbar()"
        :buttons="[]"
        :options="{ padding: '4px', minWidth: '40vw', maxWidth: '60vw', minHeight: '20vh' }" :route="false">
        <k-list ref="templates" slot="modal-content" service="event-templates" :base-query="baseTemplateQuery" :contextId="contextId" :list-strategy="'smart'" @selection-changed="onEventTemplateSelected" />
      </k-modal>

      <k-modal ref="alertModal"
        :title="$t('CatalogActivity.CREATE_ALERT_TITLE')"
        :toolbar="getAlertModalToolbar()"
        :buttons="[]"
        :options="{}" :route="false">
        <div slot="modal-content">
          <alert-form :class="{ 'light-dimmed': inProgress }" ref="alertForm"
            :layer="alertLayer" :feature="alertFeature" :forecastModel="forecastModel"/>
          <div class="row justify-end" style="padding: 12px">
            <q-btn id="apply-button" color="primary" flat :label="$t('CREATE')" @click="onCreateAlert"/>
          </div>
          <q-spinner-cube color="primary" class="fixed-center" v-if="inProgress" size="4em"/>
        </div>
      </k-modal>
    </template>
  </k-page>
</template>

<script>
import moment from 'moment'
import sift from 'sift'
import { Dialog } from 'quasar'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

const activityMixin = kMapMixins.activity('catalog')

export default {
  name: 'catalog-activity',
  mixins: [
    kCoreMixins.refsResolver(['map']),
    kCoreMixins.baseActivity,
    kCoreMixins.baseCollection,
    kMapMixins.geolocation,
    kMapMixins.style,
    kMapMixins.featureSelection,
    kMapMixins.featureService,
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
    async refreshActivity () {
      this.clearActivity()
      this.clearNavigationBar()
      // Wait until map is ready
      await this.initializeMap()
      // Title
      this.setTitle(this.$store.get('context.name'))
      // Setup the right drawer
      this.setRightDrawer('catalog/KCatalogPanel', this.$data)
      // Setup the widgets
      this.registerWidget('information-box', 'las la-digital-tachograph', 'widgets/KInformationBox', this.selection)
      this.registerWidget('time-series', 'las la-chart-line', 'widgets/KTimeSeries', this.$data)
      if (this.mapillaryClientID) this.registerWidget('mapillary-viewer', 'img:statics/mapillary-icon.svg', 'widgets/KMapillaryViewer')
      // Actions
      this.registerActivityActions()
      this.setCurrentTime(moment.utc())
      // Then update geo alerts
      this.refreshCollection()
    },
    async getCatalogLayers () {
      let layers = await activityMixin.methods.getCatalogLayers.call(this)
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
          'marker-color': `<% if (feature.status.active) { %>red<% } else { %>green<% } %>`,
          'stroke': `<% if (feature.status.active) { %>red<% } else { %>green<% } %>`,
          'fill': `<% if (feature.status.active) { %>red<% } else { %>green<% } %>`,
          'icon-classes': `fas fa-bell`,
          'icon-color': 'white',
          template: ['marker-color', 'stroke', 'fill'],
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
    registerActivityActions () {
      activityMixin.methods.registerActivityActions.call(this)
      // Flag required actions as "beta"
      let actions = this.$store.get('fab.actions')
      actions.forEach(action => {
        if ((action.name === 'probe') || (action.name === 'create-layer') || (action.name === 'import-layer')) {
          action.badge = { color: 'primary', floating: true, transparent: true, label: 'beta' }
        }
      })
    },
    getFeatureActions (feature, layer) {
      let featureActions = []
      // When clicked on map
      if (!feature) {
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
      } else if (feature._id && !this.isLayerEdited(layer.name)) { // Only on saved features and not in edition mode
        // Only on feature services targeting non-user data
        if (layer.variables) {
          featureActions.push({
            name: 'create-alert',
            icon: 'las la-bell',
            handler: this.onCreateMeasureAlertAction,
            label: this.$t('CatalogActivity.CREATE_MEASURE_ALERT_ACTION'),
            badge: { color: 'primary', floating: true, transparent: true, label: 'beta' }
          })
        } else {
          /* FIXME: Not yet available
          if (layer.name !== this.$t('CatalogActivity.ALERTS_LAYER')) {
            featureActions.push({
              name: 'create-event',
              icon: 'whatshot',
              handler: this.onCreateEventAction,
              label: this.$t('CatalogActivity.CREATE_EVENT_ACTION'),
              badge: { color: 'primary', floating: true, transparent: true, label: 'beta' }
            })
          }
          */
          if (_.get(layer, 'schema.content')) {
            featureActions.push({
              name: 'edit-feature-properties',
              icon: 'las la-file-alt',
              handler: this.onUpdateFeaturePropertiesAction,
              label: this.$t('CatalogActivity.EDIT_FEATURE_PROPERTIES_ACTION'),
              badge: { color: 'primary', floating: true, transparent: true, label: 'beta' }
            })
          }
          featureActions.push({
            name: 'remove-feature',
            icon: 'las la-minus-circle',
            handler: this.onRemoveFeatureAction,
            label: this.$t('CatalogActivity.REMOVE_FEATURE_ACTION'),
            badge: { color: 'primary', floating: true, transparent: true, label: 'beta' }
          })
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
    getAlertPopup (alert, layer, options) {
      if (options.name !== this.$t('CatalogActivity.ALERTS_LAYER')) return null

      const html = this.getAlertDetailsAsHtml(alert)
      return L.popup({ autoPan: false }, layer).setContent(`<b>${html}</b>`)
    },
    getAlertTooltip (alert, layer, options) {
      if (options.name !== this.$t('CatalogActivity.ALERTS_LAYER')) return null

      const html = this.getAlertStatusAsHtml(alert)
      return L.tooltip({ permanent: false }, layer).setContent(`<b>${html}</b>`)
    },
    onCreateEventAction (data) {
      this.eventFeature = data.feature
      this.baseTemplateQuery['layer._id'] = data.layer._id
      this.$refs.templateModal.open()
    },
    async onUpdateFeaturePropertiesAction (data) {
      await this.editLayer(data.layer.name)
      await this.updateFeatureProperties(data.feature, data.layer, data.target)
      await this.editLayer(data.layer.name)
    },
    onRemoveFeatureAction (data) {
      if (data.layer.name === this.$t('CatalogActivity.ALERTS_LAYER')) { // Alert deletion
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
      } // User feature deletion
      else this.onRemoveFeature(data.feature, data.layer, data.target)
    },
    getAlertModalToolbar () {
      return [
        { name: 'close-action', label: this.$t('CLOSE'), icon: 'las la-times', handler: () => this.$refs.alertModal.close() }
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
        { name: 'close-action', label: this.$t('CLOSE'), icon: 'las la-times', handler: () => this.$refs.templateModal.close() }
      ]
    },
    onEventTemplateSelected (template) {
      this.$router.push({
        name: 'create-event',
        params: {
          contextId: this.contextId,
          templateId: template._id,
          layerId: this.eventFeature.layer,
          featureId: this.eventFeature._id
        }
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-opener-proxy'] = this.$load('frame/KOpenerProxy')
    this.$options.components['k-navigation-bar'] = this.$load('KNavigationBar')
    this.$options.components['k-timeline'] = this.$load('KTimeline')
    this.$options.components['k-color-legend'] = this.$load('KColorLegend')
    this.$options.components['k-feature-action-button'] = this.$load('KFeatureActionButton')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-list'] = this.$load('collection/KList')
    this.$options.components['alert-form'] = this.$load('AlertForm')

    this.registerStyle('tooltip', this.getVigicruesTooltip)
    this.registerStyle('tooltip', this.getAlertTooltip)
    this.registerStyle('popup', this.getAlertPopup)
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
