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
  target: '#search-location',
  title: 'tours.create-plan.SEARCH_LABEL',
  content: 'tours.create-plan.SEARCH_ADDRESS_LABEL',
  params: {
    placement: 'top',
    clickOnNext: 'div[role=radio][1]',
    nextDelay: 500
  }
}, {
  target: '#show-location-map',
  content: 'tours.create-plan.GEOLOCATE_LABEL',
  params: {
    placement: 'top',
    clickOnNext: 'div[role=radio][2]',
    nextDelay: 500,
    clickOnPrevious: 'div[role=radio][0]',
    previousDelay: 500
  }
}, {
  target: '#show-location-map',
  content: 'tours.create-plan.SHOW_MAP_LABEL',
  params: {
    placement: 'top',
    clickOnNext: 'div[role=radio][3]',
    nextDelay: 500,
    clickOnPrevious: 'div[role=radio][1]',
    previousDelay: 500
  }
}, {
  target: '#show-location-map',
  content: 'tours.create-plan.DRAW_MAP_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: 'div[role=radio][2]',
    previousDelay: 500
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
