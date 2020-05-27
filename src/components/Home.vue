<template>
  <k-home />
</template>

<script>
export default {
  name: 'home',
  /* methods: {
    openSideNav () {
      this.$store.pach('leftDrawer', { visible: true })
    }
  }, */
  created () {
    // load the layout component
    this.$options.components['k-home'] = this.$load('layout/KHome')
    // Initialize the user if any
    // Set the leading action
    const toggleSideNav = { name: 'dashboard', icon: 'las la-bars', label: this.$t('Context.PROFILE'), handler: () => this.$store.patch('leftDrawer', { visible: !this.$store.get('leftDrawer.visible') }) }
    this.$store.patch('appBar', { leading: toggleSideNav, toolbar: [], menu: [] })
  }
}
</script>
