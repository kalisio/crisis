<template>
  <div>
    <q-expansion-item ref="timePeriod" default-opened icon="las la-clock" :label="$t('AlertForm.TIME_PERIOD')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item>
          <q-item-section>
          {{$t('AlertForm.TIME_PERIOD_RANGE')}}
          </q-item-section>
          <q-item-section v-if="isMeasure" avatar>
            <q-select v-model="period.start" :options="measurePeriodOptions" emit-value map-options>
              <template v-slot:prepend><q-icon name="las la-minus" /></template>
            </q-select>
          </q-item-section>
          <q-item-section v-if="isWeather" avatar>
            <q-select v-model="period.end" :options="weatherPeriodOptions" emit-value map-options>
              <template v-slot:prepend><q-icon name="las la-plus" /></template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            {{$t('AlertForm.FREQUENCY')}}
          </q-item-section>
          <q-item-section avatar>
            <q-select v-model="frequency" :options="frequencyOptions" emit-value map-options>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="conditions" icon="lab la-cloudversify" :label="$t('AlertForm.CONDITIONS')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row items-center justify-around" v-for="(condition, index) in conditions" :key="variables[index].name">
          <q-item-section avatar>
            <q-toggle v-model="conditions[index].isActive"/>{{$t(variables[index].label)}}
          </q-item-section>
          <q-item-section avatar>
            <q-select v-model="conditions[index].operator" :disable="!conditions[index].isActive" :options="getOperators(variables[index])" emit-value map-options/>
          </q-item-section>
          <q-item-section>
            <q-slider v-if="!isRange(variables[index])" v-model="condition.threshold" :disable="!condition.isActive"
              :min="condition.min" :max="condition.max" :step="condition.step"
              label label-always :label-value="condition.threshold + ' ' + getUnit(variables[index])"/>
            <q-range v-if="isRange(variables[index])" v-model="condition.threshold" :disable="!condition.isActive"
              :min="condition.min" :max="condition.max" :step="condition.step"
              label label-always :left-label-value="condition.threshold.min + ' ' + getUnit(variables[index])"
              :right-label-value="condition.threshold.max + ' ' + getUnit(variables[index])"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="event" icon="las la-bell" :label="$t('AlertForm.EVENT')" group="group">
      <KItemField ref="eventTemplate" :properties="eventTemplateFieldProperties" />
      <KToggleField ref="closeEvent" :properties="closeEventFieldProperties" />
    </q-expansion-item>
    <q-list v-show="hasError" dense class="row items-center justify-around q-pa-md">
      <q-item>
        <q-item-section side>
          <q-icon name="las la-exclamation-circle" color="negative" />
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
import moment from 'moment'
import logger from 'loglevel'
import { mixins as kdkCoreMixins, utils as kdkCoreUtils } from '@kalisio/kdk/core.client'
import { QSlider, QRange } from 'quasar'

export default {
  components: {
    QSlider,
    QRange,
    KItemField: kdkCoreUtils.loadComponent('form/KItemField'),
    KToggleField: kdkCoreUtils.loadComponent('form/KToggleField')
  },
  mixins: [
    kdkCoreMixins.schemaProxy
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
    variables () {
      return (this.layer ? this.layer.variables : [])
    },
    weatherPeriodOptions () {
      return this.generatePeriodOptions([60, 3 * 60, 6 * 60, 12 * 60, 24 * 60, 48 * 60, 72 * 60, 96 * 60])
    },
    measurePeriodOptions () {
      return this.generatePeriodOptions([15, 30, 60, 3 * 60, 6 * 60, 12 * 60, 24 * 60, 48 * 60, 72 * 60, 96 * 60])
    },
    frequencyOptions () {
      return this.generateFrequencyOptions([15, 30, 60, 2 * 60, 3 * 60, 6 * 60, 12 * 60, 24 * 60])
    }
  },
  data () {
    return {
      period: {
        start: 0,
        end: 24 * 60
      },
      frequency: 6 * 60,
      conditions: [],
      hasError: false,
      error: '',
      eventTemplateFieldProperties: {
        name: 'event-template',
        services: [{
          service: 'event-templates',
          field: 'name',
          baseQuery: { $select: ['_id', 'name', 'icon', 'participants', 'coordinators'] },
          icon: { name: 'las la-fire' }
        }],
        field: {
          label: 'AlertForm.EVENT_TEMPLATE'
        }
      },
      closeEventFieldProperties: {
        name: 'close-event',
        default: true,
        field: {
          label: 'AlertForm.CLOSE_EVENT_WITH_ALERT'
        }
      }
    }
  },
  methods: {
    generateTimeOptions (values) {
      return values.map(value => ({
        label: value >= 60 ? `${value / 60}H` : `${value}m`, value
      }))
    },
    generatePeriodOptions (values) {
      // First extract bounds from layer/forecast model
      let from, to, every
      if (this.isWeather) {
        every = moment.duration(this.forecastModel.interval, 's')
        from = moment.duration(this.forecastModel.lowerLimit, 's')
        to = moment.duration(this.forecastModel.upperLimit, 's')
      } else {
        every = moment.duration(this.layer.every)
        from = moment.duration(this.layer.from)
        to = moment.duration(this.layer.to)
      }
      // Take care that we have forecast data in the future and observed data in the past
      if (from.asMinutes() < 0) [from, to] = [to, from]
      // Filter values outside bounds or lower than update frequency
      let options = this.generateTimeOptions(values)
      options = options.filter(option => (
        (option.value >= Math.abs(from.asMinutes())) &&
        (option.value <= Math.abs(to.asMinutes())) &&
        (option.value >= Math.abs(every.asMinutes())))
      )
      return options
    },
    generateFrequencyOptions (values) {
      // First extract update interval from layer/forecast model
      let every
      if (this.isWeather) {
        every = moment.duration(this.forecastModel.interval, 's')
      } else if (this.isMeasure) {
        every = moment.duration(this.layer.every)
      }
      // Filter values outside bounds or lower than update frequency
      let options = this.generateTimeOptions(values)
      if (!_.isNil(every)) options = options.filter(option => (option.value >= every.asMinutes()))
      return options
    },
    getOperators (variable) {
      return this.isRange(variable)
        ? [{
            label: this.$i18n.t('AlertForm.RANGE'),
            value: '$range'
          }]
        : [{
            label: this.$i18n.t('AlertForm.GREATER_THAN'),
            value: '$gte'
          }, {
            label: this.$i18n.t('AlertForm.LOWER_THAN'),
            value: '$lte'
          }]
    },
    isRange (variable) {
      const unitsWithRange = ['deg']
      return unitsWithRange.includes(this.getUnit(variable))
    },
    getUnit (variable) {
      return _.get(variable, 'unit', '')
    },
    hasActiveVariable () {
      return this.conditions.reduce((value, condition) => value || condition.isActive, false)
    },
    generateDefaultConditions (variable) {
      const min = _.get(variable, 'range[0]', 0)
      const max = _.get(variable, 'range[1]', 100)
      const step = _.get(variable, 'step', _.toNumber(((max - min) * 0.05).toFixed(1))) // 5%
      return {
        isActive: false,
        operator: this.isRange(variable) ? '$range' : '$gte',
        threshold: this.isRange(variable)
          ? {
              min: Math.ceil((max - min) * 0.25 / step) * step, // Quartiles rounded to nearest step
              max: Math.ceil((max - min) * 0.75 / step) * step
            }
          : Math.ceil((max - min) * 0.5 / step) * step, // Mean value rounded to nearest step
        min,
        max,
        step
      }
    },
    frequencyToCron (frequency) {
      if (frequency < 60) return `*/${frequency} * * * *`
      if (frequency === 60) return '0 * * * *'
      if (frequency < 24 * 60) return `0 */${frequency / 60} * * *`
      else return '0 0 * * *'
    },
    cronToFrequency (cron) {
      if (cron === '0 * * * *') return 60
      else if (cron === '0 0 * * *') return 24 * 60
      else {
        // Less than 1H
        if (cron.startsWith('/*')) return parseInt(cron.replace('*/', '').split(' ')[0]) * 60
        else return parseInt(cron.replace('*/', '').split(' ')[1]) * 60
      }
    },
    async build () {
      // Since some properties are injected in form we need to make sure Vue.js has processed props
      // This could be done externally but adding it here we ensure no one will forget it
      await this.$nextTick()
      // For weather we can only go in the future while for measure it's in the past
      this.period.start = (this.isWeather ? 0 : 60)
      this.period.end = (this.isWeather ? 24 * 60 : 0)
      // Initialize conditions object matching variables
      this.conditions = this.variables.map(variable => this.generateDefaultConditions(variable))
      this.eventTemplate = null
      this.hasError = false
    },
    async fill (values) {
      logger.debug('Filling alert form', values)
      // Future for forecast, past for measure
      this.period.start = this.isWeather
        ? _.get(values, 'period.start.minutes')
        : -_.get(values, 'period.start.minutes')
      this.period.end = _.get(values, 'period.end.minutes')
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
      const eventTemplate = this.$refs.eventTemplate.value()
      this.hasError = false
      if (!this.hasActiveVariable()) {
        this.hasError = true
        this.error = this.$t('AlertForm.CONDITIONS_REQUIRED')
        this.$refs.conditions.show()
      } else if (!eventTemplate) {
        this.hasError = true
        this.error = this.$t('AlertForm.EVENT_TEMPLATE_REQUIRED')
        this.$refs.event.show()
      } else if (!_.get(eventTemplate, 'participants[0]')) {
        this.hasError = true
        this.error = this.$t('AlertForm.EVENT_TEMPLATE_PARTICIPANT_REQUIRED')
        this.$refs.event.show()
      } else if (!_.get(eventTemplate, 'coordinators[0]')) {
        this.hasError = true
        this.error = this.$t('AlertForm.EVENT_TEMPLATE_COORDINATOR_REQUIRED')
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
      _.set(values, 'period.start.minutes', this.isWeather ? this.period.start : -this.period.start)
      _.set(values, 'period.end.minutes', this.period.end)
      _.set(values, 'cron', this.frequencyToCron(this.frequency))
      if (this.isWeather) {
        values.elements = []
        values.forecast = this.forecastModel.name
        // Check layers using meteo model source(s)
        if (_.has(this.layer, 'meteo_model')) {
          // Check source supports forecast model
          const defaultModel = _.get(this.layer.meteo_model, 'default.model') === values.forecast
          const otherModel = _.find(this.layer.meteo_model.sources, { model: values.forecast })
          if (defaultModel || otherModel) {
            values.elements = _.get(this.layer, 'meteoElements')
          }
        } else {
          // Weacast weather layers
          values.elements = _.get(this.layer, 'leaflet.elements')
        }
      }
      this.variables.forEach((variable, index) => {
        const conditions = this.conditions[index]
        // Check if there is an active condition on this variable
        if (conditions.isActive) {
          if (this.isRange(variable)) {
            _.set(values, `conditions.${variable.name}`, {
              $gte: conditions.threshold.min,
              $lte: conditions.threshold.max
            })
          } else {
            _.set(values, `conditions.${variable.name}`, {
              [conditions.operator]: conditions.threshold
            })
          }
        }
      })
      // No expiration date for now
      values.expireAt = undefined
      // Start from source feature by keeping relevant properties only
      Object.assign(values, _.pick(this.feature, ['geometry', 'properties']))
      // Keep track of source layer with relevant properties only
      _.set(values, 'layer', _.pick(this.layer, ['_id', 'name', 'i18n', 'service', 'featureId', 'featureLabel', 'variables']))
      // Add reference to feature service whenever required
      if (this.layer.service) {
        _.set(values, 'feature', this.layer.featureId
          ? _.get(this.feature, 'properties.' + this.layer.featureId)
          : this.feature._id)
      }
      // Setup style if any provided, except if templated as it would require
      // a complex mapping with the underlying feature
      if (_.has(this.layer, 'leaflet.icon-classes') &&
          !_.find(_.get(this.layer, 'leaflet.template', []), { property: 'icon-classes' })) {
        _.set(values, 'style.icon-classes', _.get(this.layer, 'leaflet.icon-classes'))
      } else {
        _.set(values, 'style.icon-classes', 'fas fa-bell')
      }
      _.set(values, 'eventTemplate', _.omit(this.$refs.eventTemplate.value(), ['participants', 'coordinators']))
      _.set(values, 'closeEvent', this.$refs.closeEvent.value())
      return values
    }
  },
  async created () {
    await this.build()
    this.$emit('form-ready', this)
  }
}
</script>
