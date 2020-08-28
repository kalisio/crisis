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
    clickOn: '#settings',
    clickDelay: 500
  }
}, {
  target: '#chart-type',
  title: 'tours.archived-events.CHART_TYPE_LABEL',
  params: {
    placement: 'left'
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
    placement: 'left'
  }
}, {
  target: '#download',
  title: 'tours.archived-events.CHART_DOWNLOAD_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#chart-modal * #close',
  link: 'tours.archived-events.CHART_CLOSE_LABEL',
  params: {
    placement: 'left',
    clickOnLink: '#chart-modal * #close',
    tour: 'archived-events-activity'
  }
}]
