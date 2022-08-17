<template>
  <k-modal ref="modal"
    :title="editorTitle"
    :buttons="buttons"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
  >
    <div class="column xs-gutter">
      <!-- Form to be used for standard properties -->
      <k-form :class="{ 'light-dimmed': applyInProgress }" ref="form" :schema="schema" />
      <!-- Toggle used to copy the source template workflow on creation -->
      <p v-show="hasWorkflow" :class="{ 'light-dimmed': applyInProgress }" class="col-10 caption pull-left">
        <q-toggle id="workflow-toggle" icon="las la-retweet" v-model="copyWorkflow" @input="onWorkflow">
        </q-toggle>
        <strong>{{$t('EventTemplateEditor.WORKFLOW_HELPER_LABEL')}}</strong>
      </p>
    </div>
    <q-spinner-cube color="primary" class="fixed-center" v-if="applyInProgress" size="4em"/>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins as kdkCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'event-template-editor',
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
      mixins.baseModal.methods.openModal.call(this, maximized)
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
        return mixins.objectProxy.methods.loadObject.call(this)
      }
    },
    async onWorkflow (copyWorkflow) {
      if (copyWorkflow) this.object.workflow = _.cloneDeep(this.template.workflow)
      else delete this.object.workflow
    }
  }
}
</script>
