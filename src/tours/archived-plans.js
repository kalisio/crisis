module.exports = [{
  target: '#archived-plans',
  title: 'tours.archived-plans.HISTORY_LABEL',
  content: 'tours.archived-plans.HISTORY_PLANS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#bottom-opener',
  title: 'tours.archived-plans.TIMELINE_LABEL',
  params: {
    placement: 'top',
    hoverClickOnNext: '#bottom-opener'
  }
}, {
  target: '#start-date',
  title: 'tours.archived-plans.START_TIME_LABEL',
  params: {
    placement: 'top',
    clickOn: '#start-date',
    clickDelay: 500,
    hoverClickOnPrevious: '#bottom-opener',
    previousDelay: 500
  }
}, {
  target: '#end-date',
  title: 'tours.archived-plans.END_TIME_LABEL',
  params: {
    placement: 'top',
    clickOn: '#end-date',
    clickDelay: 500
  }
}, {
  target: '#relative-time-ranges',
  title: 'tours.archived-plans.TIMERANGE_LABEL',
  params: {
    placement: 'top',
    clickOn: '#relative-time-ranges',
    clickDelay: 500,
    clickOnNext: '#bottom-opener',
    nextDelay: 500
  }
}, {
  target: 'div.q-card.q-card--bordered',
  title: 'tours.archived-plans.HISTORY_SCROLL_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered'
  }
}, {
  target: '#organisation-menu',
  title: 'tours.archived-plans.ORGANISATION_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#organisation-avatar',
    clickDelay: 500,
    clickOnPrevious: '#organisation-avatar',
    previousDelay: 500
  }
}]
