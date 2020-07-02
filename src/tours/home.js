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
    placement: 'top',
    clickOnPrevious: '#online-help',
    previousDelay: 500
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
    placement: 'top',
    clickOnPrevious: '#about',
    previousDelay: 500
  }
}, {
  target: '#account',
  link: 'tours.home.ACCOUNT_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'account-activity', params: { perspective: 'profile' } }
  }
}, {
  target: 'div[id^=link-]',
  title: 'tours.home.ORGANISATION_LABEL',
  link: 'tours.home.ORGANISATION_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: 'div[id^=link-]'
  }
}, {
  target: '#new-organisation',
  title: 'tours.home.NEW_ORGANISATION_LABEL',
  content: 'tours.home.ORGANISATION_DEFINITION_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#new-organisation',
    nextDelay: 500
  }
}, {
  target: '#name-field',
  content: 'tours.home.ORGANISATION_NAME_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#close',
    previousDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.home.ORGANISATION_DESCRIPTION_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#apply-button',
  content: 'tours.home.CREATE_ORGANISATION_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close',
    nextDelay: 500
  }
}, {
  target: '#dashboard',
  content: 'tours.home.DASHBOARD_LABEL',
  link: 'tours.home.DASHBOARD_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#new-organisation',
    previousDelay: 500,
    route: { name: 'dashboard' }
  }
}]
