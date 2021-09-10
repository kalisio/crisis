module.exports = [{
  target: '#archived-events',
  title: 'tours.archived-events.HISTORY_LABEL',
  content: 'tours.archived-events.HISTORY_EVENTS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#bottom-opener',
  title: 'tours.archived-events.TIMELINE_LABEL',
  params: {
    placement: 'top',
    hoverClickOnNext: '#bottom-opener'
  }
}, {
  target: '#start-time-action',
  title: 'tours.archived-events.START_TIME_LABEL',
  params: {
    placement: 'top',
    clickDelay: 500,
    clickOnPrevious: '#start-time-action',
    hoverClickOnPrevious: '#bottom-opener',
    previousDelay: 500,
    clickOnNext: '#start-time-action',
    nextDelay: 500
  }
}, {
  target: '#end-time-action',
  title: 'tours.archived-events.END_TIME_LABEL',
  params: {
    placement: 'top',
    clickDelay: 500,
    clickOnPrevious: '#end-time-action',
    previousDelay: 500,
    clickOnNext: '#end-time-action',
    nextDelay: 500
  }
}, {
  target: '#timerange-selector',
  title: 'tours.archived-events.TIMERANGE_LABEL',
  params: {
    placement: 'top',
    clickDelay: 500,
    clickOnPrevious: '#timerange-selector',
    previousDelay: 500,
    clickOnNext: '#timerange-selector',
    nextDelay: 500
  }
}, {
  target: '#history-sort',
  title: 'tours.archived-events.SORT_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#history-sort',
    clickDelay: 1000,
    clickOnPrevious: '#timerange-selector',
    previousDelay: 500
  }
}, {
  target: 'div.q-card.q-card--bordered',
  title: 'tours.archived-events.HISTORY_SCROLL_LABEL',
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
