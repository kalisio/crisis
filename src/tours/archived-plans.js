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
  target: '#start-time-action',
  title: 'tours.archived-plans.START_TIME_LABEL',
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
  title: 'tours.archived-plans.END_TIME_LABEL',
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
  title: 'tours.archived-plans.TIMERANGE_LABEL',
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
  title: 'tours.archived-plans.SORT_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#history-sort',
    clickDelay: 1000,
    clickOnPrevious: '#timerange-selector',
    previousDelay: 500
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
