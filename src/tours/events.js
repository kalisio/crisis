module.exports = [{
  target: '#events',
  title: 'tours.events.EVENTS_LABEL',
  content: 'tours.events.EVENT_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#app-bar-actions',
  content: 'tours.events.APP_BAR_ACTIONS_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#search',
  content: 'tours.events.SEARCH_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#event-templates',
  content: 'tours.events.TEMPLATES_LABEL',
  link: 'tours.events.TEMPLATES_LINK_LABEL',
  params: {
    placement: 'bottom',
    blockOnMiss: '#fab',
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
  target: '#edit-event',
  content: 'tours.events.UPDATE_EVENT_LABEL',
  params: {
    placement: 'bottom'
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
  target: '#card-overflow-menu',
  content: 'tours.events.EVENT_OVERFLOW_MENU_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#card-overflow-menu',
    nextDelay: 500
  }
}, {
  target: '#remove-event',
  title: 'tours.events.REMOVE_EVENT_LABEL',
  content: 'tours.events.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left',
    clickOnPrevious: '#card-overflow-menu',
    previousDelay: 500
  }
}]
