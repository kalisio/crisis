<template>
  <div>
    <k-history-entry v-bind="$props" :actions="itemActions" >
      <div slot="history-entry-heade">
        <div v-if="updatedAt"><small>{{$t('ArchivedEventEntry.UPDATED_AT_LABEL')}} {{formatDate(updatedAt)}}</small></div>
        <div v-if="deletedAt"><small>{{$t('ArchivedEventEntry.DELETED_AT_LABEL')}} {{formatDate(deletedAt)}}</small></div>
        <div v-if="expiredAt"><small>{{$t('ArchivedEventEntry.EXPIRED_AT_LABEL')}} {{formatDate(expiredAt)}}</small></div>
        <q-btn v-if="count" flat rounded color="seconday" icon="las la-user" :label="count">
          <q-tooltip>{{ $t('ArchivedEventEntry.PARTICIPANT_COUNT') }}</q-tooltip>
        </q-btn>
      </div>
      <div slot="history-entry-title">
        {{ item.name }} - {{formatDate(createdAt)}}
        <q-popup-proxy ref="locationPopup" no-parent-event transition-show="scale" transition-hide="scale">
          <q-card style="width: 350px; height: 400px">
            <k-location-map v-model="item.location" :editable="false" />
          </q-card>
        </q-popup-proxy>
      </div>
      <div slot="history-entry-content">
        <div v-if="item.location">
          <k-text-area class="light-paragraph" :text="locationName" />
          <q-separator />
        </div>
        <k-text-area v-if="description" class="q-pa-sm" :text="description" />
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
    mixins.events,
    mixins.alerts
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
    },
    locationName () {
      // Event generated from alert ?
      return (this.item.alert ? this.getAlertLocationName(this.item.alert) : _.get(this.item, 'location.name', ''))
    }
  },
  data () {
    return {
      count: null
    }
  },
  methods: {
    getDescription () {
      // Event generated from alert ?
      return this.item.alert ? this.getAlertDetailsAsHtml(this.item.alert) : this.item.description
    },
    formatDate (date) {
      return date.toLocaleString(kCoreUtils.getLocale(),
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    configureActions () {
      // Required alias for the event logs mixin
      this.event = this.item
      kCoreMixins.baseItem.methods.configureActions.call(this)
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
    },
    async refresh () {
      if (this.item.alert) this.loadAlertLayer(this.item.alert)
      const eventLogsService = this.$api.getService('archived-event-logs', this.contextId)
      const result = await eventLogsService.find({
        query: {
          $aggregate: true,
          event: this.item._id,
          lastInEvent: true
        }
      })
      if (result.length > 0) this.count = result[0].count
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-history-entry'] = this.$load('collection/KHistoryEntry')
    this.$options.components['k-media-browser'] = this.$load('media/KMediaBrowser')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
    // Get participant count
    await this.refresh()
  },
  beforeDestroy () {
  }
}
</script>

<style>
</style>
