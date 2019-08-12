<template>
  <q-page padding>
    <div v-if="perspective === 'properties'">
      <k-editor service="organisations" :objectId="contextId" />
    </div>
    <div v-else-if="perspective === 'billing'">
      <organisation-billing :objectId="contextId" perspective="billing" />
    </div>
    <div v-else-if="perspective === 'danger-zone'">
      <k-organisation-dz :objectId="contextId" />
    </div>
    <div v-else>
      <!-- Error -->
    </div>
    <!-- 
      Router view to enable routing to modals
    -->
    <router-view :router="router()"></router-view>
  </q-page>
</template>

<script>
import { mixins as kCoreMixins } from '@kalisio/kdk-core/client'

export default {
  name: 'organisation-settings-activity',
  mixins: [kCoreMixins.baseActivity],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    perspective: {
      type: String,
      default: ''
    }
  },
  methods: {
    router () {
      return {
        onApply: { name: 'organisation-settings-activity', params: { contextId: this.contextId, perspective: 'billing' } },
        onDismiss: { name: 'organisation-settings-activity', params: { contextId: this.contextId, perspective: 'billing' } }
      }
    },
    refreshActivity () {
      this.clearActivity()
      this.setTitle(this.$store.get('context.name'))
      // Tabbar actions
      if (this.$can('update', 'organisations', null, { _id: this.contextId })) {
        this.registerTabAction({
          name: 'properties',
          label: this.$t('OrganisationSettingsActivity.PROPERTIES_LABEL'),
          icon: 'description',
          route: { name: 'organisation-settings-activity',
            params: { contextId: this.contextId, perspective: 'properties' },
            default: this.perspective === 'properties' }
        })
      }
      if (this.$can('update', 'billing', null, { billingObject: this.contextId })) {
        this.registerTabAction({
          name: 'billing',
          label: this.$t('OrganisationSettingsActivity.BILLING_LABEL'),
          icon: 'credit_card',
          route: { name: 'organisation-settings-activity',
            params: { contextId: this.contextId, perspective: 'billing' },
            default: this.perspective === 'billing' }
        })
      }
      if (this.$can('remove', 'organisations', null, { _id: this.contextId })) {
        this.registerTabAction({
          name: 'danger-zone',
          label: this.$t('OrganisationSettingsActivity.DANGER_ZONE_LABEL'),
          icon: 'warning',
          route: { name: 'organisation-settings-activity',
            params: { contextId: this.contextId, perspective: 'danger-zone' },
            default: this.perspective === 'danger-zone' }
        })
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
    this.$options.components['organisation-billing'] = this.$load('OrganisationBilling')
    this.$options.components['k-organisation-dz'] = this.$load('KOrganisationDZ')
  }
}
</script>