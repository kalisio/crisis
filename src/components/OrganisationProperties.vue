<template>
  <div class="q-pa-md row q-gutter-md">
    <k-editor class="col-12" service="organisations" :objectId="context._id" @applied="onApplied" />
    <q-separator class="col-12" />
    <div class="col-12 row full-width justify-between items-center no-wrap">
      {{ $t('OganisationProperties.SUBSCRIPTION_LINKS') }}
      <div class="q-pa-sm col-2 row justify-around no-wrap">
        <q-btn flat round icon="las la-user-plus" />
        <q-btn flat round icon="las la-user-minus" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'organisation-properties',
  computed: {
    subscribeLink () {
      // TODO
      return 'subscribe' + this.context._id + '/' + _.kebabCase(this.context.name)
    },
    unsubscribeLink () {
      // TODO
      return 'unsubscribe' + this.context._id + '/' + _.kebabCase(this.context.name)
    }
  },
  data () {
    return {
      context: this.$store.get('context')
    }
  },
  methods: {
    onApplied (properties) {
      this.$store.patch('context', { _id: this.context._id, name: properties.name })
    }
  },
  created () {
    // Load the required componets
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
  }
}
</script>
