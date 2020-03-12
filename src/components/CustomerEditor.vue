<template>
  <k-modal ref="modal" :title="$t('CustomerEditor.TITLE')" :toolbar="getToolbar()" :buttons="getButtons()" :route="false">
    <div slot="modal-content">
      <div class="column">
        <div>
          <k-form ref="form" :schema="getSchema()" @form-ready="onFormReady"/>
        </div>
        <div>
          <div>&nbsp;</div>
          <p v-html="$t('CustomerEditor.BILLING_METHOD_MESSAGE')" />
          <div v-if="hasCard" class="row no-margin">
            <div class="col-11 self-center">
              <span>&nbsp;</span>
              <q-icon name="credit_card" />
              <span>&nbsp;{{customer.card.brand}}</span>
              <span>&nbsp;XXXX-{{customer.card.last4}}</span>
            </div>
            <div class="col-1">
              <q-btn id="clear-card-button" flat round color="grey-7" @click="onCardCleared">
                <q-icon name="cancel" />
              </q-btn>
            </div>
          </div>
          <div v-else class="row no-margin">
            <div class="col-11 self-center">
              <card class='k-stripe-card'
              :stripe="$config('stripe.secretKey')"
              :options="$config('stripe.options')"
              @change='onCardUpdated' />
            </div>
            <div class="col-1 self-center">
              <q-spinner v-show="isCreatingCard" color="grey-7" size="24px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { QCard, QBtn, QIcon, QSpinner } from 'quasar'
import { Card, createToken } from 'vue-stripe-elements-plus'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'customer-editor',
  components: {
    QCard,
    QBtn,
    QIcon,
    QSpinner,
    Card
  },
  mixins: [
    kCoreMixins.refsResolver(['form'])
  ],
  props: {
    billingObjectId: {
      type: String,
      default: ''
    },
    billingObjectService: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      hasCard: false,
      isCreatingCard: false
    }
  },
  methods: {
    getSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/edit-customer',
        title: 'CustomerEditor.TITLE',
        type: 'object',
        properties: {
          email: {
            type: 'string',
            field: {
              component: 'form/KSelectField',
              helper: 'CustomerEditor.CUSTOMER_EMAIL_FIELD_HELPER',
              type: 'radio',
              options: []
            }
          },
          description: {
            type: 'string',
            field: {
              component: 'form/KTextareaField',
              helper: 'CustomerEditor.CUSTOMER_DESCRIPTION_FIELD_HELPER'
            }
          },
          vatNumber: {
            type: 'string',
            field: {
              component: 'form/KTextField',
              helper: 'CustomerEditor.CUSTOMER_VAT_NUMBER_FIELD_HELPER'
            }
          }
        },
        required: ['email']
      }
    },
    getToolbar () {
      return [
        { name: 'close-action', label: this.$t('CustomerEditor.CLOSE_ACTION'), icon: 'close', handler: () => this.close() }
      ]
    },
    getButtons () {
      return [
        { name: 'update-button', label: this.$t('CustomerEditor.UPDATE_BUTTON'), color: 'primary', handler: () => this.onUpdateClicked() }
      ]
    },
    async open (customer, purchasers) {
      this.customer = Object.assign({
        action: 'customer',
        billingObject: this.billingObjectId,
        billingObjectService: this.billingObjectService,
        billingPerspective: 'billing'
      }, customer)
      if (!_.isNil(this.customer.card)) this.hasCard = true
      this.purchasers = purchasers
      // Open the editor
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
    },
    onFormReady () {
      // Updated the purchasers selection
      this.$refs.form.getField('email').properties.field.options = this.purchasers
      // Fill the editor
      this.$refs.form.fill(this.customer)
    },
    async onUpdateClicked () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        // Update the customer values
        this.customer = Object.assign(this.customer, result.values)
        // Update the customer biling object
        const billingService = this.$api.getService('billing')
        let response = {}
        if (_.isNil(this.customer.stripeId)) {
          response = await billingService.create(this.customer)
        } else {
          response = await billingService.update(this.billingObjectId, this.customer)
        }
        this.$emit('customer-updated', response)
        this.close()
      }
    },
    async onCardUpdated (card) {
      if (card.complete) {
        this.isCreatingCard = true
        const data = await createToken(card)
        if (!_.isNil(data.token)) {
          this.customer.card = {
            last4: data.token.card.last4
          }
          this.customer.token = data.token.id
          this.hasCard = true
        }
        this.isCreatingCard = false
      }
    },
    onCardCleared () {
      _.unset(this.customer, 'card')
      _.unset(this.customer, 'token')
      this.hasCard = false
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
  }
}
</script>

<style>
.k-stripe-card {
  margin: 8px;
}
</style>
