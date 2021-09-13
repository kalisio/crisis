module.exports = [{
  target: '#customer-block',
  content: 'tours.organisation.CUSTOMER_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#block-action',
  content: 'tours.organisation.PAYMENT_METHOD_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#block-action',
    nextDelay: 1000
  }
}, {
  target: '#email-field',
  content: 'tours.organisation.CUSTOMER_EMAIL_LABEL',
  params: {
    placement: 'left',
    clickOnPrevious: '#close-button[1]',
    previousDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.organisation.INVOICE_DESCRIPTION_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#vatNumber-field',
  content: 'tours.organisation.VAT_NUMBER_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#payment-card',
  content: 'tours.organisation.CARD_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#update-button',
  content: 'tours.organisation.UPDATE_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close-button[1]',
    nextDelay: 500
  }
}, {
  target: '#basic-plan',
  content: 'tours.organisation.BASIC_PLAN_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#basic-plans * i',
    nextDelay: 500,
    clickOnPrevious: ['#basic-plans * i', '#block-action'],
    previousDelay: 500
  }
}, {
  target: '#silver-action',
  content: 'tours.organisation.SILVER_PLAN_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#optional-plans * i',
    nextDelay: 500
  }
}, {
  target: '#optional-plans',
  content: 'tours.organisation.OPTIONAL_PLANS_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#basic-plans * i',
    previousDelay: 500
  }
}, {
  target: '#archiving-action',
  content: 'tours.organisation.ARCHIVING_PLAN_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#catalog-action',
  content: 'tours.organisation.CATALOG_PLAN_LABEL',
  params: {
    placement: 'top'
  }
}]
