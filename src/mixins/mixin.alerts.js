import _ from 'lodash'
import i18next from 'i18next'
import { utils as kCoreUtils } from '@kalisio/kdk/core.client'

const alertsMixin = {
  methods: {
    formatAlertDateTime (date) {
      return date.toLocaleString(kCoreUtils.getLocale(),
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    getAlertDetailsAsHtml (alert) {
      const isActive = _.get(alert, 'status.active')
      const hasError = _.get(alert, 'status.error')
      const checkedAt = new Date(_.get(alert, 'status.checkedAt'))
      let triggeredAt = new Date(_.get(alert, 'status.triggeredAt'))
      let html = ''
      _.forOwn(alert.conditions, (value, key) => {
        // Get corresponding variable
        const variable = _.find(_.get(alert, 'layer.variables'), { name: key })
        const label = this.$t(variable.label) || variable.label
        const unit = variable.units[0]
        if (_.has(value, '$gte')) html += isActive ?
          `${label} ` + this.$t('CatalogActivity.ALERT_GTE') + ` ${value.$gte} ${unit}</br>` :
          `${label} ` + this.$t('CatalogActivity.ALERT_LTE') + ` ${value.$gte} ${unit}</br>`
        if (_.has(value, '$lte')) html += isActive ?
          `${label} ` + this.$t('CatalogActivity.ALERT_LTE') + ` ${value.$lte} ${unit}</br>` :
          `${label} ` + this.$t('CatalogActivity.ALERT_GTE') + ` ${value.$lte} ${unit}</br>`
      })
      html += this.$t('CatalogActivity.ALERT_CHECKED_AT') + ` ${this.formatAlertDateTime(checkedAt)}</br>`
      if (isActive) {
        html += this.$t('CatalogActivity.ALERT_TRIGGERED_AT') + ` ${this.formatAlertDateTime(triggeredAt)}</br>`
        // Order triggers by time to get last one, take care to unify weather/measure triggers
        let triggers = _.sortBy(_.get(alert, 'status.triggers',
          [trigger => new moment.utc(trigger.time || trigger.forecastTime).valueOf()]))
        triggers = _.last(triggers)
        triggeredAt = new Date(triggers.time || triggers.forecastTime)
        html += this.$t('CatalogActivity.ALERT_THRESHOLD_AT') + ` ${this.formatAlertDateTime(triggeredAt)}`
      }
      if (hasError) html += '</br><i class="la la-exclamation la-lg"></i><b>' +
        this.$t('errors.' + _.get(alert, 'status.error.data.translation.key')) + '</b></br>'
      return html
    },
    getAlertStatusAsHtml (alert) {
      const isActive = _.get(alert, 'status.active')
      const hasError = _.get(alert, 'status.error')
      let html = ''
      if (isActive) html += '<b>' + this.$t('CatalogActivity.ALERT_ACTIVE') + '</b></br>'
      else html += '<b>' + this.$t('CatalogActivity.ALERT_INACTIVE') + '</b></br>'
        // Layer name can be a translation key
      html += (this.$t(`${alert.layer.name}`) ? this.$t(`${alert.layer.name}`) : `${alert.layer.name}`)
      if (_.has(alert, 'feature')) {
        // Try with default feature labels
        let featureLabel = _.get(alert, 'properties.name', _.get(alert, 'properties.NAME'))
        // Override if provided by layer
        if (_.has(alert, 'layer.featureLabel')) featureLabel = _.get(alert, 'properties.' + _.get(alert, 'layer.featureLabel'))
        if (featureLabel) html += ` - ${featureLabel}`
      }
      if (hasError) html += '</br><i class="la la-exclamation la-lg"></i><b>' +
        this.$t('errors.' + _.get(alert, 'status.error.data.translation.key')) + '</b></br>'
      return html
    },
    getAlertLocationName (alert) {
      let name = _.get(alert, 'layer.name', '')
      if (_.has(alert, 'feature')) {
        // Try with default feature labels
        name = _.get(alert, 'properties.name', _.get(alert, 'properties.NAME'))
        // Override if provided by layer
        if (_.has(alert, 'layer.featureLabel')) name = _.get(alert, 'properties.' + _.get(alert, 'layer.featureLabel'))
      }
      // Can be a translation key
      return (this.$t(name) ? this.$t(name) : name)
    },
    loadAlertLayer (alert) {
      if (!_.has(alert, 'layer._id')) return null
      let i18n = _.get(alert, 'layer.i18n')
      // Process i18n
      if (i18n) {
        const locale = kCoreUtils.getAppLocale()
        i18n = _.get(i18n, locale)
        if (i18n) i18next.addResourceBundle(locale, 'kdk', i18n, true, true)
      }
    }
  }
}

export default alertsMixin
