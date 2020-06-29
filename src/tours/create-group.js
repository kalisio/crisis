module.exports = [{
  target: '#name-field',
  content: 'tours.create-group.GROUP_NAME_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#close-action',
    previousDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.create-group.GROUP_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#icon-chooser',
    previousDelay: 500
  }
}, {
  target: '#apply-button',
  content: 'tours.create-group.CREATE_GROUP_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close-action',
    nextDelay: 500
  }
}]
