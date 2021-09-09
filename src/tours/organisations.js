module.exports = [{
  target: '#organisations',
  title: 'tours.organisations.ORGANISATIONS_LABEL',
  content: 'tours.organisations.ORGANISATION_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-organisation',
  content: 'tours.organisations.SEARCH_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#organisation-sorter',
  title: 'tours.organisations.SORT_LABEL',
  params: {
    placement: 'left',
    clickOn: '#organisation-sorter',
    clickDelay: 500,
    clickOnNext: '#organisation-sorter',
    clickOnPrevious: '#organisation-sorter'
  }
}, {
  target: '#create-organisation',
  title: 'tours.organisations.NEW_ORGANISATION_LABEL',
  link: 'tours.organisations.NEW_ORGANISATION_LINK_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    route: { name: 'create-organisation' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.organisations.ORGANISATION_CARD_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#organisation-events',
  content: 'tours.organisations.EVENTS_LABEL',
  link: 'tours.organisations.EVENTS_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#organisation-events'
  }
}, {
  target: '#organisation-catalog',
  content: 'tours.organisations.CATALOG_LABEL',
  link: 'tours.organisations.CATALOG_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#organisation-catalog'
  }
}, {
  target: '#organisation-archived-events',
  content: 'tours.organisations.ARCHIVED_EVENTS_LABEL',
  link: 'tours.organisations.ARCHIVED_EVENTS_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#organisation-archived-events'
  }
}, {
  target: '#expand-action',
  content: 'tours.organisations.MANAGEMENT_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#expand-action',
    clickOnPrevious: '#expand-action'
  }
}, {
  target: '#organisation-members',
  content: 'tours.organisations.MEMBERS_LABEL',
  link: 'tours.organisations.MEMBERS_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#organisation-members'
  }
}, {
  target: '#organisation-tags',
  content: 'tours.organisations.TAGS_LABEL',
  link: 'tours.organisations.TAGS_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#organisation-tags'
  }
}, {
  target: '#organisation-groups',
  content: 'tours.organisations.GROUPS_LABEL',
  link: 'tours.organisations.GROUPS_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#organisation-groups'
  }
}, {
  target: '#organisation-event-templates',
  content: 'tours.organisations.EVENT_TEMPLATES_LABEL',
  link: 'tours.organisations.EVENT_TEMPLATES_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#organisation-event-templates'
  }
}, {
  target: '#organisation-plan-templates',
  content: 'tours.organisations.PLAN_TEMPLATES_LABEL',
  link: 'tours.organisations.PLAN_TEMPLATES_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#organisation-plan-templates'
  }
}, {
  target: '#edit-billing',
  content: 'tours.organisations.BILLING_LABEL',
  link: 'tours.organisations.BILLING_LINK_LABEL',
  params: {
    placement: 'top',
    clickOnLink: '#edit-billing'
  }
}, {
  target: '#edit-item-description',
  content: 'tours.organisations.DESCRIPTION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-item-header',
  content: 'tours.organisations.SETTINGS_LABEL',
  link: 'tours.organisations.SETTINGS_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#edit-item-header'
  }
}, {
  target: '#remove-item-header',
  title: 'tours.organisations.REMOVE_ORGANISATION_LABEL',
  content: 'tours.organisations.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'bottom'
  }
}]
