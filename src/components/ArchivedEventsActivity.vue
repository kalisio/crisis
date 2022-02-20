<template>
  <k-page :padding="false" @content-resized="onPageContentResized">
    <div slot="page-content">
      <q-page-sticky v-show="showMap && heatmap" position="bottom" :offset="[0, 16]" style="z-index: 1">
        <div class="row">
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <div class="col-12">
          <q-slider id="heatmap-radius" v-model="heatmapRadius" :min="1" :max="100" :step="1"
            label-always :label-value="$t('ArchivedEventsActivity.HEATMAP_RADIUS_LABEL') + ': ' + heatmapRadius + ' Kms'" @change="onHeatmapRadius"></q-slider>
          </div>
        </div>
      </q-page-sticky>
      <!--
        Events history: switch append-items on to activate infinite scroll
      -->
      <div v-if="showHistory && height" class="row justify-center q-pl-lg q-pr-none">
        <k-history
          style="padding-top: 80px;"
          id="history"
          service="archived-events"
          :append-items="true"
          :base-query="baseQuery"
          :filter-query="filterQuery"
          :renderer="renderer"
          date-field="updatedAt"
          :contextId="contextId"
          :list-strategy="'smart'"
          :height="height - 124">
          <template slot="empty-history">
            <div class="absolute-center">
              <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KHistory.EMPTY_HISTORY')" />
            </div>
          </template>
        </k-history>
      </div>
      <!--
        Events map
      -->
      <div v-show="showMap">
        <div ref="map" :style="viewStyle">
          <q-resize-observer @resize="onMapResized" />
        </div>
      </div>
      <!--
        Events graph
      -->
      <div v-show="showChart" class="row justify-center text-center q-ma-none q-pa-none" >
        <q-page-sticky position="top" :offset="[0, 60]">
        <div style="width: 90vw">
          <canvas class="chart" id="chart" ref="chart"></canvas>
        </div>
        </q-page-sticky>
        <q-btn v-show="currentChart > 1" size="1rem" flat round color="primary"
          icon="las la-chevron-left" class="absolute-left" @click="onPreviousChart"/>
        <q-btn v-show="currentChart < nbCharts" size="1rem" flat round color="primary"
          icon="las la-chevron-right" class="absolute-right" @click="onNextChart" />
      </div>
      <k-modal
        id="chart-settings-modal"
        :title="$t('ArchivedEventsActivity.CHART_SETTINGS_MODAL_TITLE')"
        :buttons="getChartSettingsModalButtons()"
        ref="chartSettingsModal"
      >
        <div>
          <q-select id="chart-type" v-model="chartType" :label="$t('ArchivedEventsActivity.CHART_LABEL')"
          :options="chartOptions" @input="refreshChart"/>
          <q-select id="count-per-chart" v-model="nbValuesPerChart" :label="$t('ArchivedEventsActivity.PAGINATION_LABEL')"
            :options="paginationOptions" @input="refreshChartAndPagination"/>
          <q-select id="chart-render" v-model="render" :label="$t('ArchivedEventsActivity.RENDER_LABEL')"
            :options="renderOptions" @input="refreshChart"/>
        </div>
      </k-modal>
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="archived-events"></router-view>
    </div>
  </k-page>
</template>

<script>
import _ from 'lodash'
import L from 'leaflet'
import chroma from 'chroma-js'
import Chart from 'chart.js'
import 'chartjs-plugin-labels'
import Papa from 'papaparse'
import { QSlider } from 'quasar'
import { mixins as kCoreMixins, utils as kCoreUtils, Time } from '@kalisio/kdk/core.client'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'
import mixins from '../mixins'

const activityMixin = kCoreMixins.baseActivity()

// For mapping or statistics we get all events at once to avoid managing pagination
const MAX_EVENTS = 5000

export default {
  name: 'archived-events-activity',
  mixins: [
    kCoreMixins.refsResolver(['map']),
    activityMixin,
    kCoreMixins.baseCollection,
    kMapMixins.activity,
    kMapMixins.style,
    kMapMixins.context,
    kMapMixins.map.baseMap,
    kMapMixins.map.geojsonLayers,
    kMapMixins.map.heatmapLayers,
    kMapMixins.map.style,
    kMapMixins.map.tooltip,
    kMapMixins.map.popup,
    kMapMixins.map.activity,
    mixins.plans
  ],
  components: {
    QSlider
  },
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
  computed: {
    mode () {
      return this.topPane.mode
    },
    showMap () {
      return this.mode === 'map'
    },
    showChart () {
      return this.mode === 'chart'
    },
    showHistory () {
      return this.mode === 'history'
    },
    nbCharts () {
      if (!this.chartData.length || (this.nbValuesPerChart.value === 0)) return 1
      else return Math.ceil(this.chartData.length / this.nbValuesPerChart.value)
    },
    renderer () {
      return _.merge({
        component: 'ArchivedEventCard',
        service: 'archived-events',
        dense: this.$q.screen.lt.sm
      }, this.activityOptions.items)
    },
    baseQuery () {
      const query = { $sort: { createdAt: -1 } }
      // When displaying events of all plans we'd like to have the plan object directly to ease processing
      if (!this.planId && this.showHistory) Object.assign(query, { planAsObject: true })
      Object.assign(query, this.getPlanQuery())
      return query
    },
    filterQuery () {
      const query = _.clone(this.filter.query)
      Object.assign(query, this.getPlanObjectiveQuery())
      return query
    }
  },
  data () {
    const chartTypes = ['pie', 'polarArea', 'radar', 'bar']
    const chartOptions = chartTypes.map(
      type => ({ value: type, label: this.$i18n.t(`ArchivedEventsActivity.CHART_LABEL_${type.toUpperCase()}`) }))
    const paginationOptions = [{
      value: 0, label: this.$i18n.t('ArchivedEventsActivity.ALL_VALUES')
    }, {
      value: 5, label: '5'
    }, {
      value: 10, label: '10'
    }, {
      value: 20, label: '20'
    }]
    const renderOptions = [{
      value: 'count', label: this.$i18n.t('ArchivedEventsActivity.COUNT_LABEL')
    }, {
      value: 'percentage', label: this.$i18n.t('ArchivedEventsActivity.PERCENTAGE_LABEL')
    }, {
      value: 'participants', label: this.$i18n.t('ArchivedEventsActivity.PARTICIPANT_COUNT_LABEL')
    }]

    return {
      filter: this.$store.get('filter'),
      topPane: this.$store.get('topPane'),
      heatmap: false,
      byTemplate: false,
      heatmapRadius: 1,
      // TODO
      sortBy: {
        label: this.$i18n.t('ArchivedEventsActivity.SORT_BY_CREATED_DATE_LABEL'),
        value: 'createdAt'
      },
      chartType: _.find(chartOptions, { value: 'pie' }),
      chartOptions,
      currentChart: 1,
      nbValuesPerChart: _.find(paginationOptions, { value: 10 }),
      paginationOptions,
      renderOptions,
      render: _.find(renderOptions, { value: 'count' }),
      chartData: [],
      height: undefined
    }
  },
  methods: {
    async configureActivity () {
      // Wait until map is ready
      await this.initializeMap()
      activityMixin.methods.configureActivity.call(this)
    },
    async getCatalogLayers () {
      const layers = await kMapMixins.activity.methods.getCatalogLayers.call(this)
      // We only want base layers
      return _.filter(layers, { type: 'BaseLayer' })
    },
    formatDate (date) {
      return date.toLocaleString(kCoreUtils.getLocale(),
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    getHeatmapOptions () {
      return {
        // The unit is in pixel, meaning
        // 1 pixel radius (2 pixel diameter) at zoom level 0
        // ...
        // 64 pixel radius (128 pixel diameter) at zoom level 6
        // ...
        // We'd like an event to cover a range expressed as Km
        // According to https://groups.google.com/forum/#!topic/google-maps-js-api-v3/hDRO4oHVSeM
        // this means 1 pixel at level 7 so at level 0 we get 1 / 2^7
        radius: this.heatmapRadius * 0.0078,
        minOpacity: 0,
        maxOpacity: 0.5,
        // scales the radius based on map zoom
        scaleRadius: true,
        // uses the data maximum within the current map boundaries
        // (there will always be a red spot with useLocalExtremas true)
        useLocalExtrema: true,
        // The higher the blur factor is, the smoother the gradients will be
        blur: 0.8
      }
    },
    getService () {
      return this.$api.getService('archived-events')
    },
    loadLogsService () {
      return this.$api.getService('archived-event-logs')
    },
    getCollectionBaseQuery () {
      // No pagination in this case (map) and filter required data
      return Object.assign({
        geoJson: true,
        $skip: 0,
        $limit: MAX_EVENTS,
        $select: ['_id', 'name', 'description', 'icon', 'template', 'location',
          'createdAt', 'updatedAt', 'expireAt', 'deletedAt']
      }, this.baseQuery)
    },
    getCollectionFilterQuery () {
      const query = _.clone(this.filterQuery)
      Object.assign(query, _.clone(Time.getRangeQuery()))
      return query
    },
    getCollectionPaginationQuery () {
      // No pagination on map items
      return {}
    },
    async refreshEventsLayers () {
      await this.clearEventsLayers()
      this.templates = (this.byTemplate
        ? _.uniq(this.items.map(item => item.template))
        : [this.$t('ArchivedEventsActivity.EVENTS_LAYER_NAME')])
      // Filter events without a location
      const events = _.filter(this.items, item => _.get(item, 'geometry'))
      for (let i = 0; i < this.templates.length; i++) {
        const template = this.templates[i]
        if (this.heatmap) {
          // Create an empty layer used as a container for events
          await this.addLayer({
            name: template,
            label: template,
            scope: 'activity',
            type: 'OverlayLayer',
            icon: 'las la-fire',
            leaflet: Object.assign({
              type: 'heatmap',
              isVisible: true
            }, this.getHeatmapOptions())
          })
          // Then update it
          await this.updateHeatmap(template, {
            type: 'FeatureCollection',
            features: this.byTemplate ? _.filter(events, { template }) : events
          })
        } else {
          // Create an empty layer used as a container for events
          await this.addLayer({
            name: template,
            label: template,
            scope: 'activity',
            type: 'OverlayLayer',
            icon: 'las la-fire',
            isSelectable: false,
            leaflet: {
              type: 'geoJson',
              realtime: true,
              cluster: { spiderfyDistanceMultiplier: 5.0 },
              isVisible: true
            }
          })// Then update it
          await this.updateLayer(template, {
            type: 'FeatureCollection',
            features: this.byTemplate ? _.filter(events, { template }) : events
          })
        }
      }
      // Zoom on first layer
      if (this.templates.length > 0) this.zoomToLayer(this.templates[0])
    },
    async clearEventsLayers () {
      for (let i = 0; i < this.templates.length; i++) {
        const template = this.templates[i]
        await this.removeLayer(template)
      }
    },
    getEventMarker (feature, latlng, options) {
      if (!this.templates.includes(options.name)) return
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
      if (!this.templates.includes(options.name)) return
      const popup = L.popup({ autoPan: false }, layer)
      const description = _.get(feature, 'description')
      return popup.setContent(description)
    },
    getEventTooltip (feature, layer, options) {
      if (!this.templates.includes(options.name)) return
      const tooltip = L.tooltip({ permanent: false }, layer)
      const name = _.get(feature, 'name')
      const date = new Date(_.get(feature, 'createdAt'))
      return tooltip.setContent('<b>' + name + '</b> - ' + this.formatDate(date))
    },
    onCollectionRefreshed () {
      if (this.nbTotalItems > MAX_EVENTS) {
        this.$q.dialog({
          title: this.$t('ArchivedEventsActivity.MATCHING_RESULTS', { total: this.nbTotalItems }),
          message: this.$t('ArchivedEventsActivity.MAXIMUM_RESULTS', { max: MAX_EVENTS })
        })
      }
      this.refreshEventsLayers()
    },
    onByTemplate () {
      this.byTemplate = !this.byTemplate
      this.refreshEventsLayers()
    },
    onHeatmap () {
      this.heatmap = !this.heatmap
      this.refreshEventsLayers()
    },
    onShowHistory () {
      this.setTopPaneMode('history')
      this.setRightPaneMode('history')
      // Cleanup
      this.clearEventsLayers()
      this.templates = []
    },
    onShowMap () {
      this.setTopPaneMode('map')
      this.setRightPaneMode('map')
      // Refresh layer data
      this.refreshCollection()
    },
    onShowChart () {
      this.setTopPaneMode('chart')
      this.setRightPaneMode('chart')
      // Cleanup
      this.clearEventsLayers()
      this.templates = []
      // Refresh chart data
      this.refreshChart()
    },
    onHeatmapRadius (radius) {
      this.refreshEventsLayers()
    },
    onTimeRangeChanged () {
      // Refresh layer data
      if (this.showMap) this.refreshCollection()
      // Refresh chart data
      else if (this.showChart) this.refreshChart()
      // History automatically takes care of time range
    },
    onPageContentResized (size) {
      this.height = size.height - 48
    },
    showChartSettings () {
      this.$refs.chartSettingsModal.open()
    },
    async getChartData () {
      // Get possible values
      this.values = await this.getService().find({ query: { $distinct: 'template' } })
      // Due to a change in the data structure to enhance archiving some old events do not have a "template" field resulting in a null value
      this.values.forEach((value, index) => {
        if (!value) this.values[index] = this.$t('ArchivedEventsActivity.NULL_VALUE_LABEL')
      })
      // Then count events or participants for each value
      let data
      if (this.render.value === 'participants') {
        const response = await this.loadLogsService()
          .find({
            query: Object.assign({ $aggregate: 'template', lastInEvent: true },
              this.baseQuery, { createdAt: { $gte: Time.getRange().start.format(), $lte: Time.getRange().end.format() } })
          })
        data = response.map(item => ({ value: item._id, count: item.count }))
      } else {
        data = await Promise.all(this.values.map(async value => {
          const response = await this.getService()
            .find({ query: Object.assign({ $limit: 0, template: value }, this.baseQuery, this.filterQuery, Time.getRangeQuery()) })
          return { value, count: response.total }
        }))
      }
      const query = _.clone(this.filterQuery)
      Object.assign(query, _.clone(Time.getRangeQuery()))

      // No need to display zero values
      data = data.filter(item => item.count > 0)
      // Sort data so that we don't have charts mixing large and small numbers when paginating, go large first
      data = _.sortBy(data, item => -item.count)
      this.values = data.map(item => item.value)
      this.chartData = data.map(item => item.count)
    },
    getChartOptions (type) {
      const start = (this.currentChart - 1) * this.nbValuesPerChart.value
      const end = (this.nbValuesPerChart.value > 0 ? start + this.nbValuesPerChart.value : this.chartData.length)
      const colors = _.shuffle(chroma.scale('Spectral').colors(end - start))
      // const title = this.$t('ArchivedEventsActivity.CHART_TITLE') + ' - ' + this.$t(`ArchivedEventsActivity.CHART_LABEL_${type.toUpperCase()}`)
      let title = this.$t('ArchivedEventsActivity.CHART_TITLE')
      if (this.nbCharts > 1) title += ` (${this.currentChart}/${this.nbCharts})`
      const config = {
        type,
        data: {
          labels: this.values.slice(start, end),
          datasets: [{
            data: this.chartData.slice(start, end)
          }]
        },
        options: {
          responsive: true,
          title: {
            display: true,
            text: title
          }
        }
      }
      // ticks.precision = 0 means round displayed values to integers
      if (type === 'radar') {
        _.set(config, 'options.legend.display', false)
        _.set(config, 'data.datasets[0].fill', true)
        _.set(config, 'data.datasets[0].borderColor', colors[0])
        _.set(config, 'data.datasets[0].backgroundColor', chroma(colors[0]).alpha(0.5).hex())
        _.set(config, 'data.datasets[0].pointBorderColor', '#fff')
        _.set(config, 'data.datasets[0].pointBackgroundColor', colors[0])
        _.set(config, 'options.scale.ticks.beginAtZero', true)
        _.set(config, 'options.scale.ticks.precision', 0)
      } else {
        _.set(config, 'data.datasets[0].backgroundColor', colors)
        _.set(config, 'options.plugins.labels.render',
          this.render.value === 'percentage' ? 'percentage' : 'value')
        _.set(config, 'options.plugins.labels.position', 'border')
        _.set(config, 'options.plugins.labels.overlap', false)
        _.set(config, 'options.plugins.labels.showActualPercentages', true)
        _.set(config, 'options.plugins.labels.precision', 0)
        _.set(config, 'options.plugins.labels.textShadow', true)
        _.set(config, 'options.plugins.labels.fontSize', 24)
        _.set(config, 'options.plugins.labels.fontColor', (type === 'bar' ? '#000' : '#fff'))
      }
      if (type === 'bar') {
        _.set(config, 'options.legend.display', false)
        _.set(config, 'options.scales.xAxes[0].ticks.maxRotation', 90)
        _.set(config, 'options.scales.xAxes[0].ticks.minRotation', 70)
        _.set(config, 'options.scales.yAxes[0].ticks.beginAtZero', true)
        _.set(config, 'options.scales.yAxes[0].ticks.precision', 0)
        // _.set(config, 'options.plugins.labels.fontSize', 0)
      } else if (type === 'polarArea') {
        // FIXME: does not work in this case
        // _.set(config, 'options.scale.display', false)
      }

      return config
    },
    async refreshChart () {
      // Destroy previous graph if any
      if (this.chart) this.chart.destroy()
      // Retrieve data
      await this.getChartData()
      // We need to force a refresh so that the computed props are correctly updated by Vuejs
      await this.$nextTick()
      this.chart = new Chart(this.$refs.chart.getContext('2d'),
        this.getChartOptions(this.chartType.value))
    },
    async refreshChartAndPagination () {
      this.currentChart = 1
      await this.refreshChart()
    },
    onNextChart () {
      this.currentChart++
      this.refreshChart()
    },
    onPreviousChart () {
      this.currentChart--
      this.refreshChart()
    },
    downloadChartData () {
      const json = this.values.map((value, index) => ({
        [this.$t('ArchivedEventsActivity.CHART_VALUE_LABEL')]: value,
        [this.$t('ArchivedEventsActivity.CHART_COUNT_LABEL')]: this.chartData[index]
      }))
      const csv = Papa.unparse(json)
      kCoreUtils.downloadAsBlob(csv, this.$t('ArchivedEventsActivity.CHART_EXPORT_FILE'), 'text/csv;charset=utf-8;')
    },
    async downloadEventsData () {
      let data, mimeType
      if (this.showMap) {
        const geoJson = this.toGeoJson(this.$t('ArchivedEventsActivity.EVENTS_LAYER_NAME'))
        geoJson.features = geoJson.features.map(feature => {
          // Move required event information into properties
          const properties = _.omit(feature, ['type', 'geometry', 'icon', 'layer', 'properties',
            'participants', 'coordinators', 'workflow', 'hasWorkflow'])
          return Object.assign({ properties }, _.pick(feature, ['type', 'geometry']))
        })
        mimeType = 'application/json;charset=utf-8;'
        data = JSON.stringify(geoJson)
      } else {
        // Make full request to avoid pagination and filter required data
        const response = await this.getService().find({
          query: Object.assign({
            $skip: 0,
            $limit: MAX_EVENTS,
            $select: ['_id', 'name', 'description', 'template', 'location',
              'createdAt', 'updatedAt', 'expireAt', 'deletedAt']
          }, this.baseQuery)
        })
        // Check if overpass max limit
        if (response.total > MAX_EVENTS) {
          this.$q.dialog({
            title: this.$t('ArchivedEventsActivity.MATCHING_RESULTS', { total: response.total }),
            message: this.$t('ArchivedEventsActivity.MAXIMUM_RESULTS', { max: MAX_EVENTS })
          })
        }
        const json = response.data.map(item => {
          // No nested structure in CSV
          if (item.location) {
            item.longitude = item.location.longitude
            item.latitude = item.location.latitude
            item.address = item.location.name
            delete item.location
          }
          return item
        })
        mimeType = 'text/csv;charset=utf-8;'
        data = Papa.unparse(json)
      }

      kCoreUtils.downloadAsBlob(data, (this.showMap
        ? this.$t('ArchivedEventsActivity.MAP_EXPORT_FILE')
        : this.$t('ArchivedEventsActivity.EVENTS_EXPORT_FILE')), mimeType)
    },
    getChartSettingsModalButtons () {
      return [
        { id: 'close-button', label: 'CLOSE', renderer: 'form-button', handler: () => this.$refs.chartSettingsModal.close() }
      ]
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-history'] = this.$load('collection/KHistory')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')

    this.registerStyle('tooltip', this.getEventTooltip)
    this.registerStyle('popup', this.getEventPopup)
    this.registerStyle('markerStyle', this.getEventMarker)

    // Initialize private properties
    this.templates = []

    // Check if option has been subscribed
    this.$checkBillingOption('archiving')
  },
  mounted () {
    this.$on('collection-refreshed', this.onCollectionRefreshed)
    this.$events.$on('time-range-changed', this.onTimeRangeChanged)
  },
  beforeDestroy () {
    if (this.chart) this.chart.destroy()
    this.$off('collection-refreshed', this.onCollectionRefreshed)
    this.$events.$off('time-range-changed', this.onTimeRangeChanged)
  }
}
</script>

<style lang="stylus">
.chart {
  border: solid 1px lightgrey;
  border-radius: 8px;
  background: #ffffff
}
</style>
