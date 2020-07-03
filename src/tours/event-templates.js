module.exports = [{
  target: '#event-templates',
  title: 'tours.event-templates.TEMPLATES_LABEL',
  content: 'tours.event-templates.TEMPLATE_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#app-bar-overflow-menu',
  content: 'tours.event-templates.OVERFLOW_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#app-bar-overflow-menu',
    clickDelay: 500,
    clickOnNext: '#app-bar-overflow-menu',
    nextDelay: 500,
    clickOnPrevious: '#app-bar-overflow-menu',
    previousDelay: 500
  }
}, {
  target: '#search',
  content: 'tours.event-templates.SEARCH_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#fab',
  content: 'tours.event-templates.NEW_TEMPLATE_LABEL',
  link: 'tours.event-templates.CREATE_TEMPLATE_LINK_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    route: { name: 'create-event-template' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.event-templates.TEMPLATE_CARD_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-event-template',
  content: 'tours.event-templates.UPDATE_TEMPLATE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#copy-event-template',
  content: 'tours.event-templates.COPY_TEMPLATE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#card-overflow-menu',
  content: 'tours.event-templates.TEMPLATE_OVERFLOW_MENU_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#card-overflow-menu',
    nextDelay: 500
  }
}, {
  target: '#remove-event-template',
  title: 'tours.event-templates.REMOVE_TEMPLATE_LABEL',
  content: 'tours.event-templates.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left',
    clickOnPrevious: '#card-overflow-menu',
    previousDelay: 500
  }
}]
