module.exports = [{
  target: '#logout',
  title: 'tours.side-nav.LOGOUT_LABEL',
  content: 'tours.side-nav.SESSION_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#manage-account',
  link: 'tours.side-nav.ACCOUNT_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'account-activity', params: { page: 'profile' } }
  }
}, {
  target: '#help',
  link: 'tours.side-nav.HELP_LABEL',
  params: {
    placement: 'top',
    clickOnLink: '#help'
  }
}, {
  target: '#edit-settings',
  content: 'tours.side-nav.SETTINGS_LABEL',
  params: {
    placement: 'top',
    previousDelay: 500
  }
}, {
  target: '#about',
  content: 'tours.side-nav.ABOUT_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#about',
    nextDelay: 500
  }
}, {
  target: '#report-bug',
  content: 'tours.side-nav.BUG_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: ['#close-action', '#left-opener'],
    previousDelay: 500
  }
}]
