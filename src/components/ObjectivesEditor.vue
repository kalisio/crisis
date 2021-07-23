<template>
  <k-modal
    :title="item.name" 
    :buttons="getButtons()" 
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content" class="column xs-gutter">
      {{ item.objectives }}
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-editor',
  mixins: [
    mixins.baseModal,
  ],
  props: {
    objectId: {
      type: String,
      required: true
    },
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    getButtons () {
      return [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: 'UPDATE', renderer: 'form-button', handler: () => this.apply()  }
      ]
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-list'] = this.$load('frame/KList')
  },
  async created () {
    this.$on('applied', this.closeModal)
  },
  beforeDestroy () {
    this.$off('applied', this.closeModal)
  }
}
</script>
