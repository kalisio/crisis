<template>
  <KModal
    :title="editorTitle"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <div class="column xs-gutter">
      <KForm
        :ref="onFormReferenceCreated"
        :contextId="contextId"
        :objectId="objectId"
        :schema="schema"
        @field-changed="onFieldChanged"
        @form-ready="onFormReady"
      />
      <div class="row full-width justify-end">
        <q-checkbox :label="$t('EventEditor.NOTIFY')" v-model="notify" />
      </div>
    </div>
  </KModal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { Store, mixins as kdkCoreMixins } from '@kalisio/kdk/core.client'
import { utils as kdkMapUtils } from '@kalisio/kdk/map.client.map'
import { usePlan } from '../composables'
import config from 'config'

export default {
  name: 'event-editor',
  mixins: [
    kdkCoreMixins.baseModal,
    kdkCoreMixins.service,
    kdkCoreMixins.objectProxy,
    kdkCoreMixins.schemaProxy,
    kdkCoreMixins.baseEditor
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
  watch: {
    plan: {
      handler () {
        this.refresh()
      }
    }
  },
  data () {
    return {
      notify: undefined
    }
  },
  computed: {
    buttons () {
      return [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: this.applyButton, renderer: 'form-button', handler: () => this.apply() }
      ]
    }
  },
  methods: {
    async loadObject () {
      if (this.templateId) {
        if (!this.template) this.template = await this.$api.getService('event-templates').get(this.templateId)
        this.object = Object.assign({}, this.template)
        // Keep track of template based on its name for statistics
        // We don't keep ref/link for simplicity and make archived events self-consistent
        // No need to keep track of templates that have been removed, etc.
        this.object.template = this.template.name
        // Remove id so that event has its own not the one from template
        delete this.object._id
        // Remove properties only useful in templates
        delete this.object.permission
        // Setup the plan if defined
        if (this.hasPlan()) {
          this.object.plan = this.planId
        }
        // Setup expiry date from template
        if (this.object.expiryDuration) {
          const expiryDate = moment().utc().add({ days: this.object.expiryDuration })
          this.object.expireAt = expiryDate.toISOString()
          delete this.object.expiryDuration
        }
        // Setup hasWorkflow tag
        this.object.hasWorkflow = !_.isNil(this.template.workflow)
        if (!_.isNil(this.longitude) && !_.isNil(this.latitude)) {
          this.object.location = {
            type: 'Feature',
            geometry: {
              type: 'Point', coordinates: [this.longitude, this.latitude]
            },
            properties: {
              name: kdkMapUtils.formatUserCoordinates(this.latitude, this.longitude, this.$store.get('locationFormat', 'FFf'))
            }
          }
        } else if (this.layerId) {
          // const layer = await this.$api.getService('catalog').get(this.layerId)
          // Keep track of layer/feature ID
          this.object.layer = this.layerId
          if (this.featureId) {
            const feature = await this.$api.getService('features').get(this.featureId)
            this.object.feature = this.featureId
            this.object.location = feature
            /*
            // Perform reverse geocoding if we target a feature
            let description = _.get(feature, 'name', _.get(feature, 'NAME'))
            if (!description && layer.featureId) description = _.get(feature, `properties.${layer.featureId}`)
            if (description) this.object.description = description
            const results = await this.$api.getService('geocoder').create(feature)
            if (results.length > 0) {
              const element = results[0]
              this.object.location = Object.assign(element, { name: utils.formatGeocodingResult(element) })
            }
            */
          } else {
            // TODO: manage a set of features
          }
        }
        this.updateSchema()
      } else {
        // Otherwise proceed as usual to load the event object
        return kdkCoreMixins.objectProxy.methods.loadObject.call(this)
      }
    },
    updateSchema () {
      // Not yet loaded ?
      if (!this.schema) return
      // When selecting organisation as participant avoid selecting external ones
      const organisationService = _.find(_.get(this.schema.properties, 'participants.services', []), { service: 'organisations' })
      if (organisationService) {
        const organisationQuery = _.get(organisationService, 'baseQuery', {})
        organisationQuery._id = this.contextId
      }
      // When a template is provided check for workflow availability
      if (this.template) {
        // Remove workflow from schema if not present in template
        if (_.isNil(this.template.workflow)) {
          _.unset(this.schema, 'properties.hasWorkflow')
          _.pull(this.schema.required, 'hasWorkflow')
        }
      }
      // When a plan is provide add objective edition and remove expiration date
      if (!_.isEmpty(this.plan)) {
        // Take into account properties filtering
        if (_.has(this.schema.properties, 'objective')) {
          _.set(this.schema, 'properties.objective.field.options',
            _.get(this.plan, 'objectives', []).map(objective => ({ label: objective.name, value: objective.name }))
          )
        }
        _.unset(this.schema, 'properties.expireAt')
        _.pull(this.schema.required, 'expireAt')
      } else {
        _.unset(this.schema, 'properties.objective')
      }
    },
    async loadSchema () {
      // Call super
      // Start from schema and clone it because it will be shared by all editors
      const schema = _.cloneDeep(await kdkCoreMixins.schemaProxy.methods.loadSchema.call(this, this.getSchemaName()))
      this.schema = schema
      this.updateSchema()
      return this.schema
    },
    getBaseQuery (object) {
      // Overriden to handle notification messages
      const query = kdkCoreMixins.baseEditor.methods.getBaseQuery.call(this)
      // When displaying events of all plans we'd like to have the plan object directly to ease processing
      if (!this.planId) {
        query.planAsObject = true
      }
      // User can choose to notify changes on update
      if (this.notify) {
        query.notification = {
          body: (this.editorMode === 'create' ? this.$t('EventNotifications.CREATE') : this.$t('EventNotifications.UPDATE')),
          // Setup notification redirection url
          url: `${config.domain}/#/home/${Store.get('context._id')}/events`
        }
      }
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
    async apply () {
      if (await kdkCoreMixins.baseEditor.methods.apply.call(this)) this.closeModal()
    }
  },
  async mounted () {
    // Build the editor.
    // Note that if the event belongs to a plan we need to wait for the plan to be loaded
    if (!this.hasPlan()) this.refresh()
    else this.loadPlan()
    // Setup notify option
    if (this.editorMode === 'create') this.notify = true
    else this.notify = false
  },
  setup (props) {
    return {
      ...usePlan({ contextId: props.contextId })
    }
  }
}
</script>
