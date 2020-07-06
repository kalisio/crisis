module.exports = [{
  target: '#events',
  content: 'tours.context.EVENTS_LABEL',
  link: 'tours.context.EVENTS_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'events-activity' }
  }
}, {
  target: '#event-templates',
  content: 'tours.context.TEMPLATES_LABEL',
  link: 'tours.context.TEMPLATES_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'event-templates-activity' }
  }
}, {
  target: '#app-bar-actions',
  content: 'tours.context.APP_BAR_ACTIONS_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#app-bar-overflow-menu',
  content: 'tours.context.OVERFLOW_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#app-bar-overflow-menu',
    clickDelay: 500,
    clickOnPrevious: '#app-bar-overflow-menu',
    previousDelay: 500
  }
}, {
  target: '#members',
  content: 'tours.context.MEMBERS_LABEL',
  link: 'tours.context.MEMBERS_LINK_LABEL',
  params: {
    placement: 'left',
    route: { name: 'members-activity' }
  }
}, {
  target: '#groups',
  content: 'tours.context.GROUPS_LABEL',
  link: 'tours.context.GROUPS_LINK_LABEL',
  params: {
    placement: 'left',
    route: { name: 'groups-activity' }
  }
}, {
  target: '#settings',
  content: 'tours.context.SETTINGS_LABEL',
  link: 'tours.context.SETTINGS_LINK_LABEL',
  params: {
    placement: 'left',
    route: { name: 'organisation-settings-activity' }
  }
}]
