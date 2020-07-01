module.exports = [{
  target: '#events',
  title: 'tours.events.EVENTS_LABEL',
  content: 'tours.events.EVENT_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#overflow-menu-entry',
  content: 'tours.events.OVERFLOW_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#overflow-menu-entry',
    clickDelay: 500,
    clickOnNext: '#overflow-menu-entry',
    nextDelay: 500,
    clickOnPrevious: '#overflow-menu-entry',
    previousDelay: 500
  }
}, {
  target: '#event-templates',
  content: 'tours.events.TEMPLATES_LABEL',
  link: 'tours.events.TEMPLATE_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'event-templates-activity' }
  }
}, {
  target: '#fab',
  content: 'tours.events.SELECT_TEMPLATE_LABEL',
  link: 'tours.events.CREATE_EVENT_LINK_LABEL',
  params: {
    placement: 'left',
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
    placement: 'left'
  }
}]
