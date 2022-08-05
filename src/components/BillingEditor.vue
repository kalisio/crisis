<template>
  <k-modal
    :title="title"
    :buttons="getButtons()"
    :maximized="true"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
  >
    <div class="q-pa-md column q-gutter-md">
      <!--
        Customer information section
      -->
      <k-block
        id="customer-block"
        :color="customerBlockColor"
        :title="$t('BillingEditor.CUSTOMER_BLOCK_TITLE')"
        :text="customerBlockText"
        :action="$t('BillingEditor.CUSTOMER_BLOCK_ACTION')"
        :disabled="!isUserVerified"
        @action-triggered="onUpdateCustomer" />
      <customer-editor
        id="customer-editor"
        ref="customerEditor"
        @customer-updated="onCustomerUpdated"
        :billingObjectId="objectId"
        billingObjectService="organisations" />
      <q-card>
        <q-card-section class="text-grey bg-grey-2">
          {{$t('BillingEditor.OPTIONS_BLOCK_TITLE')}}
        </q-card-section>
        <!--
          Plan subscription section
        -->
        <q-expansion-item id="basic-plan" header-class="text-primary" group="billing"
        :label="$t('BillingEditor.PLAN_TITLE')" default-opened>
          <billing-subscription-chooser
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
        <q-expansion-item id="optional-plans" header-class="text-primary" group="billing"
          :label="$t('BillingEditor.OPTIONS_TITLE')">
          <billing-options-chooser
          :billingObjectId="objectId"
          billingObjectService="organisations"
          :quotas="quotas"
          :options="options"
          v-model="currentOptions"
          :hasCustomer="customer !== undefined" />
        </q-expansion-item>
      </q-card>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'billing-editor',
  mixins: [
    kCoreMixins.baseModal,
    kCoreMixins.objectProxy
  ],
  props: {
    title: {
      type: String,
      default: ''
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
  computed: {
    customerBlockColor () {
      if (!this.isUserVerified) return 'red'
      if (this.customer) return 'grey'
      return 'orange'
    },
    customerBlockText () {
      if (!this.isUserVerified) return this.$t('BillingEditor.CUSTOMER_BLOCK_TEXT_UNVERIFIED_USER')
      if (_.isNil(this.customer)) return this.$t('BillingEditor.CUSTOMER_BLOCK_TEXT_NO_PAYMENT')
      if (_.isNil(this.customer.card)) return this.$t('BillingEditor.CUSTOMER_BLOCK_TEXT_INVOICE_PAYMENT', { email: this.customer.email })
      return this.$t('BillingEditor.CUSTOMER_BLOCK_TEXT_CARD_PAYMENT', { brand: this.customer.card.brand, last4: this.customer.card.last4 })
    }
  },
  methods: {
    getButtons () {
      return [{
        id: 'close-button', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeModal()
      }]
    },
    getService () {
      return this.$api.getService('organisations')
    },
    refreshPlans () {
      this.plans = this.$store.get('capabilities.api.plans', {})
      this.options = this.$store.get('capabilities.api.options', {})
      this.quotas = this.$store.get('capabilities.api.quotas', {})
    },
    async getAvailablePurchasers () {
      const usersService = this.$api.getService('users')
      const results = await usersService.find({
        query: {
          'organisations._id': this.$store.get('context._id'),
          'organisations.permissions': 'owner',
          isVerified: true,
          $select: ['profile', 'email']
        }
      })
      const purchasers = results.data.map(result => {
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
      const availablePurchasers = await this.getAvailablePurchasers()
      this.$refs.customerEditor.open(customer, availablePurchasers)
    },
    onCustomerUpdated (customer) {
      this.customer = customer
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-block'] = this.$load('frame/KBlock')
    this.$options.components['customer-editor'] = this.$load('CustomerEditor')
    this.$options.components['billing-subscription-chooser'] = this.$load('BillingSubscriptionChooser')
    this.$options.components['billing-options-chooser'] = this.$load('BillingOptionsChooser')
  },
  async created () {
    // Load available plans and Whenever the cabilities are updated, update plans as well
    this.refreshPlans()
    this.$events.$on('capabilities-api-changed', this.refreshPlans)
    // Load underlying billing perspective
    const perspective = await this.loadObject()
    this.currentPlan = _.get(perspective, 'billing.subscription.plan')
    this.currentOptions = _.get(perspective, 'billing.options', []).map(option => option.plan)
    this.customer = _.get(perspective, 'billing.customer')
  },
  beforeUnmount () {
    this.$events.$off('capabilities-api-changed', this.refreshPlans)
  }
}
</script>
