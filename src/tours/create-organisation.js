module.exports = [{
  target: '#name-field',
  content: 'tours.create-organisation.ORGANISATION_NAME_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#close',
    previousDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.create-organisation.ORGANISATION_DESCRIPTION_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#apply-button',
  content: 'tours.create-organisation.CREATE_ORGANISATION_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close',
    nextDelay: 500
  }
}]
