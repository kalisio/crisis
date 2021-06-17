<template>
  <k-history-entry v-bind="$props" :actions="itemActions">
    <!--
      Header section
     -->
    <div slot="fact-header">
      <div class="q-pa-sm row justify-between">
        <q-badge v-if="updatedAt" color="grey-7">{{ $t('ArchivedEventEntry.UPDATED_AT_LABEL') }} {{ formatDate(updatedAt) }}</q-badge>
        <q-badge v-if="deletedAt" color="grey-7">{{ $t('ArchivedEventEntry.DELETED_AT_LABEL') }} {{ formatDate(deletedAt) }}</q-badge>
        <q-badge v-if="expiredAt" color="grey-7">{{ $t('ArchivedEventEntry.EXPIRED_AT_LABEL') }} {{ formatDate(expiredAt) }}</q-badge>
      </div>
    </div>
    <!--
      Content section
     -->
    <div slot="fact-content">
      <!-- Description -->
      <q-separator />
      <k-text-area v-if="description" class="q-pa-sm" :text="description" />
      <!-- Location -->
      <div v-if="location">
        <q-separator />
        <div class="row full-width justify-between items-center">
          <k-text-area class="q-pa-sm light-paragraph" :text="location.name" />
          <k-action
            id="view-location"
            icon="las la-map-marker"
            @triggered="onLocationTriggered">
            <template slot="content">
              <q-popup-proxy ref="locationPopup" no-parent-event transition-show="scale" transition-hide="scale">
                <q-card style="width: 400px; height: 350px">
                  <k-location-map v-model="location" :editable="false" />
                </q-card>
              </q-popup-proxy>
            </template>
          </k-action>
        </div>
      </div>
      <!-- Objectives -->
      <div v-if="objectives">
        <q-separator />
        <div class="q-px-sm q-pt-sm">
          <k-chips-pane :chips="objectives" />
        </div>
      </div>
    </div>
  </k-history-entry>
</template>

<script>
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'archived-plan-entry',
  mixins: [
    kCoreMixins.baseItem
  ],
  computed: {
    updatedAt () {
      return this.item.updatedAt ? new Date(this.item.updatedAt) : null
    },
    deletedAt () {
      return this.item.deletedAt ? new Date(this.item.deletedAt) : null
    },
    expiredAt () {
      return this.item.expireAt && !this.item.deletedAt ? new Date(this.item.expireAt) : null
    },
    location () {
      return _.get(this.item, 'location')
    },
    objectives () {
      return _.get(this.item, 'objectives')
    }
  },
  methods: {
    formatDate (date) {
      return date.toLocaleString(kCoreUtils.getLocale(),
        { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    },
    onLocationTriggered () {
      this.$refs.locationPopup.toggle()
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-history-entry'] = this.$load('collection/KHistoryEntry')
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-chips-pane'] = this.$load('frame/KChipsPane')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
  }
}
</script>
