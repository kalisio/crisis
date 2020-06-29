module.exports = [{
  target: '#name-field',
  content: 'tours.create-event.EVENT_NAME_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#close-action',
    previousDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.create-event.EVENT_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#icon-chooser',
    previousDelay: 500
  }
}, {
  target: '#location-field',
  content: 'tours.create-event-template.SELECT_LOCATION_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#geolocate',
  content: 'tours.create-event-template.GEOLOCATE_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#show-location-map',
  content: 'tours.create-event-template.SHOW_MAP_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#search-location',
  title: 'tours.create-event-template.SEARCH_LABEL',
  content: 'tours.create-event-template.SEARCH_ADDRESS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#participants-field',
  title: 'tours.create-event.SELECT_PARTICIPANTS_LABEL',
  content: 'tours.create-event-template.PARTICIPANTS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#coordinators-field',
  title: 'tours.create-event.SELECT_COORDINATORS_LABEL',
  content: 'tours.create-event-template.COORDINATORS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#apply-button',
  content: 'tours.create-event.CREATE_EVENT_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close-action',
    nextDelay: 500
  }
}]
