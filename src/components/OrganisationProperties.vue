<template>
  <div class="q-pa-md column q-gutter-md">
    <!-- 
      Properties editor
     -->  
    <k-editor service="organisations" :objectId="context._id" @applied="onApplied" />
    <!-- 
      Subsription pages links
     -->  
    <q-card>
      <q-card-section class="bg-grey-7 text-white">
        {{ $t('OrganisationProperties.SUBSCRIPTION_PAGES') }}
      </q-card-section>
      <q-card-section>
        <div class="q-pa-sm row justify-between items-center">
          <div class="row q-gutter-sm items-center">
            <q-icon name="las la-link" />
            <span>{{ $t('OrganisationProperties.SUBSCRIPTION_PAGE_LINK')  }}</span>
            <q-tooltip>
              {{ subscribeLink }}
            </q-tooltip>
          </div>
          <q-btn flat round icon="las la-copy" @click="onCopySubscriptionPageLink(subscribeLink)" />
        </div>
        <div class="q-pa-sm row justify-between items-center">
          <div class="row q-gutter-sm items-center">
            <q-icon name="las la-link" />
            <span>{{ $t('OrganisationProperties.UNSUBSCRIPTION_PAGE_LINK')  }}</span>
            <q-tooltip>
              {{ unsubscribeLink }}
            </q-tooltip>
          </div>
          <q-btn flat round icon="las la-copy" @click="onCopySubscriptionPageLink(unsubscribeLink)" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { copyToClipboard } from 'quasar'

export default {
  name: 'organisation-properties',
  computed: {
    subscribeLink () {
      return this.getSubscriptionPageLink('subscribe')
    },
    unsubscribeLink () {
      return this.getSubscriptionPageLink('unsubscribe')
    }
  },
  data () {
    return {
      context: this.$store.get('context')
    }
  },
  methods: {
    getSubscriptionPageLink (page) {
      const contextData = btoa(JSON.stringify({ name: this.context.name }))
      // FIXME: hash ?
      return this.$config('domain') + '/#/' + page + '/' + this.context._id + '/' + contextData
    },
    async onCopySubscriptionPageLink (link) {
      try {
        await copyToClipboard(link)
        this.$toast({ type: 'positive', message: this.$t('OrganisationProperties.PAGE_LINK_COPIED') })
      } catch (_) {
        this.$toast({ type: 'error', message: this.$t('OrganisationProperties.CANNOT_COPY_PAGE_LINK') })
      }
    },
    onApplied (properties) {
      // FIXME:
      this.$store.patch('context', { _id: this.context._id, name: properties.name })
    }
  },
  created () {
    // Load the required componets
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
  }
}
</script>
