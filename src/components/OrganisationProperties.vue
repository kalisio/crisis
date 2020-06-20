<template>
  <div class="q-pa-md column q-gutter-md">
    <!-- 
      Properties editor
     -->  
    <k-editor service="organisations" :objectId="context._id" @applied="onApplied" />
  </div>
</template>

<script>
import _ from 'lodash'
import { copyToClipboard } from 'quasar'

export default {
  name: 'organisation-properties',
  computed: {
    subscribeLink () {
      return this.getSubscriptionPageLink('subscribe')
    },
    unsubscribeLink () {
      return this.getSubscriptionPageLink('unsubscribe')
    }
  },
  data () {
    return {
      context: this.$store.get('context')
    }
  },
  methods: {
    onApplied (properties) {
      // FIXME: use context-changed ?
      this.$store.patch('context', { _id: this.context._id, name: properties.name })
    }
  },
  created () {
    // Load the required componets
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
  }
}
</script>
