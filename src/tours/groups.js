module.exports = [{
  target: '#groups',
  title: 'tours.groups.GROUPS_LABEL',
  content: 'tours.groups.GROUP_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#overflow-menu-entry',
  content: 'tours.groups.OVERFLOW_MENU_LABEL',
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
  target: '#fab',
  content: 'tours.groups.NEW_GROUP_LABEL',
  link: 'tours.groups.CREATE_GROUP_LINK_LABEL',
  params: {
    placement: 'left',
    route: { name: 'create-group' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.groups.GROUP_CARD_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#member',
  content: 'tours.groups.GROUP_MEMBERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#manager',
  content: 'tours.groups.GROUP_MANAGERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#owner',
  content: 'tours.groups.GROUP_OWNERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-group',
  content: 'tours.groups.UPDATE_GROUP_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#card-overflow-menu',
  content: 'tours.groups.GROUP_OVERFLOW_MENU_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#card-overflow-menu',
    nextDelay: 500
  }
}, {
  target: '#remove-group',
  title: 'tours.groups.REMOVE_GROUP_LABEL',
  content: 'tours.groups.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left'
  }
}]
