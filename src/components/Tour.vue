<template>
  <div>
    <q-dialog v-model="showIntroduction" persistent>
      <q-card class="q-pa-xs q-ma-xs" style="min-width: 50vw">
        <q-toolbar>
          <div><img :src="banner"></div>
          <q-toolbar-title></q-toolbar-title>
          <q-btn id="close-action" icon="las la-times" flat round dense @click="hide"></q-btn>
        </q-toolbar>
        <q-card-section>
          <q-carousel
            v-model="slide"
            arrows
            swipeable
            animated
            padding
            transition-prev="scale"
            transition-next="scale"
            control-type="flat"
            control-color="primary"
          >
            <q-carousel-slide name="welcome" class="column no-wrap justify-center text-center q-gutter-md">
              <div class="text-h5">{{ $t('tours.welcome.WELCOME_TITLE') }}</div>
              <div class="text-subtitle1">{{ $t('tours.welcome.WELCOME_MESSAGE') }}</div>
              <div class="text-subtitle1" v-html="$t('tours.welcome.ONLINE_HELP')"></div>
            </q-carousel-slide>
            <q-carousel-slide name="tour" class="column no-wrap justify-center text-center q-gutter-md">
              <div class="text-subtitle1">{{ $t('tours.welcome.TOUR_MESSAGE') }}
                <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-external-link-square-alt" @click="onTour()"/>
              </div>
              <div class="text-subtitle1">{{ $t('tours.welcome.TOUR_LINK_MESSAGE') }}</div>
            </q-carousel-slide>
            <q-carousel-slide name="goodbye" class="column no-wrap justify-center text-center q-gutter-md">
              <div class="text-subtitle1">
                <span>
                  {{ $t('tours.welcome.CONTEXTUAL_HELP') }}
                  <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-question-circle"/>
                </span>
              </div>
              <div class="text-subtitle1">{{ $t('tours.welcome.GOODBYE_MESSAGE') }}</div>
            </q-carousel-slide>
            <template v-slot:control>
              <q-carousel-control position="bottom" class="text-primary" :offset="[0, 0]" style="cursor: pointer;">
                <q-checkbox v-model="toggle" @input="onToggleIntroduction" label="Ne plus afficher cette introduction" color="primary" />
              </q-carousel-control>
            </template>
          </q-carousel>
        </q-card-section>
      </q-card>
    </q-dialog>
    <k-tour></k-tour>
  </div>
</template>

<script>
import _ from 'lodash'
import { QCheckbox, QCarousel, QCarouselSlide, QCarouselControl } from 'quasar'
import utils from '../utils'

export default {
  name: 'tour',
  components: {
    QCheckbox,
    QCarousel,
    QCarouselSlide,
    QCarouselControl
  },
  data () {
    return {
      showIntroduction: false,
      slide: 'welcome',
      banner: null,
      toggle: false
    }
  },
  methods: {
    getIntroductionKey () {
      return this.$config('appName').toLowerCase() + '-introduction'
    },
    show () {
      const show = window.localStorage.getItem(this.getIntroductionKey())
      // Introduction is only for logged users
      this.showIntroduction = (_.isNil(show) ? true : JSON.parse(show))
    },
    hide () {
      this.showIntroduction = false
    },
    onToggleIntroduction (toggle) {
      window.localStorage.setItem(this.getIntroductionKey(), JSON.stringify(!toggle))
    },
    onTour () {
      this.hide()
      this.$store.patch('tours.current', { name: 'home' })
    }
  },
  created () {
    // Load required components
    this.$options.components['k-tour'] = utils.loadComponent('layout/KTour')
    this.banner = this.$load(this.$config('screens.banner'), 'asset')
  },
  mounted () {
    // Introduction is only for logged users, listen for user login/logout
    this.$api.on('authenticated', this.show)
    this.$api.on('logout', this.hide)
  },
  beforeDestroy () {
    this.$api.off('authenticated', this.show)
    this.$api.off('logout', this.hide)
  }
}
</script>
