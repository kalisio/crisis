<template>
  <div>
    <div :class="isBillingAvailable() ? '' : 'disabled no-pointer-events'" class="row">
      <q-card class="col" :color="properties.color" :key="plan" v-for="(properties, plan) in plans">     
        <q-card-title class="text-center">
          <h4>{{$t('plans.' + plan + '_LABEL', quotas[plan])}}</h4>
          <h5 slot="subtitle">{{$t('plans.' + plan + '_PRICE', quotas[plan])}}</h5>
        </q-card-title>
        <q-card-separator inset />
        <q-card-main class="text-center">
          <div v-html="$t('plans.' + plan + '_DESCRIPTION', quotas[plan])" />
        </q-card-main>
        <q-card-separator inset />
        <q-card-main>
          <div v-html="$t('plans.' + plan + '_DETAILS', quotas[plan])" />
        </q-card-main>
        <q-card-separator />
          <q-card-actions align="end">
            <div v-if="properties.url || properties.route">
              <q-btn flat @click="onSelectPlan(plan, properties)">{{$t('OrganisationBilling.SELECT')}}</q-btn>
            </div>
            <div v-else>
              <q-btn v-show="currentPlan !== plan" flat @click="onSelectPlan(plan, properties)">{{$t('OrganisationBilling.SELECT')}}</q-btn>
              <q-btn v-show="currentPlan === plan" flat disable>{{$t('OrganisationBilling.CURRENT_PLAN')}}</q-btn>
            </div>
          </q-card-actions>
      </q-card>
    </div>
    <k-editor ref="editor" :class="isBillingAvailable() ? '' : 'disabled no-pointer-events'" service="organisations" :objectId="objectId" perspective="billing" @editor-ready="onEditorReady" @field-changed="onFieldChanged" />
  </div>
</template>

<script>
import _ from 'lodash'
import { Events, openURL, QCard, QCardTitle, QCardActions, QCardSeparator, QCardMain, QCardMedia, QBtn, QIcon } from 'quasar'

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
    QIcon
  },
  props: {
    objectId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      plans: {},
      currentPlan: ''
    }
  },
  methods: {
    onUpdatePayment () {
      this.$refs.paymentEditor.open()
    },
    onSelectPlan (plan, properties) {
      // Open information link
      if (properties.url) {
        openURL(properties.url)
      } else if (properties.route) {
        this.$router.push(properties.route)
      } else {
        // Update plan in place in editor object
        this.currentPlan = plan
        _.set(this.editor._object, 'billing.plan', plan)
        this.editor.fillEditor()
      }
    },
    onEditorReady (editor) {
      this.editor = editor
      this.currentPlan = _.get(this.editor.getObject(), 'billing.plan', '')
    },
    onFieldChanged (field, value) {
      if (field === 'plan') {
        this.currentPlan = value
      }
    },
    refreshPlans () {
      this.plans = this.$store.get('capabilities.api.plans', {})
      this.quotas = this.$store.get('capabilities.api.quotas', {})
    },
    onBillingRequest (plan, properties) {
      // Open information link
      if (properties.url) {
        openURL(properties.url)
      } else if (properties.route) {
        this.$router.push(properties.route)
      } else {
        // Update plan in place in editor object
        this.currentPlan = plan
        _.set(this.editor._object, 'billing.plan', plan)
        this.editor.fillEditor()
      }
    },
    isBillingAvailable () {
      return this.$config('domain', '').includes('localhost')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
    this.$options.components['k-payment-editor'] = this.$load('KPaymentEditor')
    this.refreshPlans()
    // Whenever the cabilities are updated, update plans as well
    Events.$on('capabilities-api-changed', this.refreshPlans)
  },
  beforeDestroy () {
    Events.$off('capabilities-api-changed', this.refreshPlans)
  }
}
</script>