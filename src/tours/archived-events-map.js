module.exports = [{
  target: '#by-template',
  title: 'tours.archived-events.BY_TEMPLATE_LABEL',
  content: 'tours.archived-events.BY_TEMPLATE_LAYERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#heatmap',
  title: 'tours.archived-events.HEATMAP_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#heatmap',
    clickDelay: 500,
    clickOnNext: '#heatmap',
    nextDelay: 500,
    clickOnPrevious: '#heatmap',
    previousDelay: 500
  }
}, {
  target: '#export-data',
  title: 'tours.archived-events.MAP_DOWNLOAD_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#history-view',
  title: 'tours.archived-events.HISTORY_VIEW_LABEL',
  link: 'tours.archived-events.HISTORY_VIEW_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#history-view'
  }
}, {
  target: '#chart-view',
  title: 'tours.archived-events.CHART_VIEW_LABEL',
  link: 'tours.archived-events.CHART_VIEW_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#chart-view',
    tour: 'archived-events-activity/chart'
  }
}]
