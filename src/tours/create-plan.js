module.exports = [{
  target: '#name-field',
  content: 'tours.create-plan.PLAN_NAME_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#description-field',
  content: 'tours.create-plan.PLAN_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: 'label[for=location-field]',
  content: 'tours.create-plan.LOCATION_LABEL',
  params: {
    placement: 'top',
    clickOnNext: 'div[role=radio][0]',
    nextDelay: 500
  }
}, {
  target: '#configure',
  title: 'tours.create-plan.CONFIGURE_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#draw',
  content: 'tours.create-plan.DRAW_MAP_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#coordinators-field',
  title: 'tours.create-plan.SELECT_COORDINATORS_LABEL',
  content: 'tours.create-plan.COORDINATORS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#apply-button',
  content: 'tours.create-plan.CREATE_PLAN_LABEL',
  params: {
    placement: 'left'
  }
}]
