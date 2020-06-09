<template>
  <div class="q-pa-md column q-gutter-md">
    <!-- 
      Customer information section
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
    <q-card>
      <q-card-section class="text-grey bg-grey-2">
        {{$t('OrganisationBilling.OPTIONS_BLOCK_TITLE')}}
      </q-card-section>
      <!-- 
        Plan subscription section 
      -->
      <q-expansion-item header-class="text-primary" group="billing" :label="$t('OrganisationBilling.PLAN_TITLE')" default-opened>
        <plan-chooser 
          :billingObjectId="objectId" 
          billingObjectService="organisations" 
          :quotas="quotas" 
          :plans="plans" 
          v-model="currentPlan" 
          :hasCustomer="customer !== undefined" />
      </q-expansion-item>
      <!-- 
        Options information secion
       -->    
      <q-expansion-item header-class="text-primary" group="billing" :label="$t('OrganisationBilling.OPTIONS_TITLE')">
        <options-chooser 
        :billingObjectId="objectId" 
        billingObjectService="organisations" 
        :quotas="quotas" 
        :options="options" 
        v-model="currentOptions" 
        :hasCustomer="customer !== undefined" />
      </q-expansion-item>
    </q-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

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
      plans: {},
      quotas: {},
      currentPlan: '',
      currentOptions: [],
      customer: undefined
    }
  },
  methods: {
    loadService () {
      return this.$api.getService('organisations')
    },
    refreshPlans () {
      this.plans = this.$store.get('capabilities.api.plans', {})
      this.options = this.$store.get('capabilities.api.options', {})
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
    this.$options.components['options-chooser'] = this.$load('OptionsChooser')
    // Load available plans and Whenever the cabilities are updated, update plans as well
    this.refreshPlans()
    this.$events.$on('capabilities-api-changed', this.refreshPlans)
    // Load underlying billing perspective
    const perspective = await this.loadObject()
    this.currentPlan = _.get(perspective, 'billing.subscription.plan')
    this.currentOptions = _.get(perspective, 'billing.options', []).map(option => option.plan)
    this.customer = _.get(perspective, 'billing.customer')
  },
  beforeDestroy () {
    this.$events.$off('capabilities-api-changed', this.refreshPlans)
  }
}
</script>