<template>
  <KModal
    :title="$t('CatalogActivity.CREATE_ALERT_TITLE')"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <AlertForm
      :ref="onFormReferenceCreated"
      :class="{ 'light-dimmed': applyInProgress }"
      :layer="layer"
      :feature="feature"
      :forecastModel="forecastModel"
      @form-ready="onFormReady"
    />
  </KModal>
</template>

<script>
import logger from 'loglevel'
import { mixins as kdkCoreMixins } from '@kalisio/kdk/core.client'
import AlertForm from './AlertForm.vue'

export default {
  components: {
    AlertForm
  },
  mixins: [
    kdkCoreMixins.baseModal
  ],
  props: {
    layer: {
      type: Object,
      default: () => null
    },
    feature: {
      type: Object,
      default: () => null
    },
    forecastModel: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    buttons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: 'DONE', renderer: 'form-button', handler: () => this.apply() }
      ]
    }
  },
  data () {
    return {
      applyInProgress: false
    }
  },
  methods: {
    onFormReferenceCreated (reference) {
      if (reference) {
        this.form = reference
      }
    },
    async apply () {
      const result = this.form.validate()
      if (!result.isValid) return
      this.applyInProgress = true
      try {
        // Add notification prefix to be used at creation,
        // Indeed, as alerting is a background process it will not be able to easily guess the user locale
        const alert = Object.assign(result.values, {
          notification: {
            create: this.$t('EventNotifications.CREATE'),
            remove: this.$t('EventNotifications.REMOVE')
          }
        })
        await this.$api.getService('alerts').create(alert)
      } catch (error) {
        logger.error(error)
      }
      this.applyInProgress = false
      this.closeModal()
    }
  }
}
</script>
