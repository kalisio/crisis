module.exports = [{
  target: '#plans',
  title: 'tours.plans.PLANS_LABEL',
  content: 'tours.plans.PLAN_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-plan',
  content: 'tours.plans.SEARCH_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#plan-sorter',
  title: 'tours.plans.SORT_LABEL',
  params: {
    placement: 'left',
    clickOn: '#plan-sorter',
    clickDelay: 500,
    clickOnNext: '#plan-sorter',
    clickOnPrevious: '#plan-sorter'
  }
}, {
  target: '#top-pane',
  content: 'tours.plans.TEMPLATES_LABEL',
  link: 'tours.plans.TEMPLATES_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'plan-templates-activity' }
  }
}, {
  target: '#fab',
  content: 'tours.plans.SELECT_TEMPLATE_LABEL',
  link: 'tours.plans.CREATE_PLAN_LINK_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    route: { name: 'create-plan' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.plans.PLAN_CARD_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#edit-item-header',
  content: 'tours.plans.UPDATE_PLAN_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-item-description',
  title: 'tours.plans.UPDATE_DESCRIPTION_LABEL',
  content: 'tours.plans.UPDATE_PROPERTIES_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-objectives',
  content: 'tours.plans.UPDATE_OBJECTIVES_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-item-location',
  content: 'tours.plans.UPDATE_LOCATION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-item-coordinators',
  content: 'tours.plans.UPDATE_COORDINATORS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#plan-events',
  content: 'tours.plans.EVENTS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#remove-item-header',
  title: 'tours.plans.REMOVE_PLAN_LABEL',
  content: 'tours.plans.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#organisation-menu',
  title: 'tours.plans.ORGANISATION_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#organisation-avatar',
    clickDelay: 500,
    clickOnPrevious: '#organisation-avatar',
    previousDelay: 500
  }
}]
