<template>
  <div>
    <k-history-entry v-bind="$props" :itemActions="actions">
      <div slot="entry-date">
        <div v-if="updatedAt"><small>{{$t('ArchivedEventEntry.UPDATED_AT_LABEL')}} {{formatDate(updatedAt)}}</small></div>
        <div v-if="deletedAt"><small>{{$t('ArchivedEventEntry.DELETED_AT_LABEL')}} {{formatDate(deletedAt)}}</small></div>
        <div v-if="expiredAt"><small>{{$t('ArchivedEventEntry.EXPIRED_AT_LABEL')}} {{formatDate(expiredAt)}}</small></div>
      </div>
      <div slot="entry-title">
        {{ item.name }} - {{formatDate(createdAt)}}
        <q-popup-proxy ref="locationPopup" no-parent-event transition-show="scale" transition-hide="scale">
          <k-location-map v-model="item.location" :editable="false" />
        </q-popup-proxy>
      </div>
    </k-history-entry>
    <k-media-browser ref="mediaBrowser" :options="mediaBrowserOptions()" />
  </div>
</template>

<script>
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

export default {
  name: 'archived-event-entry',
  mixins: [
    kCoreMixins.baseItem,
    mixins.eventLogs
  ],
  computed: {
    createdAt () {
      return this.item.createdAt ? new Date(this.item.createdAt) : null
    },
    updatedAt () {
      return this.item.updatedAt ? new Date(this.item.updatedAt) : null
    },
    deletedAt () {
      return this.item.deletedAt ? new Date(this.item.deletedAt) : null
    },
    expiredAt () {
      return this.item.expireAt && !this.item.deletedAt ? new Date(this.item.expireAt) : null
    }
  },
  data () {
    return {
    }
  },
  methods: {
    formatDate (date) {
      return date.toLocaleString(kCoreUtils.getLocale(),
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric' })
    },
    refreshActions () {
      // Required alias for the event logs mixin
      this.event = this.item
      // Item actions
      this.clearActions()
      if (this.$can('read', 'events', this.contextId, this.item)) {
        if (this.hasLocation()) this.registerPaneAction({
          name: 'locate', label: this.$t('ArchivedEventEntry.LOCATE_LABEL'), icon: 'place', handler: this.locate
        })
        this.registerPaneAction({
          name: 'view-event', label: this.$t('ArchivedEventEntry.VIEW_LABEL'), icon: 'description',
          route: { name: 'view-event', params: { contextId: this.contextId, objectId: this.item._id } }
        })
        this.registerPaneAction({
          name: 'map', label: this.$t('ArchivedEventEntry.MAP_LABEL'), icon: 'scatter_plot', handler: this.followUp
        })
        if (this.hasMedias()) this.registerPaneAction({
          name: 'browse-media', label: this.$t('ArchivedEventEntry.BROWSE_MEDIA_LABEL'), icon: 'photo_library', handler: this.browseMedia
        })
      }
    },
    locate () {
      this.$refs.locationPopup.toggle()
    },
    followUp () {
      this.$router.push({ name: 'event-activity',
        params: { objectId: this.item._id, contextId: this.contextId },
        query: { archived: true } })
    },
    mediaBrowserOptions () {
      return {
        service: this.contextId + '/storage',
        backgroundColor: 'black',
        controlColor: 'white'
      }
    },
    browseMedia () {
      this.$refs.mediaBrowser.show(this.item.attachments)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-history-entry'] = this.$load('collection/KHistoryEntry')
    this.$options.components['k-media-browser'] = this.$load('media/KMediaBrowser')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
