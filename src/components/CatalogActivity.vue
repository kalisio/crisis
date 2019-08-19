<template>
  <q-page>
    <div ref="map" :style="viewStyle">
      <q-resize-observer @resize="onMapResized" />
    </div>

    <k-radial-fab ref="radialFab" 
      :style="radialFabStyle"
      :start-angle="0"
      :end-angle="-180"
      :radius="80"
      @close="unselectFeatureForAction">
      <!--q-btn slot="closed-menu-container"
        round color="secondary" icon="keyboard_arrow_up" /-->
      <q-btn slot="open-menu-container"
        round color="secondary" icon="close" />
      <k-radial-fab-item
        v-for="(action, index) in featureActions" 
        :key="index">
        <q-btn round color="secondary" :icon="action.icon" @click="onFeatureActionClicked(action)" />
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
      @click="klayout.toggleRightDrawer()" />

    <div class="fixed" style="left: 18px; top: 70px">
      <k-location-bar @location-changed="onLocationChanged" />
    </div>

    <k-color-legend v-if="colorLegend.visible"
      class="fixed"
      :style="colorLegendStyle"
      :unit="colorLegend.unit"
      :hint="colorLegend.hint"
      :colorMap="colorLegend.colorMap"
      :colors="colorLegend.colors"
      :values="colorLegend.values"
      :unitValues="colorLegend.unitValues"
      :showGradient="colorLegend.showGradient"
      @click="onColorLegendClick" />
    />
    <k-modal ref="templateModal"
      :title="$t('CatalogActivity.CREATE_EVENT_TITLE')"
      :toolbar="getTemplateModalToolbar()"
      :buttons="getTemplateModalButtons()"
      :options="getTemplateModalOptions()" :route="false">
      <k-list ref="templates" slot="modal-content" service="event-templates" :base-query="baseQuery" :renderer="renderer" :contextId="contextId" :list-strategy="'smart'" @selection-changed="onEventTemplateSelected" />
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
    kMapMixins.legend,
    kMapMixins.locationIndicator,
    kMapMixins.map.actionButtons,
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
  inject: ['klayout'],
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
      },
      renderer: {
        component: 'KEventTemplateItem',
        props: { options: { } }
      }
    }
  },
  methods: {
    async refreshActivity () {
      this.clearActivity()
      // Title
      this.setTitle(this.$store.get('context.name'))
      // Setup the right drawer
      this.setRightDrawer('KCatalogPanel', this.$data)
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
    refreshFeatureActions (feature, layer) {
      this.clearFeatureActions()
      // Only on saved features and not in edition mode
      if (!feature._id || this.isLayerEdited(layer.name)) return
      this.featureActions.push({
        name: 'create-event',
        icon: 'whatshot',
        handler: this.onCreateEventAction
      })
      if (_.get(layer, 'schema._id')) {
        this.featureActions.push({
          name: 'edit-feature-properties',
          icon: 'edit',
          handler: this.onUpdateFeaturePropertiesAction
        })
      }
      this.featureActions.push({
        name: 'remove-feature',
        icon: 'remove_circle',
        handler: this.onRemoveFeatureAction
      })
    },
    onCreateEventAction (feature) {
      this.eventFeature = feature
      this.openTemplateModal()
    },
    async onUpdateFeaturePropertiesAction (feature, layer, leafletLayer) {
      await this.editLayer(layer.name)
      await this.updateFeatureProperties(feature, layer, leafletLayer)
      await this.editLayer(layer.name)
    },
    onRemoveFeatureAction (feature, layer, leafletLayer) {
      this.onRemoveFeature(feature, layer, leafletLayer)
    },
    getTemplateModalToolbar () {
      return [
        { name: 'close-action', label: this.$t('CLOSE'), icon: 'close', handler: () => this.closeTemplateModal() }
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
    openTemplateModal () {
      if (this.$refs.templates.items.length === 1) {
        // When we have a single template simply use it
        this.$router.push({
          name: 'create-event',
          params: {
            contextId: this.contextId,
            templateId: this.$refs.templates.items[0]._id,
            featureId: this.eventFeature._id
          }
        })
      } else {
        this.$refs.templateModal.open()
      }
    },
    closeTemplateModal () {
      this.$refs.templateModal.close()
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
    },
    onLocationChanged (location) {
      if (location) this.center(location.longitude, location.latitude)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-location-bar'] = this.$load('KLocationBar')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-list'] = this.$load('collection/KList')
  },
  mounted () {
  },
  beforeDestroy () {
  }
}
</script>
