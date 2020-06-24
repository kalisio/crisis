module.exports = [{
  target: '#app-bar-leading',
  title: 'tours.home.LEADING_LABEL',
  content: 'tours.home.SIDENAV_LABEL',
  params: {
    placement: 'right',
    clickOnNext: '#app-bar-leading',
    nextDelay: 500
  }
}, {
  target: '#logout',
  title: 'tours.home.LOGOUT_LABEL',
  content: 'tours.home.SESSION_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#help',
  content: 'tours.home.HELP_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#about',
  content: 'tours.home.ABOUT_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#about',
    nextDelay: 500
  }
}, {
  target: '#report-bug',
  content: 'tours.home.BUG_LABEL',
  params: {
    placement: 'top',
    clickOnNext: ['#close-action', '#app-bar-leading'],
    clickOnPrevious: ['#close-action', '#app-bar-leading'],
    nextDelay: 500,
    previousDelay: 500
  }
}, {
  target: '#edit-settings',
  content: 'tours.home.SETTINGS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#account',
  content: 'tours.home.ACCOUNT_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'account-activity', params: { perspective: 'profile' } }
  }
}]
