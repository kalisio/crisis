module.exports = [{
  target: '#chart',
  title: 'tours.archived-events.CHART_LABEL',
  content: 'tours.archived-events.CHART_SAVE_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#settings',
  title: 'tours.archived-events.CHART_SETTINGS_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#settings',
    nextDelay: 500
  }
}, {
  target: '#chart-type',
  title: 'tours.archived-events.CHART_TYPE_LABEL',
  params: {
    placement: 'left',
    clickOnPrevious: '#close-action',
    previousDelay: 500
  }
}, {
  target: '#count-per-chart',
  title: 'tours.archived-events.CHART_COUNT_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#chart-render',
  title: 'tours.archived-events.CHART_RENDER_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close-action',
    nextDelay: 500
  }
}, {
  target: '#export-data',
  title: 'tours.archived-events.CHART_DOWNLOAD_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#history-view',
  title: 'tours.archived-events.HISTORY_VIEW_LABEL',
  link: 'tours.archived-events.HISTORY_VIEW_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#history-view',
    tour: 'archived-events-activity'
  }
}]
