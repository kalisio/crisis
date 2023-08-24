<template>
  <KModal
    :title="title"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
    :buttons="getButtons()"
  >
    <KForm ref="form" :schema="schema" @form-ready="refresh"/>
  </KModal>
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
    getButtons () {
      return [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'save-button', label: this.$t('EventLogEditor.SAVE_BUTTON'), renderer: 'form-button', handler: () => this.logCoordinatorState() }
      ]
    },
    getService () {
      return this.$api.getService('event-logs', this.contextId)
    },
    async loadSchema () {
      this.schema = this.generateSchemaForStep(this.step)
      return this.schema
    },
    async refresh () {
      this.refreshUser()
      if (this.userId) {
        // We can then load the schema
        await this.loadSchema()
        await this.$refs.form.build()
        this.$refs.form.clear()
      }
    },
    async logCoordinatorState () {
      await this.logStep(this.$refs.form, this.step, this.state)
      this.closeModal()
    }
  },
  async created () {
    // Retrieve source log/event
    this.state = await this.getService().get(this.logId)
    this.event = await this.$api.getService('events', this.contextId).get(this.objectId)
    this.step = this.getWorkflowStep(this.state)
  }
}
</script>
