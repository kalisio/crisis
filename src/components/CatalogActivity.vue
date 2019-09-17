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
      :buttons="getTemplateModalButtons()"
      :options="getTemplateModalOptions()" :route="false">
      <k-list ref="templates" slot="modal-content" service="event-templates" :base-query="baseQuery" :contextId="contextId" :list-strategy="'smart'" @selection-changed="onEventTemplateSelected" />
    </k-modal>
  </q-page>
</template>

<script>
import moment from 'moment'
import { mixins as kMapMixins } from '@kalisio/kdk-map/client.map'
import { mixins as kCoreMixins } from '@kalisio/kdk-core/client'

const activityMixin = kMapMixins.activity('catalog')

export default {
  name: 'catalog-activity',
  mixins: [
    kCoreMixins.refsResolver(['map']),
    kCoreMixins.baseActivity,
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
      baseQuery: {
        $sort: { name: 1 }
      }
    }
  },
  methods: {
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
    },
    async getCatalogLayers () {
      // We get layers coming from global catalog first
      let response = await this.$api.getService('catalog', '').find()
      let layers = response.data
      // Then merge layers coming from contextual catalog by calling super
      response = await activityMixin.methods.getCatalogLayers.call(this)
      layers = layers.concat(response)
      return layers
    },
    getFeatureActions (feature, layer) {
      let featureActions = []
      // Only on saved features and not in edition mode
      if (!feature._id || this.isLayerEdited(layer.name)) featureActions
      featureActions.push({
        name: 'create-event',
        icon: 'whatshot',
        handler: this.onCreateEventAction
      })
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
      return featureActions
    },
    onCreateEventAction (feature) {
      this.eventFeature = feature
      this.$refs.templateModal.open()
    },
    async onUpdateFeaturePropertiesAction (feature, layer, target) {
      await this.editLayer(layer.name)
      await this.updateFeatureProperties(feature, layer, target)
      await this.editLayer(layer.name)
    },
    onRemoveFeatureAction (feature, layer, target) {
      this.onRemoveFeature(feature, layer, target)
    },
    getTemplateModalToolbar () {
      return [
        { name: 'close-action', label: this.$t('CLOSE'), icon: 'close', handler: () => this.$refs.templateModal.close() }
      ]
    },
    getTemplateModalButtons () {
      return []
    },
    getTemplateModalOptions () {
      return {
        padding: '4px',
        minWidth: '40vw',
        maxWidth: '60vw',
        minHeight: '20vh'
      }
    },
    onEventTemplateSelected (template) {
      this.$router.push({
        name: 'create-event',
        params: {
          contextId: this.contextId,
          templateId: template._id,
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
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
</script>
