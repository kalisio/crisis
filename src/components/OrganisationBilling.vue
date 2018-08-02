<template>
  <div>
    <!-- 
      Customer information secion
     -->    
    <k-block
      :color="customerBlockColor" 
      :title="$t('OrganisationBilling.CUSTOMER_BLOCK_TITLE')"
      :text="customerBlockText"
      :action="$t('OrganisationBilling.CUSTOMER_BLOCK_ACTION')"
      @action-triggered="onUpdateCustomer" />
    <k-customer-editor ref="customerEditor" @customer-updated="onCustomerUpdated" :billingObjectId="objectId" billingObjectService="organisations" />
    <!-- 
      Plan subscription section 
    -->
    <div class="row">
      <template v-for="(properties, plan) in plans">
        <div class="col-xs-12 col-sm-6 col-md-6 col-lg-3 col-xl-3" :key="plan">
          <q-card :color="properties.color" >     
            <q-card-title class="text-center">
              <h4>{{$t('plans.' + plan + '_LABEL', quotas[plan])}}</h4>
              <h5 slot="subtitle">{{$t('plans.' + plan + '_PRICE', quotas[plan])}}</h5>
            </q-card-title>
            <q-card-separator inset />
            <q-card-main class="text-center">
              <q-collapsible :label="$t('plans.' + plan + '_DESCRIPTION', quotas[plan])">
                <div v-html="$t('plans.' + plan + '_DETAILS', quotas[plan])" />
              </q-collapsible>
            </q-card-main>
            <q-card-separator />
            <q-card-actions align="end">
              <div v-if="properties.url || properties.route">
                <q-btn flat @click="onSelectPlan(plan, properties)">{{$t('OrganisationBilling.CLICK')}}</q-btn>
              </div>
              <div v-else>
                <q-btn v-show="plan !== currentPlan" flat :disable="properties.subscription && !customer" @click="onSelectPlan(plan, properties)">{{$t('OrganisationBilling.SELECT')}}
                  <q-tooltip v-if="properties.subscription && !customer">
                    {{$t('OrganisationBilling.PLAN_DISABLED_TOOLTIP')}}
                  </q-tooltip>
                </q-btn>
                <q-btn v-show="plan === currentPlan" flat disable>{{$t('OrganisationBilling.CURRENT_PLAN')}}</q-btn>
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { Events, openURL, QCard, QCardTitle, QCardActions, QCardSeparator, QCardMain, QCardMedia, QBtn, QIcon, QCollapsible, Dialog, QTooltip } from 'quasar'
import { mixins as kCoreMixins } from 'kCore/client'

export default {
  name: 'organisation-billing',
  components: {
    QCard,
    QCardTitle,
    QCardActions,
    QCardSeparator,
    QCardMain,
    QCardMedia,
    QBtn,
    QIcon,
    QCollapsible,
    Dialog,
    QTooltip
  },
  mixins: [
    kCoreMixins.objectProxy
  ],
  computed: {
    customerBlockColor () {
      if (this.customer) return 'grey'
      return 'orange'
    },
    customerBlockText () {
      if (_.isNil(this.customer)) return this.$t('OrganisationBilling.CUSTOMER_BLOCK_TEXT_NO_PAYMENT')
      if (_.isNil(this.customer.card)) return this.$t('OrganisationBilling.CUSTOMER_BLOCK_TEXT_INVOICE_PAYMENT', {email: this.customer.email})
      return this.$t('OrganisationBilling.CUSTOMER_BLOCK_TEXT_CARD_PAYMENT', {brand: this.customer.card.brand, last4: this.customer.card.last4})
    }
  },
  data () {
    return {
      plans: {},
      currentPlan: '',
      customer: null,
      subscription: null
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
    onUpdateCustomer () {
      let customer = this.customer
      if (_.isNil(customer)) {
        customer = {
          email: this.$store.get('user.description'),
          description: this.$store.get('context.name')
        }
      }
      this.$refs.customerEditor.open(customer)
    },
    onCustomerUpdated (customer) {
      this.customer = customer
    },
    onSelectPlan (plan, properties) {
      if (properties.url) {
        openURL(properties.url)
      } else if (properties.route) {
        this.$router.push(properties.route)
      } else {
        // Ask confimation
        Dialog.create({
          title: this.$t('OrganisationBilling.CONFIRM_DIALOG_TITLE'),
          message: this.$t('OrganisationBilling.CONFIRM_DIALOG_MESSAGE', { plan: 'plans.' + plan + '_LABEL' }),
          buttons: [
            {
              label: 'Ok',
              handler: async () => {
                const billingService = this.$api.getService('billing')
                // Stop the current subscription if needed 
                if (!_.isNil(this.subscription)) {
                  await billingService.remove(this.subscription.id, {
                    query: {
                      action: 'subscription',
                      billingObjectId: this.objectId,
                      billingObjectService: 'organisations'
                    }
                  })
                  this.subscription = null
                }
                // Create a new subscription if needed
                if (!_.isNil(properties.subscription)) {
                  let billingMethod = 'send_invoice'
                  if (!_.isNil(this.customer.card)) billingMethod = 'charge_automatically'
                  this.subscription = await billingService.create({
                    action: 'subscription',
                    customerId: this.customer.id,
                    planId: properties.subscription,
                    billing: billingMethod,
                    billingObjectId: this.objectId,
                    billingObjectService: 'organisations'
                  })
                } 
                // Patch the perspective
                await this.loadService().patch(this.objectId, { 'billing.plan': plan })
                this.currentPlan = plan
              }    
            },
            'Cancel'
          ]
        })
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-block'] = this.$load('frame/KBlock')
    this.$options.components['k-customer-editor'] = this.$load('KCustomerEditor')
    // Load available plans
    this.refreshPlans()
    // Whenever the cabilities are updated, update plans as well
    Events.$on('capabilities-api-changed', this.refreshPlans)
    // Load underlying billing perspective
     this.loadObject().then(perspective => {
      this.currentPlan = perspective.billing.plan
      this.customer = perspective.billing.customer
      this.subscription = perspective.billing.subscription
    })
  },
  beforeDestroy () {
    Events.$off('capabilities-api-changed', this.refreshPlans)
  }
}
</script>