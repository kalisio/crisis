<template>
  <k-modal ref="modal" :title="editorTitle" :toolbar="toolbar()" :buttons="buttons" :route="true">
    <div slot="modal-content" class="column xs-gutter">
      <k-form :class="{ 'light-dimmed': applyInProgress }" ref="eventForm" :contextId="contextId" :objectId="objectId" :schema="schema" @field-changed="onFieldChanged" />
      <q-spinner-cube color="primary" class="fixed-center" v-if="applyInProgress" size="4em"/>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins } from '@kalisio/kdk/core.client'
import { utils } from '@kalisio/kdk/map.client.map'

const editorMixin = mixins.baseEditor(['eventForm'])

export default {
  name: 'event-editor',
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    editorMixin,
    mixins.refsResolver(['eventForm'])
  ],
  props: {
    templateId: {
      type: String,
      default: ''
    },
    layerId: {
      type: String,
      default: ''
    },
    featureId: {
      type: String,
      default: ''
    }
  },
  computed: {
    buttons () {
      return [
        { name: 'apply-button', label: this.applyButton, color: 'primary', handler: () => this.apply() }
      ]
    }
  },
  methods: {
    toolbar () {
      return [
        { name: 'close-action', label: this.$t('EventEditor.CLOSE_ACTION'), icon: 'close', handler: () => this.doClose() }
      ]
    },
    async loadObject () {
      // When a template is provided use it as reference for object
      if (this.template) {
        this.object = Object.assign({}, this.template)
        // Keep track of template based on its name for statistics
        // We don't keep ref/link for simplicity and making archived events will be self-consistent
        // No need to keep track of templates that have been removed, etc.
        this.object.template = this.template.name
        // Remove id so that event has its own
        delete this.object._id
        // Setup hasWorkflow tag
        this.object.hasWorkflow = !_.isNil(this.template.workflow)
        if (this.layerId) {
          const layer = await this.$api.getService('catalog').get(this.layerId)
          this.object.layer = this.layerId
          // Perform reverse geocoding if we target a feature
          if (this.featureId) {
            const feature = await this.$api.getService('features').get(this.featureId)
            this.object.feature = this.featureId
            let description = _.get(feature, 'name', _.get(feature, 'NAME'))
            if (!description && layer.featureId) description = _.get(feature, `properties.${layer.featureId}`)
            if (description) this.object.description = description
            const results = await this.$api.getService('geocoder').create(feature)
            if (results.length > 0) {
              const element = results[0]
              this.object.location = Object.assign(element, { name: utils.formatGeocodingResult(element) })
            }
          } else {
            // TODO: manage a set of features
          }
        }
      } else {
        // Otherwise proceed as usual to load the event object
        return mixins.objectProxy.methods.loadObject.call(this)
      }
    },
    getSchemaName () {
      // When used with a service by default use the same name for schema as for service
      let schemaName = this.service + (this.objectId ? '.update' : '.create')
      if (this.perspective) {
        schemaName += ('-' + this.perspective)
      }
      return schemaName
    },
    async loadSchema () {
      // Call super
      let schema = await mixins.schemaProxy.methods.loadSchema.call(this, this.getSchemaName())
      // When a template is provided check for workflow availability
      if (this.template) {
      // Start from schema template and clone it because it will be shared by all editors
        this.schema = _.cloneDeep(schema)
        // Remove workflow from schema if not present in template
        if (_.isNil(this.template.workflow)) {
          delete this.schema.properties.hasWorkflow
          _.pull(this.schema.required, 'hasWorkflow')
        }
      }
      return this.schema
    },
    getBaseQuery (object) {
      // Overriden to handle notification messages
      const query = editorMixin.methods.getBaseQuery.call(this)
      const notification = _.get(object, 'notification', true)
      if (notification) {
        if (this.getMode() === 'create') {
          query.notification = this.$t('EventNotifications.CREATE')
        } else if (this.getMode() === 'update') {
          query.notification = this.$t('EventNotifications.UPDATE')
        }
      }
      _.unset(object, 'notification')
      return query
    },
    onFieldChanged (field, value) {
      // Setup workflow depending on field state
      if (field === 'hasWorkflow') {
        if (value) {
          this.object.workflow = this.template.workflow
        } else {
          delete this.object.workflow
        }
      }
    },
    doClose () {
      this.$refs.modal.close()
      this.$router.push({ name: 'events-activity' })
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
    // On creation wait for template/feature first
    if (this.templateId) {
      this.template = await this.$api.getService('event-templates').get(this.templateId)
    }
    this.refresh()
    this.$on('applied', this.doClose)
  },
  beforeDestroy () {
    this.$off('applied', this.doClose)
  }
}
</script>
