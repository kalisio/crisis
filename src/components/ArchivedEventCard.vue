<template>
  <div>
    <k-card 
      v-bind="$props" 
      :header="header" 
      :actions="itemActions" 
      :bind-actions="false"
      :dense="dense"
      :expandable="true"      
      @expanded="isExpanded = true"
      @collapsed="isExpanded = false"
    >
      <!--
        Card content
       -->
      <template v-slot:card-content>
        <!-- Objective section -->
        <k-card-section 
          v-if="isExpanded || item.objective"
          :key="item + '-objective'"
          :title="$t('ArchivedEventCard.OBJECTIVE_SECTION')" 
          :hideHeader="!isExpanded"
          :dense="dense"
        > 
          <q-badge v-if="item.objective" :label="objective" color="grey-7" :multi-line="true"/>
          <div v-else>
            <k-stamp text="ArchivedEventCard.UNDEFINED_OBJECTIVE_LABEL" direction="horizontal" />
          </div>
        </k-card-section>
        <!-- location section -->
        <k-card-section v-if="isExpanded" 
          :key="item + '-location'"
          :title="$t('ArchivedEventCard.LOCATION_SECTION')" 
          :context="$props"
          :dense="dense"
        >
          <div v-if="item.location" class="row items-center justify-between no-wrap">
            <k-text-area class="light-paragraph" :text="locationName" />
            <k-popup-action id="location-map" icon="las la-map-marker" :content="[ getLocationMap() ]" />
          </div>
          <div v-else>
            <k-stamp text="ArchivedEventCard.UNDEFINED_LOCATION_LABEL" direction="horizontal" />
          </div>
        </k-card-section>
        <!-- Participants section -->
        <k-card-section v-if="isExpanded"
          :key="item + '-participants'"
          :title="$t('ArchivedEventCard.PARTICIPANTS_SECTION')" 
          :context="$props"
          :dense="dense"
        >
          <div v-if="hasParticipants">
            <k-chips-pane class="q-pl-sm" :chips="item.participants" value-path="profile.name" />
          </div>
          <div v-else>
            {{ $t('ArchivedEventCard.NO_PARTICIPANTS_LABEL')}}
          </div>
        </k-card-section>
        <!-- Coordinators section -->
        <k-card-section v-if="isExpanded"
          :key="item + '-coordinators'"
          :title="$t('ArchivedEventCard.COORDINATORS_SECTION')" 
          :context="$props"
          :dense="dense"
        >
          <k-chips-pane class="q-pl-sm" :chips="item.coordinators" value-path="profile.name" />
        </k-card-section>
      </template>
    </k-card>
    <k-media-browser ref="mediaBrowser" :options="mediaBrowserOptions()" />
  </div>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils, Time } from '@kalisio/kdk/core.client'
import { mixins as kMapMixins } from '@kalisio/kdk/map.client.map'
import mixins from '../mixins'

export default {
  name: 'event-card',
  mixins: [
    kCoreMixins.baseItem,
    kCoreMixins.service,
    kCoreMixins.schemaProxy,
    kCoreMixins.refsResolver(['form']),
    kMapMixins.navigator,
    mixins.events,
    mixins.alerts
  ],
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    item: function () {
      // Some actions are not fully reactive and need to be updated manually
      this.configureActions()
    }
  },
  computed: {
    header () {
      let components = []
      if (this.item.deletedAt) {
        const deletedAtDate =  new Date(this.item.deletedAt).toLocaleString()
        components.push({ component: 'QBadge', label: this.$t('ArchivedEventCard.CLOSED_LABEL'), color: 'black' }),
        components.push({ component: 'frame/KStamp', text: this.$t('ArchivedEventCard.CLOSED_AT_LABEL') + deletedAtDate, textSize: '0.75rem', direction: 'horizontal' })
      } else {
        const updatedAtDate =  new Date(this.item.updatedAt).toLocaleString()
        components.push({ component: 'QBadge', label: this.$t('ArchivedEventCard.OPENED_LABEL'), color: 'green-7' })
        components.push({ component: 'frame/KStamp', text: this.$t('ArchivedEventCard.UPDATED_AT_LABEL') + updatedAtDate, textSize: '0.75rem', direction: 'horizontal' })
      }
      components.push({ component: 'QSpace '})
      components.concat(_.filter(this.itemActions, { scope: 'header' }))
      return components
    },
    icon () {
      return kCoreUtils.getIconName(this.getUserIcon(this.participantState, this.participantStep))
    },
    iconColor () {
      return _.get(this.item, 'icon.color', '')
    },
    iconName () {
      return kCoreUtils.getIconName(this.item)
    },
    objective () {
      return [this.item.objective]
    },
    locationName () {
      // Event generated from alert ?
      return (this.item.alert ? this.getAlertLocationName(this.item.alert) : _.get(this.item, 'location.name', ''))
    },
    hasParticipants () {
      return !_.isEmpty(this.item.participants)
    },
    createdAt () {
      return this.item.createdAt ? new Date(this.item.createdAt) : null
    },
    updatedAt () {
      return this.item.updatedAt ? new Date(this.item.updatedAt) : null
    }
  },
  data () {
    return {
      zoomDescription: false,
      isExpanded: false
    }
  },
  methods: {
    getDescription () {
      // Event generated from alert ?
      return this.item.alert ? this.getAlertDetailsAsHtml(this.item.alert) : this.item.description
    },    
    getLocationMap () {
      return { 
        component: 'KLocationMap', 
        value: this.item.location, 
        editable: false, 
        style: 'min-width: 360px; max-width: 360px; min-height: 360px; max-height: 360px;' 
      }
    },
    followUp () {
      this.$router.push({ name: 'event-activity',
        params: { objectId: this.item._id, contextId: this.contextId },
        query: { archived: true } })
    },
    browseMedia () {
      this.$refs.mediaBrowser.show(this.item.attachments)
    },
    viewMap () {
      this.$router.push({ name: 'event-activity', params: { objectId: this.item._id, contextId: this.contextId } })
    },
    refresh () {
      this.refreshUser()
      if (this.userId) {
        if (this.item.alert) this.loadAlertLayer(this.item.alert)
      }
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-chips-pane'] = this.$load('frame/KChipsPane')
    this.$options.components['k-media-browser'] = this.$load('media/KMediaBrowser')
    this.$options.components['k-popup-action'] = this.$load('frame/KPopupAction')
  },
  created () {
    // Required alias for the event logs mixin
    this.event = this.item
    // Set the required actor
    if (this.$store.get('user')) this.refresh()
    this.$events.$on('user-changed', this.refresh)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refresh)
  }
}
</script>

<style>
  .event-card-description {
    transition: font-size .2s;
  }
  .event-card-description-zoomed {
    font-size: larger;
  }
</style>
