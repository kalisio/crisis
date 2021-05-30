<template>
  <k-history-entry v-bind="$props" :actions="itemActions" >
    <div slot="entry-date">
      <div v-if="updatedAt"><small>{{$t('ArchivedEventEntry.UPDATED_AT_LABEL')}} {{formatDate(updatedAt)}}</small></div>
      <div v-if="deletedAt"><small>{{$t('ArchivedEventEntry.DELETED_AT_LABEL')}} {{formatDate(deletedAt)}}</small></div>
      <div v-if="expiredAt"><small>{{$t('ArchivedEventEntry.EXPIRED_AT_LABEL')}} {{formatDate(expiredAt)}}</small></div>
    </div>
    <div slot="entry-title">
      {{ item.name }} - {{formatDate(createdAt)}}
      <q-popup-proxy ref="locationPopup" no-parent-event transition-show="scale" transition-hide="scale">
        <q-card>
          <k-location-map v-model="item.location" width="350px" height="400px" :editable="false" />
        </q-card>
      </q-popup-proxy>
    </div>
    <div slot="entry-content">
      <div v-if="item.location">
        <k-text-area class="q-pa-sm light-paragraph" :text="locationName" />
        <q-separator />
      </div>
      <k-text-area v-if="description" class="q-pa-sm" :text="description" />
    </div>
  </k-history-entry>
</template>

<script>
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

export default {
  name: 'archived-event-entry',
  mixins: [
    kCoreMixins.baseItem
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
      return _.get(this.item, 'location.name', '')
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
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-history-entry'] = this.$load('collection/KHistoryEntry')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
  }
}
</script>
