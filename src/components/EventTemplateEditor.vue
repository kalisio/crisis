<template>
  <KModal
    :title="editorTitle"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <div class="column xs-gutter">
      <!--
        Form to be used for standard properties
      -->
      <KForm
        :ref="onFormReferenceCreated"
        :schema="schema"
        @form-ready="onFormReady"
      />
      <!--
        Toggle used to copy the source template workflow on creation
      -->
      <p v-show="hasWorkflow" :class="{ 'light-dimmed': applyInProgress }" class="col-10 caption pull-left">
        <q-toggle id="workflow-toggle" icon="las la-retweet" v-model="copyWorkflow" @input="onWorkflow">
        </q-toggle>
        <strong>{{$t('EventTemplateEditor.WORKFLOW_HELPER_LABEL')}}</strong>
      </p>
    </div>
  </KModal>
</template>

<script>
import _ from 'lodash'
import { mixins as kdkCoreMixins } from '@kalisio/kdk/core.client'

export default {
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
  data () {
    return {
      hasWorkflow: false,
      copyWorkflow: false
    }
  },
  methods: {
    openModal (maximized = false) {
      this.refresh()
      kdkCoreMixins.baseModal.methods.openModal.call(this, maximized)
    },
    async loadObject () {
      // When a template is provided use it as reference for object
      if (this.templateId) {
        this.template = await this.$api.getService('event-templates').get(this.templateId)
        this.object = _.cloneDeep(this.template)
        // Remove id so that event has its own
        delete this.object._id
        // Check for workflow, and by default copy it
        this.hasWorkflow = !_.isEmpty(_.get(this.template, 'workflow'))
        this.copyWorkflow = this.hasWorkflow
        return Promise.resolve(this.object)
      } else {
        // Otherwise proceed as usual to load the event object
        return kdkCoreMixins.objectProxy.methods.loadObject.call(this)
      }
    },
    updateSchema () {
      // Not yet loaded ?
      if (!this.schema) return
      // When selecting organisation as participant avoid selecting external ones
      const organisationService = _.find(_.get(this.schema.properties, 'participants.services', []), { service: 'organisations'} )
      if (organisationService) {
        const organisationQuery = _.get(organisationService, 'baseQuery', {})
        organisationQuery._id = this.contextId
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
    async onWorkflow (copyWorkflow) {
      if (copyWorkflow) this.object.workflow = _.cloneDeep(this.template.workflow)
      else delete this.object.workflow
    },
    async apply () {
      if (await kdkCoreMixins.baseEditor.methods.apply.call(this)) this.closeModal()
    }
  }
}
</script>
