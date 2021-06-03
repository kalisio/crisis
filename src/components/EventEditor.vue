<template>
  <k-modal
    :title="editorTitle" 
    :buttons="buttons" 
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content" class="column xs-gutter">
      <k-form :class="{ 'light-dimmed': applyInProgress }" ref="eventForm"
        :contextId="contextId" :objectId="objectId" :schema="schema" @field-changed="onFieldChanged" />
      <q-spinner-cube color="primary" class="fixed-center" v-if="applyInProgress" size="4em"/>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import { utils } from '@kalisio/kdk/map.client.map'
import mixins from '../mixins'

const editorMixin = kCoreMixins.baseEditor(['eventForm'])

export default {
  name: 'event-editor',
  mixins: [
    kCoreMixins.baseModal,
    kCoreMixins.service,
    kCoreMixins.objectProxy,
    kCoreMixins.schemaProxy,
    editorMixin,
    kCoreMixins.refsResolver(['eventForm']),
    mixins.plans
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
    },
    longitude: {
      type: Number,
      default: undefined
    },
    latitude: {
      type: Number,
      default: undefined
    }
  },
  computed: {
    buttons () {
      return [
        { 
          id: 'apply-button', 
          label: this.applyButton, 
          renderer: 'form-button', 
          handler: () => this.apply() 
        }
      ]
    }
  },
  watch: {
    plan: {
      handler () {
        this.refresh()
      }
    }
  },
  methods: {
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
        // Setup the plan if defined
        if (!_.isEmpty(this.planId)) {
          this.object.plan = this.planId
        }
        // Setup hasWorkflow tag
        this.object.hasWorkflow = !_.isNil(this.template.workflow)
        if (!_.isNil(this.longitude) && !_.isNil(this.latitude)) {
          this.object.location = { longitude: this.longitude, latitude: this.latitude }
        }
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
        return kCoreMixins.objectProxy.methods.loadObject.call(this)
      }
    },
    async loadSchema () {
      // Call super
      // Start from schema and clone it because it will be shared by all editors
      let schema = _.cloneDeep(await kCoreMixins.schemaProxy.methods.loadSchema.call(this, this.getSchemaName()))
      // When a plan is provide add objective edition and remove expiration date
      if (!_.isEmpty(this.plan)) {
        _.set(schema, 'properties.objective.field.options',
          _.get(this.plan, 'objectives', []).map(objective => ({ label: objective, value: objective }))
        )
        _.unset(schema, 'properties.expireAt')
        _.pull(schema.required, 'expireAt')
      } else {
        _.unset(schema, 'properties.objective')
      }
      // When a template is provided check for workflow availability
      if (this.template) {
        // Remove workflow from schema if not present in template
        if (_.isNil(this.template.workflow)) {
          _.unset(schema, 'properties.hasWorkflow')
          _.pull(schema.required, 'hasWorkflow')
        }
      }
      this.schema = schema
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
    // Build the editor
    this.refresh()
    this.$on('applied', this.closeModal)
  },
  beforeDestroy () {
    this.$off('applied', this.closeModal)
  }
}
</script>
