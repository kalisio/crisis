module.exports = [{
  target: '#timerange',
  title: 'tours.archived-events.HISTORY_LABEL',
  content: 'tours.archived-events.TIME_RANGE_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#timerange',
    nextDelay: 500
  }
}, {
  target: '#start-time-popup',
  title: 'tours.archived-events.START_TIME_LABEL',
  params: {
    placement: 'left',
    clickOnPrevious: '#timerange',
    previousDelay: 500
  }
}, {
  target: '#end-time-popup',
  title: 'tours.archived-events.END_TIME_LABEL',
  params: {
    placement: 'right',
    clickOnNext: '#timerange',
    nextDelay: 500
  }
}, {
  target: '#history-sort',
  title: 'tours.archived-events.SORT_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#history-sort',
    clickDelay: 1000,
    clickOnPrevious: '#timerange',
    previousDelay: 500
  }
}, {
  target: '#archived-events',
  title: 'tours.archived-events.HISTORY_SCROLL_LABEL',
  content: 'tours.archived-events.HISTORY_EVENTS_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered'
  }
}, {
  target: '#export-data',
  title: 'tours.archived-events.HISTORY_DOWNLOAD_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#map-view',
  title: 'tours.archived-events.MAP_VIEW_LABEL',
  link: 'tours.archived-events.MAP_VIEW_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#map-view',
    tour: 'archived-events-activity/map'
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
