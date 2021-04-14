<template>
  <k-avatar 
    v-if="organisation" 
    :class="$q.screen.lt.sm ? 'q-pa-xs' : 'q-pa-sm'" 
    :object="organisation" 
    :contextId="organisation._id"
    :size="$q.screen.lt.sm ? '2rem' : '2.2rem'" />
</template>

<script>
export default {
  name: 'k-organisation-avatar',
  data () {
    return {
      organisation: this.$store.get('context')
    }
  },
  methods: {
    refresh () {
      this.organisation = this.$store.get('context')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    // Update when changed
    this.$events.$on('context-changed', this.refresh)
  },
  beforeDestroy () {
    this.$events.$off('context-changed', this.refresh)
  }
}
</script>