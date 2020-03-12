<template>
  <q-page padding>
    <div class="col items-center">
      <div class="row justify-center">
        <q-select
          style="width:1180px"
          v-model="currentSection"
          outlined
          :options="toc"
          @input="onSelectionChanged"
        />
      </div>
      <div class="row  justify-center">
        <q-carousel 
          ref="carousel" 
          style="width:1180px; height: 640px"
          animated
          v-model="currentSlide"
          arrows
          infinite
          control-color="primary"
          @transition="onSlideChanged"
        >
          <template v-for="(slide,index) in toc">
            <q-carousel-slide 
              :key="index"
              :name="slide.value"
              :img-src="slide.content" />
          </template>
        </q-carousel>
      </div>
    </div>
  </q-page>
</template>

<script>
import _ from 'lodash'
import { utils as kCoreUtils } from '@kalisio/kdk/core.client'
import { QCarousel, QCarouselSlide, QCarouselControl } from 'quasar'

export default {
  name: 'Help',
  components: {
    QCarousel,
    QCarouselSlide,
    QCarouselControl
  },
  data () {
    return {
      toc: [],
      currentSection: '',
      currentSlide: ''
    }
  },
  methods: {
    onSelectionChanged (selection) {
      this.currentSlide = selection.value
    },
    onSlideChanged (slide) {
      this.currentSection = this.toc.find(entry => entry.value === slide)
    }
  },
  mounted () {
    // Setup the TOC
    this.toc = [
      { label: this.$t('help.BASICS'), value: 'basics' },
      { label: this.$t('help.BASICS_ORGANISATION'), value: 'basics-organisation' },
      { label: this.$t('help.BASICS_ROLES'), value: 'basics-roles' },
      { label: this.$t('help.BASICS_EVENTS'), value: 'basics-events' },
      { label: this.$t('help.LOGIN'), value: 'login' },
      { label: this.$t('help.REGISTER'), value: 'register' },
      { label: this.$t('help.HOME'), value: 'home' },
      { label: this.$t('help.ACCOUNT'), value: 'account' },
      { label: this.$t('help.ORGANISATION'), value: 'organisation' },
      { label: this.$t('help.EVENT_MODELS_MANAGEMENT'), value: 'event-models-management' },
      { label: this.$t('help.EVENT_WORKFLOW_BASICS'), value: 'event-workflow-basics' },
      { label: this.$t('help.EVENT_WORKFLOW_MANAGEMENT'), value: 'event-workflow-management' },
      { label: this.$t('help.EVENT_WORKFLOW_EXAMPLE'), value: 'event-workflow-example' },
      { label: this.$t('help.EVENTS_MANAGEMENT'), value: 'events-management' },
      { label: this.$t('help.EVENT_FOLLOWUP_PARTICIPANT'), value: 'event-followup-participant' },
      { label: this.$t('help.EVENT_FOLLOWUP_COORDINATOR'), value: 'event-followup-coordinator' },
      { label: this.$t('help.MEMBERS_MANAGEMENT'), value: 'members-management' },
      { label: this.$t('help.MEMBERS_ADD'), value: 'members-add' },
      { label: this.$t('help.GROUPS_MANAGEMENT'), value: 'groups-management' },
      { label: this.$t('help.GROUP_MEMBERS_MANAGEMENT'), value: 'group-members-management' }
    ]
    // Init the content
    for (let i = 0; i < this.toc.length; i++) {
      this.toc[i].content = 'statics/help/' + kCoreUtils.getLocale() + '/' + this.toc[i].value + '.png'
    }
    // Init the current
    this.currentSection = this.toc[0]
    this.currentSlide = this.currentSection.value
  }
}
</script>