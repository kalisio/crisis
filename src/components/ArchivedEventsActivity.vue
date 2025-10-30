<template>
  <KPage :padding="!showMap" @content-resized="onPageContentResized">
    <q-page-sticky v-show="showMap && heatmap" position="bottom" :offset="[0, 16]" style="z-index: 1">
      <div class="row">
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
      <KHistory
        style="padding-top: 80px;"
        id="history"
        service="archived-events"
        :base-query="baseQuery"
        :filter-query="filterQuery"
        :renderer="renderer"
        date-field="createdAt"
        :contextId="contextId"
        :list-strategy="'smart'"
        :width="width"
        :height="height - 124"
      >
        <template v-slot:empty-history>
          <div class="absolute-center">
            <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KHistory.EMPTY_HISTORY')" />
          </div>
        </template>
      </KHistory>
    </div>
    <!--
      Events map
    -->
    <div v-show="showMap">
      <div :ref="configureMap" :style="viewStyle">
        <q-resize-observer @resize="onMapResized" />
      </div>
    </div>
    <!--
      Events graph
    -->
    <div v-show="showChart" class="fit row items-center text-center q-ma-none q-pa-none" >
      <KStatisticsChart ref="chart" :style="chartStyle" class="col"/>
      <q-btn v-show="currentChart > 1" size="1rem" flat round color="primary"
        icon="las la-chevron-left" class="absolute-left" @click="onPreviousChart"/>
      <q-btn v-show="currentChart < nbCharts" size="1rem" flat round color="primary"
        icon="las la-chevron-right" class="absolute-right" @click="onNextChart" />
    </div>
    <KModal
      id="chart-settings-modal"
      :title="$t('ArchivedEventsActivity.CHART_SETTINGS_MODAL_TITLE')"
      :buttons="getChartSettingsModalButtons()"
      ref="chartSettingsModal"
    >
      <div>
        <q-select id="chart-type" v-model="selectedChartType" :label="$t('ArchivedEventsActivity.CHART_LABEL')"
        :options="availableChartTypes" @update:modelValue="refreshChart"/>
        <q-select id="count-per-chart" v-model="nbValuesPerChart" :label="$t('ArchivedEventsActivity.PAGINATION_LABEL')"
          :options="paginationOptions" @update:modelValue="refreshChartAndPagination"/>
        <q-select id="chart-render" v-model="render" :label="$t('ArchivedEventsActivity.RENDER_LABEL')"
          :options="renderOptions" @update:modelValue="refreshChart"/>
      </div>
    </KModal>
    <!--
      Router view to enable routing to modals
    -->
    <router-view service="archived-events"></router-view>
  </KPage>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import L from 'leaflet'
import Papa from 'papaparse'
import chroma from 'chroma-js'
import { colors, QSlider } from 'quasar'
import { mixins as kdkCoreMixins, utils as kdkCoreUtils, Time, Exporter } from '@kalisio/kdk/core.client'
import { mixins as kdkMapMixins } from '@kalisio/kdk/map.client.map'
import { usePlan } from '../composables'

const activityMixin = kdkCoreMixins.baseActivity('archivedEventsActivity')

// For mapping or statistics we get all events at once to avoid managing pagination
const MAX_EVENTS = 5000

export default {
  mixins: [
    activityMixin,
    kdkMapMixins.activity,
    kdkMapMixins.style,
    kdkMapMixins.context,
    kdkMapMixins.map.baseMap,
    kdkMapMixins.map.geojsonLayers,
    kdkMapMixins.map.heatmapLayers,
    kdkMapMixins.map.style,
    kdkMapMixins.map.tooltip,
    kdkMapMixins.map.popup,
    kdkMapMixins.map.activity
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
    showMap () {
      return this.getTopPaneMode() === 'map'
    },
    showChart () {
      return this.getTopPaneMode() === 'chart'
    },
    showHistory () {
      return this.getTopPaneMode() === 'history'
    },
    chartStyle () {
      const min = Math.min(this.$q.screen.width, this.$q.screen.height)
      return `width: ${min * 0.75}px;`
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
      Object.assign(query, this.planQuery)
      const stateFilters = _.intersection(['open', 'closed'], this.filters)
      // Filtering open + closed or none of them is equivalent to no filter
      if (stateFilters.length === 1) {
        Object.assign(query, { deletedAt: { $exists: stateFilters.includes('closed') } })
      }
      return query
    },
    filterQuery () {
      const query = _.clone(this.filter.query)
      Object.assign(query, this.planObjectiveQuery)
      return query
    }
  },
  data () {
    const availableChartTypes = ['pie', 'polarArea', 'radar', 'bar'].map(
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
      filters: [],
      heatmap: false,
      byTemplate: false,
      heatmapRadius: 1,
      // TODO
      sortBy: {
        label: this.$i18n.t('ArchivedEventsActivity.SORT_BY_CREATED_DATE_LABEL'),
        value: 'createdAt'
      },
      availableChartTypes,
      selectedChartType: _.find(availableChartTypes, { value: 'pie' }),
      chartType: null,
      chartLabels: [],
      chartDatasets: [],
      chartOptions: {},
      chartData: [],
      currentChart: 1,
      nbValuesPerChart: _.find(paginationOptions, { value: 10 }),
      paginationOptions,
      renderOptions,
      render: _.find(renderOptions, { value: 'count' }),
      height: undefined
    }
  },
  methods: {
    async configureMap (container) {
      // Avoid reentrance during awaited operations
      if (!container || this.mapContainer) return
      this.mapContainer = container
      // Wait until map is ready
      await this.initializeMap(container)
    },
    async getCatalogLayers () {
      const layers = await kdkMapMixins.activity.methods.getCatalogLayers.call(this)
      // We only want base layers
      return _.filter(layers, { type: 'BaseLayer' })
    },
    formatDate (date) {
      return date.toLocaleString(kdkCoreUtils.getLocale(),
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
    getEventMarker (feature, options) {
      if (!this.templates.includes(options.name)) return
      return {
        shape: 'circle',
        color: kdkCoreUtils.getHtmlColor(_.get(feature, 'icon.color'), 'blue'),
        icon: {
          classes: kdkCoreUtils.getIconName(feature) || 'las la-marker-map',
          color: 'white'
        }
      }
    },
    getEventStyle (event, options) {
      if (!this.templates.includes(options.name)) return
      const color = kdkCoreUtils.getHtmlColor(_.get(event, 'icon.color'), 'blue')
      return {
        color: chroma(color).alpha(0.5).hex(), // Transparency
        stroke: {
          color
        }
      }
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
      this.setRightPaneMode('user-layers')
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
      this.width = size.width
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
    getChartOptions () {
      const start = (this.currentChart - 1) * this.nbValuesPerChart.value
      const end = (this.nbValuesPerChart.value > 0 ? start + this.nbValuesPerChart.value : this.chartData.length)
      let title = this.$t('ArchivedEventsActivity.CHART_TITLE')
      if (this.nbCharts > 1) title += ` (${this.currentChart}/${this.nbCharts})`

      this.chartLabels = this.values.slice(start, end)
      this.chartDatasets = [{
        data: this.chartData.slice(start, end),
        colorScale: 'Accent'
      }]
      this.chartOptions = {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title
          }
        }
      }
      // ticks.precision = 0 means round displayed values to integers
      if (this.chartType === 'radar') {
        const color = colors.getBrand('primary')
        const backgroundColor = colors.getBrand('accent')
        _.set(this.chartDatasets[0], 'fill', true)
        _.set(this.chartDatasets[0], 'borderColor', color)
        _.set(this.chartDatasets[0], 'backgroundColor', backgroundColor)
        _.set(this.chartDatasets[0], 'pointBorderColor', '#fff')
        _.set(this.chartDatasets[0], 'pointBackgroundColor', color)
        _.set(this.chartOptions, 'plugins.legend.display', false)
        _.set(this.chartOptions, 'scales[0].ticks.beginAtZero', true)
        _.set(this.chartOptions, 'scales[0].ticks.precision', 0)
      }
      if (this.chartType === 'bar') {
        _.set(this.chartOptions, 'plugins.legend.display', false)
        _.set(this.chartOptions, 'scales.x.ticks.maxRotation', 90)
        _.set(this.chartOptions, 'scales.x.ticks.minRotation', 70)
        _.set(this.chartOptions, 'scales.y.ticks.beginAtZero', true)
        _.set(this.chartOptions, 'scales.y.ticks.precision', 0)
      } else if (this.chartType === 'polarArea') {

        // FIXME: does not work
        // _.set(this.chartOptions, '.scale.display', false)
      }
    },
    async refreshChart () {
      this.chartType = this.selectedChartType.value
      // Retrieve data
      await this.getChartData()
      // Update chart options
      this.getChartOptions()
      // Update the chart
      this.$refs.chart.update({
        type: this.chartType,
        data: {
          labels: this.chartLabels,
          datasets: this.chartDatasets
        },
        options: this.chartOptions
      })
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
      kdkCoreUtils.downloadAsBlob(csv, this.$t('ArchivedEventsActivity.CHART_EXPORT_FILE'), 'text/csv;charset=utf-8;')
    },
    exportEvents () {
      Exporter.export({
        service: 'archived-events',
        context: this.contextId,
        query: Object.assign({}, this.baseQuery, this.getCollectionFilterQuery()),
        formats: [this.showMap ? { value: 'geojson', LABEL: 'GeoJSON' } : { value: 'csv', LABEL: 'CSV' }],
        transform: {
          csv: {
            mapping: {
              'location.geometry.coordinates[0]': 'longgitude',
              'location.geometry.coordinates[1]': 'latitude',
              'location.properties.name': 'address'
            },
            omit: ['icon', 'participants', 'coordinators', 'hasWorkflow',
              'workflow', '_include', 'location', 'deletedAt']
          },
          geojson: {
            mapping: {
              'location.type': 'type',
              'location.geometry': 'geometry',
              'location.properties': 'properties',
              name: 'properties.name',
              description: 'properties.description',
              template: 'properties.template',
              createdAt: 'properties.createdAt',
              updatedAt: 'properties.updatedAt',
              expireAt: 'properties.expireAt'
            },
            omit: ['name', 'icon', 'description', 'participants', 'coordinators', 'template', 'plan',
              'hasWorkflow', 'workflow', 'location', '_include',
              'createdAt', 'updatedAt', 'expireAt', 'deletedAt']
          }
        }
      })
    },
    /* async downloadEventsData () {
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
          const location = getLocationAsFeature(item)
          if (location) {
            item.longitude = _.get(location, 'geometry.coordinates[0]')
            item.latitude = _.get(location, 'geometry.coordinates[1]')
            item.address = _.get(location, 'location.properties.name')
            delete item.location
          }
          return item
        })
        mimeType = 'text/csv;charset=utf-8;'
        data = Papa.unparse(json)
      }

      kdkCoreUtils.downloadAsBlob(data, (this.showMap
        ? this.$t('ArchivedEventsActivity.MAP_EXPORT_FILE')
        : this.$t('ArchivedEventsActivity.EVENTS_EXPORT_FILE')), mimeType)
    }, */
    getChartSettingsModalButtons () {
      return [
        { id: 'close-button', label: 'CLOSE', renderer: 'form-button', handler: () => this.$refs.chartSettingsModal.close() }
      ]
    }
  },
  async created () {
    // Resgister map styles
    this.registerStyle('tooltip', this.getEventTooltip)
    this.registerStyle('popup', this.getEventPopup)
    this.registerStyle('point', this.getEventMarker)
    this.registerStyle('polygon', this.getEventStyle)
    // Initialize private properties
    this.templates = []
    // Setup current time to now
    this.currentTime = Time.getCurrentTime()
    Time.setCurrentTime(moment.now())
  },
  mounted () {
    // Check if we can create archived events
    this.$checkQuota('archived-events', 1)
    // Setup listeners
    this.$events.on('time-range-changed', this.onTimeRangeChanged)
  },
  beforeUnmount () {
    // Release the chart if nay
    if (this.chart) this.chart.destroy()
    // Restore the current time
    Time.setCurrentTime(this.currentTime)
    // Releases listeners
    this.$events.off('time-range-changed', this.onTimeRangeChanged)
  },
  setup (props) {
    return {
      ...usePlan({ contextId: props.contextId })
    }
  }
}
</script>

<style lang="scss">
  .chart {
    border: solid 1px lightgrey;
    border-radius: 8px;
    background: #ffffff
  }
</style>
