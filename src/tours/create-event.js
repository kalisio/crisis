module.exports = [{
  target: '#name-field',
  content: 'tours.create-event-template.TEMPLATE_NAME_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#close-action',
    previousDelay: 500
  }
}, {
  target: '#icon-chooser',
  content: 'tours.create-event-template.TEMPLATE_ICON_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#icon-chooser',
    nextDelay: 500
  }
}, {
  target: '#icons',
  content: 'tours.create-event-template.SELECT_ICON_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#close-action[1]',
    previousDelay: 500
  }
}, {
  target: '#palette',
  content: 'tours.create-event-template.SELECT_COLOR_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#done-button',
    nextDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.create-event-template.TEMPLATE_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#icon-chooser',
    previousDelay: 500
  }
}, {
  target: '#participants-field',
  title: 'tours.create-event-template.SELECT_PARTICIPANTS_LABEL',
  content: 'tours.create-event-template.PARTICIPANTS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#coordinators-field',
  title: 'tours.create-event-template.SELECT_COORDINATORS_LABEL',
  content: 'tours.create-event-template.COORDINATORS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#layer-field',
  title: 'tours.create-event-template.SELECT_LAYER_LABEL',
  content: 'tours.create-event-template.LAYER_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#apply-button',
  content: 'tours.create-event-template.CREATE_TEMPLATE_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close-action',
    nextDelay: 500
  }
}]
