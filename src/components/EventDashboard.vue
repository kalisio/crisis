<template>
  <k-page padding>
    <template v-slot:page-content>
      <template v-for="org in items">
        <q-list :id="'organisation-' + org._id" :key="org._id" separator>
          <q-item :id="'organisation-name-' + org._id" clickable @click="onSelectOrganisation(org)">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="40px">{{getInitials(org)}}</q-avatar>
            </q-item-section>
            <q-item-section>
              {{ org.name }}
            </q-item-section>
          </q-item>
          <q-item :id="'organisation-grid-' + org._id">
            <q-item-section>
              <k-grid service="events" :renderer="renderer" :contextId="org._id" :base-query="baseQuery" :filter-query="filterQuery" :list-strategy="'smart'" />
            </q-item-section>
          </q-item>
        </q-list>
      </template>
    </template>
  </k-page>
</template>

<script>
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'event-dashboard',
  mixins: [
    kCoreMixins.baseActivity,
    kCoreMixins.baseCollection
  ],
  data () {
    return {
      baseQuery: {
        $sort: {
          updatedAt: -1
        }
      },
      renderer: {
        component: 'EventCard',
        props: {
          options: {
          }
        }
      }
    }
  },
  methods: {
    getInitials (org) {
      return kCoreUtils.getInitials(org.name)
    },
    loadService () {
      return this.$api.getService('organisations')
    },
    getCollectionBaseQuery () {
      return {}
    },
    refreshActivity () {
      this.clearActivity()
      this.refreshCollection()
    },
    checkSingleOrganisation () {
      // When there is a single organisation directly go to the event activity, no need for the dashboard
      if (this.items.length === 1) {
        this.$router.push({ name: 'events-activity', params: { contextId: this.items[0]._id } })
      }
    },
    onSelectOrganisation (org) {
      this.$router.push({ name: 'events-activity', params: { contextId: org._id } })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
    // Used to chec kfor single organisation layout at startup or refresh
    this.$on('collection-refreshed', this.checkSingleOrganisation)
    this.checkSingleOrganisation()
    // Performs geolocation
    this.refreshActivity()
  },
  beforeDestroy () {
    this.$off('collection-refreshed', this.checkSingleOrganisation)
  }
}
</script>

<style>
.organisation-title {
  font-size: 18px;
  font-weight: 400;
  letter-spacing: normal;
  line-height: 2rem
}
</style>
