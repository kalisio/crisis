<template>
  <k-modal ref="modal"
    :title="editorTitle"
    :buttons="buttons"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
  >
    <div class="column xs-gutter">
      <!-- Form to be used for workflow property -->
      <event-template-workflow-form :class="{ 'light-dimmed': applyInProgress }" ref="form" :schema="schema" />
      <q-spinner-cube color="primary" class="fixed-center" v-if="applyInProgress" size="4em"/>
    </div>
  </k-modal>
</template>

<script>
import { mixins } from '@kalisio/kdk/core.client'

export default {
  name: 'event-template-editor',
  mixins: [
    mixins.baseModal,
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    mixins.baseEditor(['form']),
    mixins.refsResolver(['form'])
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
      mixins.baseModal.methods.openModal.call(this, maximized)
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['event-template-workflow-form'] = this.$load('EventTemplateWorkflowForm')
    this.$on('applied', this.closeModal)
  },
  beforeUnmount () {
    this.$off('applied', this.closeModal)
  }
}
</script>
