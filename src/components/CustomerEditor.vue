<template>
  <KModal
    :title="$t('CustomerEditor.TITLE')"
    :buttons="getButtons()"
  >
    <div class="column">
      <div>
        <KForm ref="onFormReferenceCreated" :schema="schema" />
      </div>
      <div>
        <div>&nbsp;</div>
        <p v-html="$t('CustomerEditor.BILLING_METHOD_MESSAGE')" />
        <div v-if="hasCard" class="row no-margin">
          <div class="col-11 self-center">
            <span>&nbsp;</span>
            <q-icon name="las la-credit-card" />
            <span>&nbsp;{{customer.card.brand}}</span>
            <span>&nbsp;XXXX-{{customer.card.last4}}</span>
          </div>
          <div class="col-1">
            <q-btn id="clear-card-button" flat round color="grey-7" @click="onCardCleared">
              <q-icon name="las la-times-circle" />
            </q-btn>
          </div>
        </div>
        <div v-else class="row no-margin">
          <div class="col-11 self-center">
            <!-- TODO 
            card id="payment-card" class='k-stripe-card'
            :stripe="$config('stripe.secretKey')"
            :options="$config('stripe.options')"
            @change='onCardUpdated' 
            /-->
          </div>
          <div class="col-1 self-center">
            <q-spinner v-show="isCreatingCard" color="grey-7" size="24px" />
          </div>
        </div>
      </div>
    </div>
  </KModal>
</template>

<script>
import _ from 'lodash'
// TODO import { Card, createToken } from 'vue-stripe-elements-plus'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  components: {
    // TODO Card
  },
  mixins: [
    kCoreMixins.baseModal,
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
      isCreatingCard: false,
      buttons: [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'update-button', label: this.$t('CustomerEditor.UPDATE_BUTTON'), renderer: 'form-button', color: 'primary', handler: () => this.onUpdateClicked() }
      ],
      schema: {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/edit-customer',
        title: 'CustomerEditor.TITLE',
        type: 'object',
        properties: {
          email: {
            type: 'string',
            field: {
              component: 'form/KSelectField',
              label: 'CustomerEditor.CUSTOMER_EMAIL_FIELD_LABEL',
              type: 'radio',
              options: []
            }
          },
          description: {
            type: 'string',
            field: {
              component: 'form/KTextareaField',
              label: 'CustomerEditor.CUSTOMER_DESCRIPTION_FIELD_LABEL'
            }
          },
          vatNumber: {
            type: 'string',
            field: {
              component: 'form/KTextField',
              label: 'CustomerEditor.CUSTOMER_VAT_NUMBER_FIELD_LABEL'
            }
          }
        },
        required: ['email']
      }
    }
  },
  methods: {
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
      this.openModal()
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
        this.closeModal()
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
  }
}
</script>

<style lang="scss">
  .k-stripe-card {
    margin: 8px;
  }
</style>
