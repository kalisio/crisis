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
    route: { name: 'events-activity' }
  }
}, {
  target: '#organisation-members',
  content: 'tours.organisations.MEMBERS_LABEL',
  link: 'tours.organisations.MEMBERS_LINK_LABEL',
  params: {
    placement: 'right',
    route: { name: 'members-activity' }
  }
}, {
  target: '#organisation-tags',
  content: 'tours.organisations.TAGS_LABEL',
  link: 'tours.organisations.TAGS_LINK_LABEL',
  params: {
    placement: 'right',
    route: { name: 'tags-activity' }
  }
}, {
  target: '#organisation-groups',
  content: 'tours.organisations.GROUPS_LABEL',
  link: 'tours.organisations.GROUPS_LINK_LABEL',
  params: {
    placement: 'right',
    route: { name: 'groups-activity' }
  }
}, {
  target: '#organisation-event-templates',
  content: 'tours.organisations.TEMPLATES_LABEL',
  link: 'tours.organisations.TEMPLATES_LINK_LABEL',
  params: {
    placement: 'right',
    route: { name: 'event-templates-activity' }
  }
}, {
  target: '#organisation-billing',
  content: 'tours.organisations.SETTINGS_LABEL',
  link: 'tours.organisations.SETTINGS_LINK_LABEL',
  params: {
    placement: 'right',
    route: { name: 'organisation-settings-activity', params: { page: 'billing' } }
  }
}, {
  target: '#edit-organisation',
  content: 'tours.organisations.UPDATE_ORGANISATION_LABEL',
  link: 'tours.organisations.SETTINGS_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'organisation-settings-activity', params: { page: 'properties' } }
  }
}, {
  target: '#remove-organisation',
  title: 'tours.organisations.REMOVE_ORGANISATION_LABEL',
  content: 'tours.organisations.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'bottom'
  }
}]
