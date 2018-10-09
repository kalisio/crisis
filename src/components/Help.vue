<template>
  <div class="row justify-center" style="padding: 32px">
    <div class="col-12" style="max-width: 90vw;">
      <q-select
        v-model="current"
        :options="toc"
        @change="onSelectionChanged"
      />
    </div>
    <div class="col-12 content-center" style="max-width: 1024px;">
      <q-gallery-carousel 
        ref="carousel" 
        :src="content" 
        fullscreen
        @slide="onSlideChanged"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { utils as kCoreUtils } from 'kCore/client'
import { QSelect, QGallery, QGalleryCarousel } from 'quasar'

export default {
  name: 'Help',
  components: {
    QSelect,
    QGallery,
    QGalleryCarousel
  },
  data () {
    return {
      toc: [],
      content: [],
      current: ''
    }
  },
  methods: {
    onSelectionChanged (selection) {
      this.$refs.carousel.goToSlide(_.findIndex(this.toc, { value: selection }), true)
    },
    onSlideChanged (slide) {
      this.current = this.toc[slide].value
    }
  },
  mounted () {
    // Setup the TOC
    this.toc = [
      { label: this.$t('help.BASICS'), value: 'basics'},
      { label: this.$t('help.BASICS_ORGANISATION'), value: 'basics-organisation'},
      { label: this.$t('help.BASICS_ROLES'), value: 'basics-roles'},
      { label: this.$t('help.BASICS_EVENTS'), value: 'basics-events'},
      { label: this.$t('help.LOGIN'), value: 'login'},
      { label: this.$t('help.REGISTER'), value: 'register'},
      { label: this.$t('help.HOME'), value: 'home'},
      { label: this.$t('help.ACCOUNT'), value: 'account'},
      { label: this.$t('help.ORGANISATION'), value: 'organisation'},
      { label: this.$t('help.EVENT_MODELS_MANAGEMENT'), value: 'event-models-management'},
      { label: this.$t('help.EVENT_WORKFLOW_BASICS'), value: 'event-workflow-basics'},
      { label: this.$t('help.EVENT_WORKFLOW_MANAGEMENT'), value: 'event-workflow-management'},
      { label: this.$t('help.EVENT_WORKFLOW_EXAMPLE'), value: 'event-workflow-example'},
      { label: this.$t('help.EVENTS_MANAGEMENT'), value: 'events-management'},
      { label: this.$t('help.EVENT_FOLLOWUP_PARTICIPANT'), value: 'event-followup-participant'},
      { label: this.$t('help.EVENT_FOLLOWUP_COORDINATOR'), value: 'event-followup-coordinator'},
      { label: this.$t('help.MEMBERS_MANAGEMENT'), value: 'members-management'},
      { label: this.$t('help.MEMBERS_ADD'), value: 'members-add'},
      { label: this.$t('help.GROUPS_MANAGEMENT'), value: 'groups-management'},
      { label: this.$t('help.GROUP_MEMBERS_MANAGEMENT'), value: 'group-members-management'},
    ]
    // Init the content
    for (let i = 0; i < this.toc.length; i++) {
      this.content.push('statics/help/' + kCoreUtils.getLocale() + '/' + this.toc[i].value + '.png')
    }
    // Init the current
    this.current = this.toc[0].value
  }
}
</script>