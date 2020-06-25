module.exports = [{
  target: '#event-templates',
  content: 'tours.events.TEMPLATE_TAB_LABEL',
  link: 'tours.events.TEMPLATE_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'event-templates-activity' }
  }
}, {
  target: '#fab',
  content: 'tours.events.SELECT_TEMPLATE_LABEL',
  params: {
    placement: 'left'
  }
}]
