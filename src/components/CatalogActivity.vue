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
        <alert-form :class="{ 'light-dimmed': inProgress }" ref="alertForm"
          :layer="alertLayer" :feature="alertFeature" :forecastModel="forecastModel"/>
        <div class="row justify-end" style="padding: 12px">
          <q-btn id="apply-button" color="primary" flat :label="$t('CREATE')" @click="onCreateAlert"/>
        </div>
        <q-spinner-cube color="primary" class="fixed-center" v-if="inProgress" size="4em"/>
      </div>
    </k-modal>

    <k-modal ref="layerStyleModal"
      :title="$t('CatalogActivity.EDIT_LAYER_STYLE_TITLE')"
      :toolbar="getLayerStyleModalToolbar()"
      :buttons="[]"
      :options="{}" :route="false">
      <div slot="modal-content">
        <layer-style-form :class="{ 'light-dimmed': inProgress }" ref="layerStyleForm"
          :layer="styledLayer"/>
        <div class="row justify-end" style="padding: 12px">
          <q-btn id="apply-button" color="primary" flat :label="$t('APPLY')" @click="onEditLayerStyle"/>
        </div>
        <q-spinner-cube color="primary" class="fixed-center" v-if="inProgress" size="4em"/>
      </div>
    </k-modal>
  </q-page>
</template>

<script>
import moment from 'moment'
import sift from 'sift'
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
      styledLayer: null,
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
          'marker-color': `<% if (feature.status.active) { %>red<% } else { %>green<% } %>`,
          'icon-classes': `fas fa-bell`,
          'icon-color': 'white',
          template: ['marker-color'],
          popup: { pick: [] }
        }
      })
      return layers
    },
    isLayerStyleEditable (layer) {
      if (_.has(layer, 'isStyleEditable')) return _.get(layer, 'isStyleEditable')
      // Only possible on user-defined and saved layers by default
      else return (layer._id && (layer.service === 'features'))
    },
    registerLayerActions (layer) {
      let actions = activityMixin.methods.registerLayerActions.call(this, layer)
      if (this.isLayerStyleEditable(layer)) {
        const index = _.findIndex(actions, action => action.name === 'edit-data')
        actions.splice(index, 0, {
          name: 'edit-style',
          label: this.$t('CatalogActivity.EDIT_LAYER_STYLE'),
          icon: 'fas fa-border-style',
          handler: () => this.onEditLayerStyle(layer)
        })
        this.$set(layer, 'actions', actions)
        return actions
      }
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
          icon: 'fas fa-bell',
          handler: this.onCreateWeatherAlertAction,
          label: this.$t('CatalogActivity.CREATE_WEATHER_ALERT_ACTION')
        })
      } else if (feature._id && !this.isLayerEdited(layer.name)) { // Only on saved features and not in edition mode
        // Only on feature services targeting non-user data
        if (layer.variables) {
          featureActions.push({
            name: 'create-alert',
            icon: 'fas fa-bell',
            handler: this.onCreateMeasureAlertAction,
            label: this.$t('CatalogActivity.CREATE_MEASURE_ALERT_ACTION')
          })
        } else {
          if (layer.name !== this.$t('CatalogActivity.ALERTS_LAYER')) {
            featureActions.push({
              name: 'create-event',
              icon: 'whatshot',
              handler: this.onCreateEventAction,
              label: this.$t('CatalogActivity.CREATE_EVENT_ACTION')
            })
          }
          if (_.get(layer, 'schema.content')) {
            featureActions.push({
              name: 'edit-feature-properties',
              icon: 'edit',
              handler: this.onUpdateFeaturePropertiesAction,
              label: this.$t('CatalogActivity.EDIT_FEATURE_PROPERTIES_ACTION')
            })
          }
          featureActions.push({
            name: 'remove-feature',
            icon: 'remove_circle',
            handler: this.onRemoveFeatureAction,
            label: this.$t('CatalogActivity.REMOVE_FEATURE_ACTION')
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
    getAlertTooltip (alert, layer) {
      if (!_.has(alert, 'status.active')) return null

      const isActive = _.get(alert, 'status.active')
      const checkedAt = new Date(_.get(alert, 'status.checkedAt'))
      const triggeredAt = new Date(_.get(alert, 'status.triggeredAt'))
      let html = ''
      if (_.has(alert, 'feature')) html += `${alert.featureLabel || alert.feature}</br>`
      if (_.has(alert, 'layer')) html += `${alert.layer} - `
      if (isActive) html += this.$t('CatalogActivity.ALERT_ACTIVE') + '</br>'
      else html += this.$t('CatalogActivity.ALERT_INACTIVE') + '</br>'
      _.forOwn(alert.conditions, (value, key) => {
        // Get corresponding variable
        const variable = _.find(this.currentVariables, { name: key })
        const label = this.$t(variable.label) || variable.label
        const unit = variable.units[0]
        if (_.has(value, '$gte')) html += isActive ?
          `${label} ` + this.$t('CatalogActivity.ALERT_GTE') + ` ${value.$gte} ${unit}</br>` :
          `${label} ` + this.$t('CatalogActivity.ALERT_LTE') + ` ${value.$gte} ${unit}</br>`
        if (_.has(value, '$lte')) html += isActive ?
          `${label} ` + this.$t('CatalogActivity.ALERT_LTE') + ` ${value.$lte} ${unit}</br>` :
          `${label} ` + this.$t('CatalogActivity.ALERT_GTE') + ` ${value.$lte} ${unit}</br>`
      })
      if (isActive) html += this.$t('CatalogActivity.ALERT_TRIGGERED_AT') +
        ` ${this.formatTime('date.short', triggeredAt)} - ${this.formatTime('time.short', triggeredAt)}`
      else html += this.$t('CatalogActivity.ALERT_CHECKED_AT') +
        ` ${this.formatTime('date.short', checkedAt)} - ${this.formatTime('time.short', checkedAt)}`

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
            label: this.$t('OK')
          },
          cancel: {
            label: this.$t('CANCEL')
          }
        }).onOk(async () => {
          await this.$api.getService('alerts').remove(data.feature._id)
        })
      } // User feature deletion
      else this.onRemoveFeature(data.feature, data.layer, data.target)
    },
    getAlertModalToolbar () {
      return [
        { name: 'close-action', label: this.$t('CLOSE'), icon: 'close', handler: () => this.$refs.alertModal.close() }
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
    getLayerStyleModalToolbar () {
      return [
        { name: 'close-action', label: this.$t('CLOSE'), icon: 'close', handler: () => this.$refs.layerStyleModal.close() }
      ]
    },
    onEditLayerStyle (layer) {
      this.styledLayer = layer
      this.$refs.layerStyleModal.open()
    },
    async onLayerStyleEdited (layer) {
      const result = this.$refs.layerStyleForm.validate()
      if (!result.isValid) return
      this.inProgress = true
      try {
        await this.$api.getService('catalog').patch(layer._id, result.values)
      } catch (_) {
      }
      this.inProgress = false
      this.$refs.layerStyleModal.close()
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
    this.$options.components['alert-form'] = this.$load('AlertForm')
    this.$options.components['layer-style-form'] = this.$load('LayerStyleForm')

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