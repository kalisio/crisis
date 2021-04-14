<template>
  <k-page padding>
    <template v-slot:page-content>
      <q-tabs v-model="currentTab" inline-label>
        <q-route-tab 
          name="properties" 
          :icon="$q.screen.gt.xs ? 'las la-edit' : ''" 
          :label="$t('OrganisationSettingsActivity.PROPERTIES')"
          :to="{ name: $route.name, params: { contextId: contextId, tab: 'properties' } }" />
        <q-route-tab 
          name="billing" 
          :icon="$q.screen.gt.xs ? 'las la-credit-card' : ''" 
          :label="$t('OrganisationSettingsActivity.SUBSCRIPTIONS')"
          :to="{ name: $route.name, params: { contextId: contextId, tab: 'billing' } }" />
      </q-tabs>
      <q-tab-panels v-model="currentTab" animated>
        <q-tab-panel name="properties">
          <organisation-properties :organisationId="contextId" />
        </q-tab-panel>
        <q-tab-panel name="billing">
          <organisation-billing :objectId="contextId" perspective="billing" />
        </q-tab-panel>
      </q-tab-panels>
    </template>
  </k-page>
</template>

<script>
import { QRouteTab } from 'quasar'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'organisation-settings-activity',
  components: {
    QRouteTab
  },
  mixins: [kCoreMixins.baseActivity()],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    tab: {
      type: String,
      default: 'properties'
    }
  },
  data () {
    return {
      currentTab: 'properties'
    }
  },
  watch: {
    tab: function (value) {
      this.currentTab = value
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['organisation-properties'] = this.$load('OrganisationProperties')
    this.$options.components['organisation-billing'] = this.$load('OrganisationBilling')
  }
}
</script>