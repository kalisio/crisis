module.exports = [{
  target: '#plan-templates',
  title: 'tours.plan-templates.TEMPLATES_LABEL',
  content: 'tours.plan-templates.TEMPLATE_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-event-template',
  content: 'tours.plan-templates.SEARCH_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#event-template-sorter',
  title: 'tours.plan-templates.SORT_LABEL',
  params: {
    placement: 'left',
    clickOn: '#event-template-sorter',
    clickDelay: 500,
    clickOnNext: '#plan-sorter',
    clickOnPrevious: '#plan-sorter'
  }
}, {
  target: '#create-plan-template',
  content: 'tours.plan-templates.NEW_TEMPLATE_LABEL',
  link: 'tours.plan-templates.CREATE_TEMPLATE_LINK_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    route: { name: 'create-plan-template' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.plan-templates.TEMPLATE_CARD_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-item-header',
  content: 'tours.plan-templates.UPDATE_TEMPLATE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-item-description',
  title: 'tours.plan-templates.UPDATE_DESCRIPTION_LABEL',
  content: 'tours.plan-templates.UPDATE_PROPERTIES_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-objectives',
  title: 'tours.plan-templates.OBJECTIVES_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-item-coordinators',
  title: 'tours.plan-templates.EDIT_COORDINATORS_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-item-permission',
  title: 'tours.plan-templates.EDIT_PERMISSION_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#copy-plan-template',
  content: 'tours.plan-templates.COPY_TEMPLATE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#remove-item-header',
  title: 'tours.plan-templates.REMOVE_TEMPLATE_LABEL',
  content: 'tours.plan-templates.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#organisation-menu',
  title: 'tours.plan-templates.ORGANISATION_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#organisation-avatar',
    clickDelay: 500,
    clickOnPrevious: '#organisation-avatar',
    previousDelay: 500
  }
}]
