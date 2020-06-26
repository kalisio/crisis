module.exports = [{
  target: '#event-templates',
  content: 'tours.event-templates.TEMPLATES_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#overflow-menu-entry',
  content: 'tours.event-templates.OVERFLOW_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#overflow-menu-entry',
    clickDelay: 500
  }
}, {
  target: '#create-event-template',
  content: 'tours.event-templates.NEW_TEMPLATE_LABEL',
  link: 'tours.event-templates.CREATE_TEMPLATE_LINK_LABEL',
  params: {
    placement: 'left',
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
    placement: 'left',
    clickOnNext: '#card-overflow-menu',
    nextDelay: 500
  }
}, {
  target: '#remove-event-template',
  title: 'tours.event-templates.REMOVE_TEMPLATE_LABEL',
  content: 'tours.event-templates.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'right'
  }
}]
