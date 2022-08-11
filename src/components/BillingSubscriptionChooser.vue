<template>
  <q-card>
    <q-card-section class="row justify-center">
      <template v-for="(properties, plan) in plans" :key="plan">
        <div :id="plan + '-card'" class="col-xs-12 col-sm-6 col-md-3">
          <q-card :class="'q-ma-sm text-white bg-' + properties.color">
            <q-card-section class="text-center">
              <div class="text-h5">{{$t('plans.' + plan + '_LABEL')}}</div>
              <br>
              <q-chip square outline text-color="white" class="text-subtitle1 ellipsis">{{$t('plans.' + plan + '_PRICE')}}</q-chip>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="text-center">
              <div class="text-body2" v-html="$t('plans.' + plan + '_DESCRIPTION')" />
            </q-card-section>
            <q-card-section>
              <q-expansion-item class="q-pa-none" :label="$t('SubscriptionChooser.MORE_DETAILS')">
                <div class="text-body2" v-html="$t('plans.' + plan + '_DETAILS', quotas[plan])" />
              </q-expansion-item>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <div v-if="properties.stripeId || properties.default">
                <q-btn :id="plan + '-action'" v-if="plan !== value" dense flat :disable="properties.stripeId && !hasCustomer" @click="onPlanChanged(plan, properties)">{{$t('SubscriptionChooser.SELECT')}}
                </q-btn>
                <q-btn v-else :id="plan + '-action'" icon="las la-check-circle" dense flat disable>&nbsp;{{$t('SubscriptionChooser.CURRENT_PLAN')}}</q-btn>
                <q-tooltip v-if="(plan !== value) && properties.stripeId && !hasCustomer">
                  {{$t('SubscriptionChooser.PLAN_DISABLED_TOOLTIP')}}
                </q-tooltip>
              </div>
              <div v-if="properties.url || properties.route">
                <q-btn :id="plan + '-action'" dense flat @click="onPlanClicked(plan, properties)">{{$t('SubscriptionChooser.CLICK')}}</q-btn>
              </div>
            </q-card-actions>
          </q-card>
        </div>
      </template>
    </q-card-section>
  </q-card>
</template>

<script>
import { openURL, Dialog } from 'quasar'

export default {
  name: 'billing-subscription-chooser',
  props: {
    billingObjectId: {
      type: String,
      default: ''
    },
    billingObjectService: {
      type: String,
      default: ''
    },
    quotas: {
      type: Object,
      required: true
    },
    plans: {
      type: Object,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    hasCustomer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onPlanClicked (plan, properties) {
      if (properties.url) {
        openURL(properties.url)
      } else if (properties.route) {
        this.$router.push(properties.route)
      }
    },
    onPlanChanged (plan, properties) {
      // Ask confimation
      Dialog.create({
        title: this.$t('SubscriptionChooser.CONFIRM_DIALOG_TITLE'),
        message: this.$t('SubscriptionChooser.CONFIRM_DIALOG_MESSAGE', { plan: 'plans.' + plan + '_LABEL' }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(async () => {
        const billingService = this.$api.getService('billing')
        await billingService.update(this.billingObjectId, {
          action: 'subscription',
          plan: plan,
          billingObjectService: this.billingObjectService,
          billingPerspective: 'billing'
        })
        this.$emit('input', plan)
      })
    }
  }
}
</script>
