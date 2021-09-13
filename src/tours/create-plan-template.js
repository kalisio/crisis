module.exports = [{
  target: '#name-field',
  content: 'tours.create-plan-template.TEMPLATE_NAME_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#choosed-icon',
  content: 'tours.create-plan-template.TEMPLATE_ICON_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#icon-chooser-button',
    nextDelay: 500
  }
}, {
  target: '#icons',
  content: 'tours.create-plan-template.SELECT_ICON_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#done-button',
    previousDelay: 500
  }
}, {
  target: '#palette',
  content: 'tours.create-plan-template.SELECT_COLOR_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#done-button',
    nextDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.create-plan-template.TEMPLATE_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#choosed-icon',
    previousDelay: 500
  }
}, {
  target: '#participants-field',
  title: 'tours.create-plan-template.SELECT_PARTICIPANTS_LABEL',
  content: 'tours.create-plan-template.PARTICIPANTS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#coordinators-field',
  title: 'tours.create-plan-template.SELECT_COORDINATORS_LABEL',
  content: 'tours.create-plan-template.COORDINATORS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#expiryDuration-field',
  content: 'tours.create-plan-template.EXPIRY_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#permission-field',
  content: 'tours.create-plan-template.PERMISSION_LABEL',
  params: {
    placement: 'top'
  }
}/*, {
  target: '#layer-field',
  title: 'tours.create-plan-template.SELECT_LAYER_LABEL',
  content: 'tours.create-plan-template.LAYER_LABEL',
  params: {
    placement: 'top'
  }
}*/
, {
  target: '#apply-button',
  content: 'tours.create-plan-template.CREATE_TEMPLATE_LABEL',
  params: {
    placement: 'left'
  }
}]
