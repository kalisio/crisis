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
  target: '#start-date',
  title: 'tours.archived-events.START_DATE_LABEL',
  content: 'tours.archived-events.START_TIME_LABEL',
  params: {
    placement: 'top',
    clickDelay: 500,
    clickOn: '#start-date',
    hoverClickOnPrevious: '#bottom-opener'
  }
}, {
  target: '#end-date',
  title: 'tours.archived-events.END_DATE_LABEL',
  content: 'tours.archived-events.END_TIME_LABEL',
  params: {
    placement: 'top',
    clickDelay: 500,
    clickOn: '#end-date'
  }
}, {
  target: '#relative-time-ranges',
  title: 'tours.archived-events.TIME_RANGES_LABEL',
  params: {
    placement: 'top',
    clickOn: '#relative-time-ranges',
    clickDelay: 500,
    hoverClickOnNext: '#bottom-opener',
    nextDelay: 500
  }
}, {
  target: 'div.q-card.q-card--bordered',
  title: 'tours.archived-events.HISTORY_SCROLL_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    hoverClickOnPrevious: '#bottom-opener',
    previousDelay: 500
  }
}, {
  target: '#export-data',
  title: 'tours.archived-events.HISTORY_DOWNLOAD_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#event-filter',
  title: 'tours.archived-events.HISTORY_FILTER_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#event-filter',
    clickDelay: 500,
    clickOnPrevious: '#event-filter',
    previousDelay: 500,
    clickOnNext: '#event-filter',
    nextDelay: 500
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
}, {
  target: '#organisation-menu',
  title: 'tours.archived-events.ORGANISATION_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#organisation-avatar',
    clickDelay: 500,
    clickOnPrevious: '#organisation-avatar',
    previousDelay: 500
  }
}]
