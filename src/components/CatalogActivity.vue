<template>
  <div>
    <div ref="map" :style="viewStyle">
      <q-resize-observable @resize="onMapResized" />
    </div>
    <k-radial-fab ref="radialMenu" 
      :style="radialFabStyle"
      :button="false"
      :itemSize="50"
      :radius="80"
      :angle-restriction="-180"
      @close="unselectFeatureForAction">
      <k-radial-fab-item 
        v-for="(action, index) in featureActions" 
        :key="index" 
        :style="radialFabItemStyle" 
        @click="onFeatureActionClicked(action)">
        <q-icon :name="action.icon" style="color: #f8ffd7"/>
      </k-radial-fab-item>
    </k-radial-fab>
    <q-btn 
      id="map-panel-toggle"
      color="secondary"
      class="fixed"
      style="right: 18px; top: 72px"
      small
      round 
      icon="layers"
      @click="layout.toggleRight()" />
  </div>
</template>

<script>
import moment from 'moment'
import { QResizeObservable, QBtn, QIcon } from 'quasar'
import { mixins as kMapMixins } from '@kalisio/kdk-map/client'
import { mixins as kCoreMixins } from '@kalisio/kdk-core/client'

export default {
  name: 'catalog-activity',
  mixins: [
    kCoreMixins.refsResolver(['map']),
    kCoreMixins.baseActivity,
    kMapMixins.geolocation,
    kMapMixins.featureService,
    kMapMixins.weacast,
    kMapMixins.time,
    kMapMixins.activity('catalog'),
    kMapMixins.actionButtons,
    kMapMixins.legend,
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
  inject: ['layout'],
  components: {
    QResizeObservable,
    QBtn,
    QIcon
  },
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  methods: {
    async refreshActivity () {
      this.clearActivity()
      // Title
      this.setTitle(this.$store.get('context.name'))
      // Setup the right pane
      this.setRightPanelContent('KCatalogPanel', this.$data)
      this.registerActivityActions()
      // Wait until map is ready
      await this.initializeMap()
      this.setCurrentTime(moment.utc())
    },
    async getCatalogLayers () {
      let layers = []
      // We get layers coming from any global catalog first
      const catalogService = this.$api.getService('catalog', '')
      if (catalogService) {
        let response = await catalogService.find()
        layers = layers.concat(response.data)
      }
      // Then merge layers coming from any contextual catalog
      const contextualCatalogService = this.$api.getService('catalog')
      if (contextualCatalogService && (contextualCatalogService !== catalogService)) {
        let response = await contextualCatalogService.find()
        layers = layers.concat(response.data)
      }
      return layers
    },
    refreshFeatureActions (feature, layer) {
      this.clearFeatureActions()
      // Only on saved features
      if (!feature._id) return
      this.featureActions.push({
        name: 'create-event',
        icon: 'whatshot',
        handler: this.createEvent
      })
      if (_.get(layer, 'schema._id')) {
        this.featureActions.push({
          name: 'edit-feature-properties',
          icon: 'edit',
          handler: this.onUpdateFeatureProperties
        })
      }
      this.featureActions.push({
        name: 'remove-feature',
        icon: 'remove_circle',
        handler: this.onRemoveFeature
      })
    },
    createEvent (feature) {
      // TODO
    }
  },
  created () {
  },
  async mounted () {
  },
  beforeDestroy () {
  }
}
</script>

<style>
.catalog-map {
  position: absolute;
  left: 0rem;
  right: 0rem;
  top: 0rem;
  bottom: 0rem;
  font-weight: normal;
  z-index: 0;
}
</style>