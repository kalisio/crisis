<template>
  <KModal
    :title="editorTitle"
    :buttons="getButtons()"
    v-model="isModalOpened"
  >
    <KForm
      ref="planForm"
      :contextId="contextId" 
      :objectId="objectId" 
      :schema="schema" 
    />
  </KModal>
</template>

<script>
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
  methods: {
    getButtons () {
      return [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: this.applyButton, renderer: 'form-button', handler: () => this.apply() }
      ]
    },
    async loadObject () {
      // When a template is provided use it as reference for object
      if (this.templateId) {
        if (!this.template) this.template = await this.$api.getService('plan-templates').get(this.templateId)
        this.object = Object.assign({}, this.template)
        // Keep track of template based on its name for statistics
        // We don't keep ref/link for simplicity and make archived plans self-consistent
        // No need to keep track of templates that have been removed, etc.
        this.object.template = this.template.name
        // Remove id so that event has its own
        delete this.object._id
      } else {
        // Otherwise proceed as usual to load the event object
        return mixins.objectProxy.methods.loadObject.call(this)
      }
    }
  },
  async created () {
    // Build the editor
    this.refresh()
  }
}
</script>
