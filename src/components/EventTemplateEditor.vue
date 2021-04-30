<template>
  <k-modal ref="modal" 
    :title="title" 
    :toolbar="toolbar()" 
    :buttons="buttons" 
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content" class="column xs-gutter">
      <div v-show="!workflowEdition">
        <k-form :class="{ 'light-dimmed': applyInProgress }" ref="templateForm" :schema="schema"  @field-changed="onFieldChanged"/>
        <p :class="{ 'light-dimmed': applyInProgress }" class="col-10 caption pull-left">
          <q-toggle id="workflow-toggle" icon="las la-retweet" v-model="hasWorkflow" @input="onWorkflow">
          </q-toggle>
          <strong v-show="!hasWorkflow">{{$t('EventTemplateEditor.ADD_WORKFLOW_LABEL')}}</strong>
          <strong v-show="hasWorkflow">{{$t('EventTemplateEditor.WORKFLOW_HELPER_LABEL')}}</strong>
          <a v-show="hasWorkflow" class="text-caption" @click="workflowEdition = true"> ({{$t('EventTemplateEditor.WORKFLOW_MANAGE_HELPER_LABEL')}})</a>
        </p>
      </div>
      <event-workflow-form v-show="workflowEdition" ref="workflowForm" :objectId="objectId" :layerId="layerId" />
    </div>
    <q-spinner-cube color="primary" class="fixed-center" v-if="applyInProgress" size="4em"/>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins } from '@kalisio/kdk/core.client'

export default {
  name: 'event-template-editor',
  mixins: [
    mixins.baseModal,
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    mixins.baseEditor(['templateForm', 'workflowForm']),
    mixins.refsResolver(['templateForm', 'workflowForm'])
  ],
  props: {
    templateId: {
      type: String,
      default: ''
    }
  },
  computed: {
    title () {
      return (this.workflowEdition ? this.$t('EventTemplateEditor.WORKFLOW_TITLE') : this.editorTitle)
    },
    buttons () {
      return (this.workflowEdition ? [] : [{
        id: 'apply-button',
        label: this.applyButton,
        color: 'primary',
        handler: () => this.apply(),
        renderer: 'form-button'
      }])
    }
  },
  data () {
    return {
      hasWorkflow: false,
      workflowEdition: false,
      layerId: ''
    }
  },
  methods: {
    toolbar () {
      let action = { id: 'close-action', tooltip: this.$t('EventTemplateEditor.CLOSE_ACTION'), icon: 'las la-times' }
      if (this.workflowEdition) action.handler = () => { this.workflowEdition = false }
      else action.handler = () => this.closeModal()
      return [action]
    },
    loadObject () {
      // When a template is provided use it as reference for object
      if (this.template) {
        this.object = Object.assign({}, this.template)
        // Remove id so that event has its own
        delete this.object._id
        // Setup hasWorkflow tag
        this.object.hasWorkflow = !_.isNil(this.template.workflow)
        return Promise.resolve(this.object)
      } else if (this.objectId) {
        // Otherwise proceed as usual to load the event object
        return mixins.objectProxy.methods.loadObject.call(this)
      }
    },
    onFieldChanged (field, value) {
      // Setup workflow depending on target layer
      if (field === 'layer') {
        this.layerId = (value ? value._id : null)
      }
    },
    async onWorkflow (hasWorkflow) {
      if (this.templateId) {
        if (hasWorkflow) this.object.workflow = this.template.workflow
        else delete this.object.workflow
      }
      // Activate workflow form accordingly
      this.setFormDisabled('workflowForm', !hasWorkflow)
      // Enter workflow edition mode
      if (hasWorkflow) this.workflowEdition = true
    },
    async initialize () {
      await this.refresh()
      // In edition mode activate workflow according to its existence
      if (this.objectId || this.templateId) {
        this.hasWorkflow = !_.isNil(this.getObject().workflow)
        this.layerId = _.get(this.getObject(), 'layer._id')
        this.setFormDisabled('workflowForm', !this.hasWorkflow)
      } else {
        // In creation mode disabled by default
        this.setFormDisabled('workflowForm', true)
      }
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
    this.$options.components['event-workflow-form'] = this.$load('EventWorkflowForm')
    // On creation check whether we copy or create a new template
    if (this.templateId) {
      this.template = await this.$api.getService('event-templates').get(this.templateId)
    }
    this.initialize()
    this.$on('applied', this.closeModal)
  },
  beforeDestroy () {
    this.$off('applied', this.closeModal)
  }
}
</script>
