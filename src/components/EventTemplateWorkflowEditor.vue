<template>
  <KModal
    :title="editorTitle"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <div class="column xs-gutter">
      <EventTemplateWorkflowForm 
        ref="onFormReferenceCreated" 
        :schema="schema"
        @form-ready="onFormReady"
      />
    </div>
  </KModal>
</template>

<script>
import EventTemplateWorkflowForm from './EventTemplateWorkflowForm.vue'
import { mixins as kdkCoreMixins } from '@kalisio/kdk/core.client'

export default {
  components: {
    EventTemplateWorkflowForm
  },
  mixins: [
    kdkCoreMixins.baseModal,
    kdkCoreMixins.service,
    kdkCoreMixins.objectProxy,
    kdkCoreMixins.schemaProxy,
    kdkCoreMixins.baseEditor
  ],
  computed: {
    buttons () {
      return [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: this.applyButton, renderer: 'form-button', handler: () => this.apply() }
      ]
    }
  },
  methods: {
    openModal (maximized = false) {
      this.refresh()
      kdkCoreMixins.baseModal.methods.openModal.call(this, maximized)
    }
  }
}
</script>
