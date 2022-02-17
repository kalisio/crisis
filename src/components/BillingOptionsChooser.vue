<template>
  <q-card>
    <q-card-section class="row justify-center">
      <template v-for="(properties, option) in options">
        <div :id="option + '-card'" class="col-xs-12 col-sm-6 col-md-3" :key="option">
          <q-card :class="'q-ma-sm text-white bg-' + properties.color" >
            <q-card-section class="text-center">
              <div class="text-h4">{{$t('options.' + option + '_LABEL')}}</div>
              <br>
              <q-chip square outline text-color="white" class="text-h5">{{$t('options.' + option + '_PRICE')}}</q-chip>
            </q-card-section>
            <q-separator inset />
            <q-card-section class="text-center">
              <q-expansion-item dense :label="$t('options.' + option + '_DESCRIPTION')">
                <div v-html="$t('options.' + option + '_DETAILS')" />
              </q-expansion-item>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
              <div v-if="properties.stripeId">
                <q-btn :id="option + '-action'" dense flat
                  :disable="properties.stripeId && !hasCustomer"
                  :icon="value.includes(option) ? 'las la-check-circle' : ''"
                  @click="onOptionChanged(option, properties)">&nbsp;{{$t(value.includes(option) ? 'OptionsChooser.SUBSCRIBED' : 'OptionsChooser.SELECT')}}
                </q-btn>
                <q-tooltip v-if="properties.stripeId && !hasCustomer">
                  {{$t('OptionsChooser.OPTION_DISABLED_TOOLTIP')}}
                </q-tooltip>
              </div>
              <div v-if="properties.url || properties.route">
                <q-btn :id="option + '-action'" dense flat @click="onOptionClicked(option, properties)">{{$t('OptionsChooser.CLICK')}}</q-btn>
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
  name: 'billing-options-chooser',
  props: {
    billingObjectId: {
      type: String,
      default: ''
    },
    billingObjectService: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      required: true
    },
    value: {
      type: Array,
      default: () => []
    },
    hasCustomer: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onOptionClicked (plan, properties) {
      if (properties.url) {
        openURL(properties.url)
      } else if (properties.route) {
        this.$router.push(properties.route)
      }
    },
    onOptionChanged (option, properties) {
      const isRemoved = this.value.includes(option)
      // Ask confimation
      Dialog.create({
        title: this.$t('OptionsChooser.CONFIRM_DIALOG_TITLE'),
        message: isRemoved
          ? this.$t('OptionsChooser.CONFIRM_DIALOG_UNSUBSCRIBE_MESSAGE', { option: 'options.' + option + '_LABEL' })
          : this.$t('OptionsChooser.CONFIRM_DIALOG_SUBSCRIBE_MESSAGE', { option: 'options.' + option + '_LABEL' }),
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
        if (isRemoved) {
          await billingService.remove(this.billingObjectId, {
            query: {
              action: 'subscription',
              plan: option,
              billingObjectService: this.billingObjectService,
              billingPerspective: 'billing'
            }
          })
          this.$emit('input', this.value.filter(item => item !== option))
        } else {
          await billingService.create({
            action: 'subscription',
            plan: option,
            billingObject: this.billingObjectId,
            billingObjectService: this.billingObjectService,
            billingPerspective: 'billing'
          })
          this.$emit('input', this.value.concat([option]))
        }
      })
    }
  }
}
</script>
