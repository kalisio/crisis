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
    route: {
      type: String,
      default: ''
    },
    tour: {
      type: String,
      default: ''
    }
  },
  computed: {
    url () {
      return (this.tour ?
        this.$site.themeConfig.appUrl + `#/${this.route}?tour=${this.tour}` :
        this.$site.themeConfig.appUrl + `#/${this.route}?tour=true`)
    }
  }
}
</script>