<template>
  <k-home />
</template>

<script>
export default {
  name: 'home',
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refresh()
    }
  },
  methods: {
    refresh () {
      // When a context is set, context actions will be used
      if (this.$store.get('context')) return
      // Set the leading action
      const toggleSideNav = {
        name: 'sidenav', icon: 'las la-bars', label: this.$t('Context.PROFILE'),
        handler: () => this.$store.patch('leftDrawer', { visible: !this.$store.get('leftDrawer.visible') })
      }
      let actions = { leading: toggleSideNav, toolbar: [], menu: [] }
      // Then contextual help if any
      const routeName = this.$route.name
      if (this.$store.get(`tours.${routeName}`)) {
        actions.toolbar.push({
          name: 'online-help', icon: 'las la-question-circle', label: this.$t('Context.CONTEXTUAL_HELP'),
          handler: () => this.$store.patch('tours.current', { name: routeName })
        })
      }
      this.$store.patch('appBar', actions)
    }
  },
  created () {
    // load the layout component
    this.$options.components['k-home'] = this.$load('layout/KHome')
    this.$events.$on('context-changed', this.refresh)
    this.refresh()
  },
  beforeDestroy () {
    this.$events.$off('context-changed', this.refresh)
  }
}
</script>
