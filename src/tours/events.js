module.exports = [{
  target: '#events',
  content: 'tours.events.EVENTS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#overflow-menu-entry',
  content: 'tours.events.OVERFLOW_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#overflow-menu-entry',
    clickDelay: 500
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
  link: 'tours.events.TEMPLATE_LINK_LABEL',
  params: {
    placement: 'left'
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
  target: '#card-overflow-menu',
  content: 'tours.events.EVENT_OVERFLOW_MENU_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#card-overflow-menu',
    nextDelay: 1000
  }
}, {
  target: '#remove-event',
  title: 'tours.events.REMOVE_EVENT_LABEL',
  content: 'tours.events.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'bottom'
  }
}]
