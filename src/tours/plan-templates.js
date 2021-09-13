module.exports = [{
  target: '#plan-templates',
  title: 'tours.plan-templates.TEMPLATES_LABEL',
  content: 'tours.plan-templates.TEMPLATE_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-plan-template',
  content: 'tours.plan-templates.SEARCH_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#plan-template-sorter',
  title: 'tours.plan-templates.SORT_LABEL',
  params: {
    placement: 'left',
    clickOn: '#plan-template-sorter',
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
  target: '#add-item-workflow',
  title: 'tours.plan-templates.ADD_WORKFLOW_LABEL',
  link: 'tours.plan-templates.WORKFLOW_LINK_LABEL',
  params: {
    placement: 'top',
    clickOnLink: '#add-item-workflow'
  }
}, {
  target: '#edit-item-workflow',
  title: 'tours.plan-templates.EDIT_WORKFLOW_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#remove-item-workflow',
  title: 'tours.plan-templates.REMOVE_WORKFLOW_LABEL',
  params: {
    placement: 'top'
  }
}]
