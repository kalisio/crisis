module.exports = [{
  target: '#create-event-template',
  content: 'tours.event-templates.NEW_TEMPLATE_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#create-event-template',
    nextDelay: 500
  }
}, {
  target: '#name-field',
  content: 'tours.event-templates.TEMPLATE_NAME_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#icon-chooser',
  content: 'tours.event-templates.TEMPLATE_ICON_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#icon-chooser',
    nextDelay: 500
  }
}, {
  target: '#icons',
  content: 'tours.event-templates.SELECT_ICON_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#close-action',
    previousDelay: 500
  }
}, {
  target: '#palette',
  content: 'tours.event-templates.SELECT_COLOR_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#done-button',
    nextDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.event-templates.TEMPLATE_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#icon-chooser',
    previousDelay: 500
  }
}]
