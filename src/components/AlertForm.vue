<template>
  <div>
    <q-expansion-item ref="timePeriod" default-opened icon="fas fa-clock" :label="$t('AlertForm.TIME_PERIOD')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item>
          <q-item-section>
          {{$t('AlertForm.TIME_PERIOD_RANGE')}}
          </q-item-section>
          <q-item-section v-if="isMeasure" avatar>
            <q-select v-model="period.start" :options="generateTimeOptions([1, 3, 6, 12, 24, 48, 72, 96])" emit-value map-options>
              <template v-slot:prepend><q-icon name="fas fa-minus" /></template>
            </q-select>
          </q-item-section>
          <q-item-section v-if="isWeather" avatar>
            <q-select v-model="period.end" :options="generateTimeOptions([1, 3, 6, 12, 24, 48, 72, 96])" emit-value map-options>
              <template v-slot:prepend><q-icon name="fas fa-plus" /></template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            {{$t('AlertForm.FREQUENCY')}}
          </q-item-section>
          <q-item-section avatar>
            <q-select v-model="frequency" :options="generateTimeOptions([1, 2, 3, 6, 12, 24])" emit-value map-options>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="conditions" default-opened icon="fab fa-cloudversify" :label="$t('AlertForm.CONDITIONS')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row items-center justify-around" v-for="(variable, index) in variables" :key="variable.name">
          <q-item-section avatar>
            <q-toggle v-model="conditions[index].isActive"/>{{$t(variable.label)}}
          </q-item-section>
          <q-item-section avatar>
            <q-select v-model="conditions[index].operator" :disable="!conditions[index].isActive" :options="operators" emit-value map-options/>
          </q-item-section>
          <q-item-section>
            <q-slider v-model="conditions[index].threshold" :disable="!conditions[index].isActive"
              :min="conditions[index].min" :max="conditions[index].max" :step="conditions[index].step"
              label label-always :label-value="conditions[index].threshold + ' ' + getUnits(variable)"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="event" default-opened icon="fas fa-bell" :label="$t('AlertForm.EVENT')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-6">
          {{$t('AlertForm.EVENT_TEMPLATE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <k-item-chooser :multiselect="false" :default-items="[]" :services="[eventTemplatesService]" @changed="onEventTemplateSelected" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-list v-show="hasError" dense class="row items-center justify-around q-pa-md">
      <q-item>
        <q-item-section side>
          <q-icon name="warning" color="negative" />
        </q-item-section>
        <q-item-section class="text-negative">
        {{error}}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { mixins as kCoreMixins } from '@kalisio/kdk-core/client'
import { QSlider } from 'quasar'

export default {
  name: 'k-alert-form',
  components: {
    QSlider
  },
  mixins: [
    kCoreMixins.schemaProxy,
    kCoreMixins.refsResolver()
  ],
  props: {
    layer: { type: Object, default: () => null },
    feature: { type: Object, default: () => null },
    forecastModel: { type: Object, default: () => null }
  },
  computed: {
    isWeather () {
      return this.layer && !this.layer.service
    },
    isMeasure () {
      return this.layer && this.layer.service
    },
    variables () { return (this.layer ? this.layer.variables : []) }
  },
  data () {
    return {
      period: {
        start: 0,
        end: 24
      },
      frequency: 6,
      operators: [{
        label: this.$i18n.t('AlertForm.GREATER_THAN'),
        value: '$gte'
      }, {
        label: this.$i18n.t('AlertForm.LOWER_THAN'),
        value: '$lte'
      }],
      conditions: [],
      eventTemplatesService: {
        service: 'event-templates',
        field: 'name',
        baseQuery: { $select: ['_id', 'name', 'icon'] },
        icon: { name: 'whatshot' }
      },
      hasError: false,
      error: ''
    }
  },
  methods: {
    generateTimeOptions (values) {
      return values.map(value => ({ label: `${value}H`, value }))
    },
    getUnits (variable) {
      return _.get(variable, 'units[0]', '')
    },
    hasActiveVariable () {
      return this.conditions.reduce((value, condition) => value || condition.isActive, false)
    },
    generateDefaultConditions (variable) {
      const min = _.get(variable, 'range[0]', 0)
      const max = _.get(variable, 'range[1]', 100)
      return {
        isActive: false,
        operator: '$gte',
        threshold: (max - min) * 0.5, // Mean value
        min,
        max,
        step: ((max - min) * 0.05).toFixed(1) // 5%
      }
    },
    frequencyToCron (frequency) {
      if (frequency === 0) return '0 * * * *'
      if (frequency === 24) return '0 0 * * *'
      else return `0 */${frequency} * * *`
    },
    cronToFrequency (cron) {
      if (cron === '0 * * * *') return 0
      else if (cron === '0 0 * * *') return 24
      else return parseInt(cron.split(' ')[1])
    },
    async build () {
      // Since some properties are injected in form we need to make sure Vue.js has processed props
      // This could be done externally but adding it here we ensure no one will forget it
      await this.$nextTick()
      // For weather we can only go in the future while for measure it's in the past
      this.period.start = (this.isWeather ? 0 : 1)
      this.period.end = (this.isWeather ? 24 : 0)
      // Initialize conditions object matching variables
      this.conditions = this.variables.map(variable => this.generateDefaultConditions(variable))
      this.eventTemplate = null
      this.hasError = false
    },
    async fill (values) {
      logger.debug('Filling alert form', values)
      // Future for forecast, past for measure
      this.period.start = this.isWeather ? _.get(values, 'period.start.hours') : -_.get(values, 'period.start.hours')
      this.period.end = _.get(values, 'period.end.hours')
      this.frequency = this.cronToFrequency(values.cron)
      this.conditions = new Array(this.variables.length)
      const variablesWithConditions = _.keys(values.conditions)
      this.variables.forEach((variable, index) => {
        const conditions = this.generateDefaultConditions(variable)
        // Check if there is an active condition on this variable
        if (variablesWithConditions.includes(variable.name)) {
          Object.assign(conditions, {
            isActive: true,
            operator: _.keys(values.conditions[variable.name])[0],
            threshold: _.values(values.conditions[variable.name])[0]
          })
        }
        this.conditions[index] = conditions
      })
    },
    validate () {
      logger.debug('Validating alert form')
      this.hasError = false
      if (!this.hasActiveVariable()) {
        this.hasError = true
        this.error = this.$t('AlertForm.CONDITIONS_REQUIRED')
        this.$refs.conditions.show()
      } else if (!this.eventTemplate) {
        this.hasError = true
        this.error = this.$t('AlertForm.EVENT_TEMPLATE_REQUIRED')
        this.$refs.event.show()
      }
      return {
        isValid: !this.hasError,
        values: this.values()
      }
    },
    values () {
      const values = { type: 'Feature' } // We store alerts as GeoJson features
      // Future for forecast, past for measure
      _.set(values, 'period.start.hours', this.isWeather ? this.period.start : -this.period.start)
      _.set(values, 'period.end.hours', this.period.end)
      _.set(values, 'cron', this.frequencyToCron(this.frequency))
      if (this.isWeather) {
        values.forecast = this.forecastModel.name
        values.elements = _.get(this.layer, 'leaflet.elements')
      }
      this.variables.forEach((variable, index) => {
        const conditions = this.conditions[index]
        // Check if there is an active condition on this variable
        if (conditions.isActive) {
          _.set(values, `conditions.${variable.name}`, {
            [conditions.operator]: conditions.threshold
          })
        }
      })
      // No expiration date for now
      values.expireAt = undefined
      _.set(values, 'geometry', this.feature.geometry)
      // Add reference to feature service whenever required
      if (this.layer.service) {
        _.set(values, 'service', this.layer.service)
        if (this.layer.featureId) _.set(values, 'featureId', this.layer.featureId)
        _.set(values, 'feature', this.layer.featureId ?
          _.get(this.feature, 'properties.' + this.layer.featureId) : this.feature._id)
      }
      // Setup style if any provided
      if (_.has(this.layer, 'leaflet.icon-classes')) {
        _.set(values, 'style.icon-classes', _.get(this.layer, 'leaflet.icon-classes'))
      }
      _.set(values, 'eventTemplate', this.eventTemplate[0])
      return values
    },
    onEventTemplateSelected (template) {
      this.eventTemplate = template
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-item-chooser'] = this.$load('input/KItemChooser')

    await this.build()
    this.$emit('form-ready', this)
  }
}
</script>
