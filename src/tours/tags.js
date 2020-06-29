module.exports = [{
  target: '#tags',
  title: 'tours.tags.TAGS_LABEL',
  content: 'tours.tags.TAG_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#overflow-menu-entry',
  content: 'tours.tags.OVERFLOW_MENU_LABEL',
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
  target: 'div.q-card.q-card--bordered',
  content: 'tours.tags.TAG_CARD_LABEL',
  link: 'tours.tags.CREATE_TAG_LINK_LABEL',
  params: {
    placement: 'right',
    route: { name: 'members-activity' }
  }
}, {
  target: '#tag-count',
  title: 'tours.tags.TAG_COUNT_LABEL',
  content: 'tours.tags.REMOVE_TAG_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-tag',
  content: 'tours.tags.UPDATE_TAG_LABEL',
  params: {
    placement: 'bottom'
  }
}]
