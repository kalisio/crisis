module.exports = [{
  target: '#events',
  title: 'tours.events.EVENTS_LABEL',
  content: 'tours.events.EVENT_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-event',
  content: 'tours.events.SEARCH_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#event-sorter',
  title: 'tours.events.SORT_LABEL',
  params: {
    placement: 'left',
    clickOn: '#event-sorter',
    clickDelay: 500,
    clickOnNext: '#event-sorter',
    clickOnPrevious: '#event-sorter'
  }
}, {
  target: '.q-page',
  content: 'tours.events.TEMPLATES_LABEL',
  link: 'tours.events.TEMPLATES_LINK_LABEL',
  params: {
    placement: 'right',
    route: { name: 'event-templates-activity' }
  }
}, {
  target: '#fab',
  content: 'tours.events.SELECT_TEMPLATE_LABEL',
  link: 'tours.events.CREATE_EVENT_LINK_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    route: { name: 'create-event' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.events.EVENT_CARD_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#follow-up',
  title: 'tours.events.FOLLOW_UP_EVENT_LABEL',
  content: 'tours.events.FOLLOW_UP_ACTION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#capture-photo',
  content: 'tours.events.CAPTURE_PHOTO_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#add-media',
  content: 'tours.events.ADD_MEDIA_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#event-map',
  content: 'tours.events.EVENT_MAP_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-event',
  content: 'tours.events.UPDATE_EVENT_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#remove-event',
  title: 'tours.events.REMOVE_EVENT_LABEL',
  content: 'tours.events.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'bottom'
  }
}]
