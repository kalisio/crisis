<template>
  <KModal
    :title="title"
    :buttons="getButtons()"
    :maximized="true"
    v-model="isModalOpened"
  >
    <div class="q-pa-md column q-gutter-md">
      <!--
        Customer information section
      -->
      <KBlock
        id="customer-block"
        :color="customerBlockColor"
        :title="$t('BillingEditor.CUSTOMER_BLOCK_TITLE')"
        :text="customerBlockText"
        :action="updateCustomerAction"
      />
      <CustomerEditor
        id="customer-editor"
        ref="customerEditor"
        @customer-updated="onCustomerUpdated"
        :billingObjectId="objectId"
        billingObjectService="organisations"
      />
      <q-card>
        <q-card-section class="text-grey bg-grey-2">
          {{ $t('BillingEditor.OPTIONS_BLOCK_TITLE') }}
        </q-card-section>
        <!--
          Plan subscription section
        -->
        <q-expansion-item id="basic-plan" header-class="text-primary" group="billing"
        :label="$t('BillingEditor.PLAN_TITLE')" default-opened>
          <BillingSubscriptionChooser
            :billingObjectId="objectId"
            billingObjectService="organisations"
            :quotas="quotas"
            :plans="plans"
            v-model="currentPlan"
            :hasCustomer="customer !== undefined"
          />
        </q-expansion-item>
        <!--
          Options information secion
        -->
        <q-expansion-item id="optional-plans" header-class="text-primary" group="billing"
          :label="$t('BillingEditor.OPTIONS_TITLE')">
          <BillingOptionsChooser
            :billingObjectId="objectId"
            billingObjectService="organisations"
            :quotas="quotas"
            :options="options"
            v-model="currentOptions"
            :hasCustomer="customer !== undefined"
          />
        </q-expansion-item>
      </q-card>
    </div>
  </KModal>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kdkCoreUtils } from '@kalisio/kdk/core.client'
import { colors } from 'quasar'

const { getPaletteColor } = colors

export default {
  name: 'billing-editor',
  components: {
    KBlock: kdkCoreUtils.loadComponent('KBlock'),
    CustomerEditor: kdkCoreUtils.loadComponent('CustomerEditor'),
    BillingSubscriptionChooser: kdkCoreUtils.loadComponent('BillingSubscriptionChooser'),
    BillingOptionsChooser: kdkCoreUtils.loadComponent('BillingOptionsChooser')
  },
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
    updateCustomerAction () {
      return {
        id: 'update-customer',
        label: 'BillingEditor.CUSTOMER_BLOCK_ACTION',
        renderer: 'form-button',
        handler: this.onUpdateCustomer,
        disabled: !this.isUserVerified
      }
    },
    customerBlockColor () {
      if (!this.isUserVerified) return getPaletteColor('negative')
      if (this.customer) return getPaletteColor('positive')
      return getPaletteColor('warning')
    },
    customerBlockText () {
      if (!this.isUserVerified) return this.$t('BillingEditor.CUSTOMER_BLOCK_TEXT_UNVERIFIED_USER')
      if (_.isNil(this.customer)) return this.$t('BillingEditor.CUSTOMER_BLOCK_TEXT_NO_PAYMENT')
      if (_.isNil(this.customer.card)) return this.$t('BillingEditor.CUSTOMER_BLOCK_TEXT_INVOICE_PAYMENT', { email: this.customer.email })
      return this.$t('BillingEditor.CUSTOMER_BLOCK_TEXT_CARD_PAYMENT', { brand: this.customer.card.brand, last4: this.customer.card.last4 })
    }
  },
  methods: {
    getUpdateCustomerAction () {
      return {
        id: 'update-customer',
        label: 'BillingEditor.CUSTOMER_BLOCK_ACTION',
        renderer: 'form-button',
        handler: this.onUpdateCustomer,
        disabled: this.isUserVerified
      }
    },
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
  async created () {
    // Load available plans and Whenever the cabilities are updated, update plans as well
    this.refreshPlans()
    this.$events.on('capabilities-api-changed', this.refreshPlans)
    // Load underlying billing perspective
    const perspective = await this.loadObject()
    this.currentPlan = _.get(perspective, 'billing.subscription.plan')
    this.currentOptions = _.get(perspective, 'billing.options', []).map(option => option.plan)
    this.customer = _.get(perspective, 'billing.customer')
  },
  beforeUnmount () {
    this.$events.off('capabilities-api-changed', this.refreshPlans)
  }
}
</script>
