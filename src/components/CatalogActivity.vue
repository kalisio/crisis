<template>
  <q-page>
    <div ref="map" :style="viewStyle">
      <q-resize-observer @resize="onMapResized" />
    </div>

    <k-feature-action-button />
   
    <q-page-sticky position="top" :offset="[0, 18]">
      <k-navigation-bar />
    </q-page-sticky>

    <q-page-sticky position="left" :offset="[18, 0]">
      <k-feature-info-box style="min-width: 150px; width: 15vw; max-height: 40vh" />
    </q-page-sticky>

    <q-page-sticky position="left" :offset="[18, 0]">
      <k-color-legend/>
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
        <k-alert-form :class="{ 'light-dimmed': inProgress }" ref="alertForm"
          :layer="alertLayer" :feature="alertFeature" :forecastModel="forecastModel"/>
        <div class="row justify-end" style="padding: 12px">
          <q-btn id="apply-button" color="primary" flat :label="$t('CREATE')" @click="onCreateAlert"/>
        </div>
        <q-spinner-cube color="primary" class="fixed-center" v-if="inProgress" size="4em"/>
      </div>
    </k-modal>
  </q-page>
</template>

<script>
import moment from 'moment'
import { Dialog } from 'quasar'
import { mixins as kMapMixins } from '@kalisio/kdk-map/client.map'
import { mixins as kCoreMixins } from '@kalisio/kdk-core/client'

const activityMixin = kMapMixins.activity('catalog')

export default {
  name: 'catalog-activity',
  mixins: [
    kCoreMixins.refsResolver(['map']),
    kCoreMixins.baseActivity,
    kCoreMixins.baseCollection,
    kMapMixins.geolocation,
    kMapMixins.featureService,
    kMapMixins.weacast,
    kMapMixins.time,
    activityMixin,
    kMapMixins.locationIndicator,
    kMapMixins.map.baseMap,
    kMapMixins.map.geojsonLayers,
    kMapMixins.map.forecastLayers,
    kMapMixins.map.fileLayers,
    kMapMixins.map.editLayers,
    kMapMixins.map.style,
    kMapMixins.map.tooltip,
    kMapMixins.map.popup,
    kMapMixins.map.activity,
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
      // Title
      this.setTitle(this.$store.get('context.name'))
      // Setup the right drawer
      this.setRightDrawer('KCatalogPanel', this.$data)
      // Actions
      this.registerActivityActions()
      // Wait until map is ready
      await this.initializeMap()
      this.setCurrentTime(moment.utc())
      // Then update geo alerts
      this.refreshCollection()
    },
    async getCatalogLayers () {
      // We get layers coming from global catalog first
      let response = await this.$api.getService('catalog', '').find()
      let layers = response.data
      // Then merge layers coming from contextual catalog by calling super
      response = await activityMixin.methods.getCatalogLayers.call(this)
      layers = layers.concat(response)
      // Add a "virtual" layer for alerts
      layers.push({
        name: this.$t('CatalogActivity.ALERTS_LAYER'),
        type: 'OverlayLayer',
        icon: 'fas fa-bell',
        isStorable: false,
        isEditable: false,
        featureId: '_id',
        leaflet: {
          type: 'geoJson',
          isVisible: true,
          realtime: true,
          'marker-color': `<% if (status.active) { %>red<% } else { %>green<% } %>`,
          'icon-classes': `fas fa-bell`,
          'icon-color': 'white',
          template: ['marker-color'],
          popup: { pick: [] }
        }
      })
      return layers
    },
    getFeatureActions (feature, layer) {
      // Only on saved features and not in edition mode
      if (!feature._id || this.isLayerEdited(layer.name)) []
      let featureActions = []
      // Only on feature services targeting non-user data
      if (layer.variables) {
        featureActions.push({
          name: 'create-alert',
          icon: 'fas fa-bell',
          handler: this.onCreateAlertAction
        })
      } else {
        if (layer.name !== this.$t('CatalogActivity.ALERTS_LAYER')) {
          featureActions.push({
            name: 'create-event',
            icon: 'whatshot',
            handler: this.onCreateEventAction
          })
        }
        if (_.get(layer, 'schema.content')) {
          featureActions.push({
            name: 'edit-feature-properties',
            icon: 'edit',
            handler: this.onUpdateFeaturePropertiesAction
          })
        }
        featureActions.push({
          name: 'remove-feature',
          icon: 'remove_circle',
          handler: this.onRemoveFeatureAction
        })
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
    getAlertTooltip (feature, layer) {
      if (!_.has(feature, 'status.active')) return null
      let html = (_.get(feature, 'status.active') ?
        this.$t('CatalogActivity.ALERT_ACTIVE') : this.$t('CatalogActivity.ALERT_INACTIVE'))
      return L.tooltip({ permanent: false }, layer).setContent(`<b>${html}</b>`)
    },
    onCreateEventAction (feature, layer) {
      this.eventFeature = feature
      this.baseTemplateQuery['layer._id'] = layer._id
      this.$refs.templateModal.open()
    },
    async onUpdateFeaturePropertiesAction (feature, layer, target) {
      await this.editLayer(layer.name)
      await this.updateFeatureProperties(feature, layer, target)
      await this.editLayer(layer.name)
    },
    onRemoveFeatureAction (feature, layer, target) {
      if (layer.name === this.$t('CatalogActivity.ALERTS_LAYER')) { // Alert deletion
        Dialog.create({
          title: this.$t('CatalogActivity.REMOVE_ALERT_DIALOG_TITLE'),
          message: this.$t('CatalogActivity.REMOVE_ALERT_DIALOG_MESSAGE'),
          html: true,
          ok: {
            label: this.$t('OK')
          },
          cancel: {
            label: this.$t('CANCEL')
          }
        }).onOk(async () => {
          await this.$api.getService('alerts').remove(feature._id)
        })
      } // User feature deletion
      else this.onRemoveFeature(feature, layer, target)
    },
    onCreateAlertAction (feature, layer) {
      this.alertFeature = feature
      this.alertLayer = layer
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
    onProbeLocation () {
      const probe = async (options, event) => {
        this.unsetCursor('probe-cursor')
        this.alertFeature = {
          geometry: {
            type: 'Point', coordinates: [event.latlng.lng, event.latlng.lat]
          }
        }
        this.onCreateAlert()
      }
      this.setCursor('probe-cursor')
      this.$once('click', probe)
    },
    getTemplateModalToolbar () {
      return [
        { name: 'close-action', label: this.$t('CLOSE'), icon: 'close', handler: () => this.$refs.templateModal.close() }
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
    },
    getAlertModalToolbar () {
      return [
        { name: 'close-action', label: this.$t('CLOSE'), icon: 'close', handler: () => this.$refs.alertModal.close() }
      ]
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-navigation-bar'] = this.$load('KNavigationBar')
    this.$options.components['k-color-legend'] = this.$load('KColorLegend')
    this.$options.components['k-feature-info-box'] = this.$load('KFeatureInfoBox')
    this.$options.components['k-feature-action-button'] = this.$load('KFeatureActionButton')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-list'] = this.$load('collection/KList')
    this.$options.components['k-alert-form'] = this.$load('KAlertForm')

    this.registerLeafletStyle('tooltip', this.getAlertTooltip)
  },
  mounted () {
    this.$on('collection-refreshed', this.onAlertCollectionRefreshed)
  },
  beforeDestroy () {
    this.$off('collection-refreshed', this.onAlertCollectionRefreshed)
  }
}
</script>
