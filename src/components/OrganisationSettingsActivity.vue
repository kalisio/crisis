<template>
  <k-page padding>
    <template v-slot:page-content>
      <div v-if="page === 'properties'">
        <organisation-properties :organisationId="contextId" />
      </div>
      <div v-else-if="page === 'billing'">
        <organisation-billing :objectId="contextId" perspective="billing" />
      </div>
      <div v-else-if="page === 'danger-zone'">
        <k-organisation-dz :objectId="contextId" />
      </div>
      <div v-else>
        <!-- Error -->
      </div>
      <!-- 
        Router view to enable routing to modals
      -->
      <router-view />
    </template>
  </k-page>
</template>

<script>
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'organisation-settings-activity',
  mixins: [kCoreMixins.baseActivity()],
  props: {
    contextId: {
      type: String,
      default: ''
    },
    page: {
      type: String,
      default: ''
    }
  },
  watch: {
    page: function (value) {
      this.setTopPaneMode(value)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['organisation-properties'] = this.$load('OrganisationProperties')
    this.$options.components['organisation-billing'] = this.$load('OrganisationBilling')
    this.$options.components['k-organisation-dz'] = this.$load('team/KOrganisationDZ')
  }
}
</script>