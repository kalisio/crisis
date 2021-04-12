<template>
  <k-modal :title="title" v-model="isModalOpened" @opened="$emit('opened')" @closed="$emit('closed')" :buttons="buttons()">
    <div slot="modal-content">
      <k-form ref="form" :schema="schema"/>
    </div>
  </k-modal>
</template>

<script>
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

export default {
  name: 'event-log-editor',
  mixins: [
    kCoreMixins.baseModal,
    kCoreMixins.service,
    kCoreMixins.schemaProxy,
    kCoreMixins.refsResolver(['form']),
    mixins.events
  ],
  props: {
    objectId: {
      type: String,
      required: true
    },
    logId: {
      type: String,
      required: true
    }
  },
  computed: {
    title () {
      return this.step.title ? this.step.title : this.$t('schemas.EVENTS_LOG_TITLE')
    }
  },
  data () {
    return {
      step: {}
    }
  },
  methods: {
    buttons () {
      return [{
        id: 'save-button',
        label: this.$t('EventLogEditor.SAVE_BUTTON'),
        renderer: 'form-button',
        handler: () => this.logCoordinatorState()
      }]
    },
    loadService () {
      this._service = this.$api.getService('event-logs', this.contextId)
      return this._service
    },
    async loadSchema () {
      this.schema = await this.generateSchemaForStep(this.step, this.event.layer)
      return this.schema
    },
    async refresh () {
      this.refreshUser()
      if (this.userId) {
        // We can then load the schema and local refs in parallel
        await Promise.all([
          this.loadSchema(),
          this.loadRefs()
        ])
        await this.$refs.form.build()
        const properties = await this.loadFeatureProperties(this.event.feature)
        if (properties) this.$refs.form.fill(properties)
        else this.$refs.form.clear()
      }
    },
    async logCoordinatorState () {
      await this.logStep(this.$refs.form, this.step, this.state)
      this.$refs.closeModal()
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
    // Retrieve source log/event
    this.state = await this.loadService().get(this.logId)
    this.event = await this.$api.getService('events', this.contextId).get(this.objectId)
    // Load layer schema if any
    await this.loadLayerSchema(this.event.layer)
    this.step = this.getWorkflowStep(this.state)
    this.refresh()
  }
}
</script>
