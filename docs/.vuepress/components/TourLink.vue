<template>
  <a target="_blank" :href="url">{{ text }}<i class="las la-external-link-square-alt"></i></a>
</template>

<script>
export default {
  name: 'tour-link',
  props: {
    text: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    url () {
      let url = this.$site.themeConfig.appUrl + `#/${this.path}?`
      // Add tour param be default if not provided
      if (!this.params.tour) url += 'tour=true&'
      for (const [key, value] of Object.entries(this.params)) {
        url += `${key}=${value}&`
      }
      // Remove last &
      return url.slice(0, -1)
    }
  }
}
</script>