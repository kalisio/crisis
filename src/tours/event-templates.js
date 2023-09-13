module.exports = [{
  target: '#event-templates',
  title: 'tours.event-templates.TEMPLATES_LABEL',
  content: 'tours.event-templates.TEMPLATE_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-event-template',
  content: 'tours.event-templates.SEARCH_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#event-template-sorter',
  title: 'tours.event-templates.SORT_LABEL',
  params: {
    placement: 'left',
    clickOn: '#event-template-sorter',
    clickDelay: 500,
    clickOnNext: '#event-sorter',
    clickOnPrevious: '#event-sorter'
  }
}, {
  target: '#create-event-template',
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
  target: '#edit-item-header',
  content: 'tours.event-templates.UPDATE_TEMPLATE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-item-description',
  title: 'tours.event-templates.UPDATE_DESCRIPTION_LABEL',
  content: 'tours.event-templates.UPDATE_PROPERTIES_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-item-participants',
  content: 'tours.event-templates.EDIT_PARTICIPANTS_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-item-coordinators',
  content: 'tours.event-templates.EDIT_COORDINATORS_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-item-expiryDuration',
  content: 'tours.event-templates.EDIT_EXPIRY_DURATION_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-item-permission',
  content: 'tours.event-templates.EDIT_PERMISSION_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#add-item-workflow',
  title: 'tours.event-templates.ADD_WORKFLOW_LABEL',
  link: 'tours.event-templates.WORKFLOW_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#add-item-workflow'
  }
}, {
  target: '#edit-item-workflow',
  title: 'tours.event-templates.EDIT_WORKFLOW_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#remove-item-workflow',
  title: 'tours.event-templates.REMOVE_WORKFLOW_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#copy-event-template',
  content: 'tours.event-templates.COPY_TEMPLATE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#remove-item-header',
  title: 'tours.event-templates.REMOVE_TEMPLATE_LABEL',
  content: 'tours.event-templates.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#organisation-menu',
  title: 'tours.event-templates.ORGANISATION_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#organisation-avatar',
    clickDelay: 500,
    clickOnPrevious: '#organisation-avatar',
    previousDelay: 500
  }
}]
