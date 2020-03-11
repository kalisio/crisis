<template>
  <div class="column q-gutter-md">
    <!-- 
      Customer information secion
     -->    
    <k-block
      :color="customerBlockColor" 
      :title="$t('OrganisationBilling.CUSTOMER_BLOCK_TITLE')"
      :text="customerBlockText"
      :action="$t('OrganisationBilling.CUSTOMER_BLOCK_ACTION')"
      :disabled="!isUserVerified"
      @action-triggered="onUpdateCustomer" />
    <customer-editor 
      ref="customerEditor" 
      @customer-updated="onCustomerUpdated" 
      :billingObjectId="objectId" 
      billingObjectService="organisations" />
    <!-- 
      Plan subscription section 
    -->
    <plan-chooser 
      :billingObjectId="objectId" 
      billingObjectService="organisations" 
      :quotas="quotas" 
      :plans="plans" 
      v-model="currentPlan" 
      :hasCustomer="customer !== undefined" />
  </div>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk-core/client'

export default {
  name: 'organisation-billing',
  mixins: [
    kCoreMixins.objectProxy
  ],
  computed: {
    customerBlockColor () {
      if (!this.isUserVerified) return 'red'
      if (this.customer) return 'grey'
      return 'orange'
    },
    customerBlockText () {
      if (!this.isUserVerified) return this.$t('OrganisationBilling.CUSTOMER_BLOCK_TEXT_UNVERIFIED_USER')
      if (_.isNil(this.customer)) return this.$t('OrganisationBilling.CUSTOMER_BLOCK_TEXT_NO_PAYMENT')
      if (_.isNil(this.customer.card)) return this.$t('OrganisationBilling.CUSTOMER_BLOCK_TEXT_INVOICE_PAYMENT', {email: this.customer.email})
      return this.$t('OrganisationBilling.CUSTOMER_BLOCK_TEXT_CARD_PAYMENT', {brand: this.customer.card.brand, last4: this.customer.card.last4})
    }
  },
  data () {
    return {
      isUserVerified: this.$store.get('user.isVerified'),
      currentPlan: '',
      customer: undefined
    }
  },
  methods: {
    loadService () {
      return this.$api.getService('organisations')
    },
    refreshPlans () {
      this.plans = this.$store.get('capabilities.api.plans', {})
      this.quotas = this.$store.get('capabilities.api.quotas', {})
    },
    async getAvailablePurchasers () {
      const usersService = this.$api.getService('users')
      let results = await usersService.find({ query: {
        'organisations._id': this.$store.get('context._id'),
        'organisations.permissions': 'owner',
        'isVerified': true,
        '$select': ['profile', 'email']
      }})
      let purchasers = results.data.map(result => {
        return { label: result.profile.name, value: result.email }
      })
      return purchasers
    },
    async onUpdateCustomer () {
      let customer = this.customer
      if (_.isNil(customer)) {
        customer = {
          email: this.$store.get('user.description')
        }
      }
      let availablePurchasers = await this.getAvailablePurchasers()
      this.$refs.customerEditor.open(customer, availablePurchasers)
    },
    onCustomerUpdated (customer) {
      this.customer = customer
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-block'] = this.$load('frame/KBlock')
    this.$options.components['customer-editor'] = this.$load('CustomerEditor')
    this.$options.components['plan-chooser'] = this.$load('PlanChooser')
    // Load available plans and Whenever the cabilities are updated, update plans as well
    this.refreshPlans()
    this.$events.$on('capabilities-api-changed', this.refreshPlans)
    // Load underlying billing perspective
    const perspective = await this.loadObject()
    this.currentPlan = perspective.billing.subscription.plan
    this.customer = perspective.billing.customer
  },
  beforeDestroy () {
    this.$events.$off('capabilities-api-changed', this.refreshPlans)
  }
}
</script>