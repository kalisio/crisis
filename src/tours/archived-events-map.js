module.exports = [{
  target: '#by-template',
  title: 'tours.archived-events.BY_TEMPLATE_LABEL',
  content: 'tours.archived-events.BY_TEMPLATE_LAYERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#heatmap-on',
  title: 'tours.archived-events.HEATMAP_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#heatmap-on',
    nextDelay: 500
  }
}, {
  target: '#history-view',
  link: 'tours.archived-events.HISTORY_VIEW_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#heatmap-off',
    previousDelay: 500,
    clickOnLink: '#history-view'
  }
}]
