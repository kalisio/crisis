module.exports = [{
  target: '#name-field',
  content: 'tours.create-event.EVENT_NAME_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#description-field',
  content: 'tours.create-event.EVENT_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: 'label[for=location-field]',
  content: 'tours.create-event.LOCATION_LABEL',
  params: {
    placement: 'top',
    clickOnNext: 'div[role=radio][0]',
    nextDelay: 500
  }
}, {
  target: '#search-location',
  title: 'tours.create-event.SEARCH_LABEL',
  content: 'tours.create-event.SEARCH_ADDRESS_LABEL',
  params: {
    placement: 'top',
    clickOnNext: 'div[role=radio][1]',
    nextDelay: 500
  }
}, {
  target: '#show-location-map',
  content: 'tours.create-event.GEOLOCATE_LABEL',
  params: {
    placement: 'top',
    clickOnNext: 'div[role=radio][2]',
    nextDelay: 500,
    clickOnPrevious: 'div[role=radio][0]',
    previousDelay: 500
  }
}, {
  target: '#show-location-map',
  content: 'tours.create-event.SHOW_MAP_LABEL',
  params: {
    placement: 'top',
    clickOnNext: 'div[role=radio][3]',
    nextDelay: 500,
    clickOnPrevious: 'div[role=radio][1]',
    previousDelay: 500
  }
}, {
  target: '#show-location-map',
  content: 'tours.create-event.DRAW_MAP_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: 'div[role=radio][2]',
    previousDelay: 500
  }
}, {
  target: '#participants-field',
  title: 'tours.create-event.SELECT_PARTICIPANTS_LABEL',
  content: 'tours.create-event.PARTICIPANTS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#coordinators-field',
  title: 'tours.create-event.SELECT_COORDINATORS_LABEL',
  content: 'tours.create-event.COORDINATORS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#apply-and-notify-button',
  content: 'tours.create-event.CREATE_EVENT_NOTIFICATION_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#apply-button',
  content: 'tours.create-event.CREATE_EVENT_LABEL',
  params: {
    placement: 'left'
  }
}]
