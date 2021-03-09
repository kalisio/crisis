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
  target: '#account',
  link: 'tours.home.ACCOUNT_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'account-activity', params: { page: 'profile' } }
  }
}, {
  target: '#new-organisation',
  title: 'tours.home.ORGANISATION_DEFINITION_LABEL',
  link: 'tours.home.NEW_ORGANISATION_LINK_LABEL',
  params: {
    placement: 'top',
    clickOnLink: '#new-organisation',
    nextDelay: 250
  }
}, {
  target: '#name-field',
  content: 'tours.create-organisation.ORGANISATION_NAME_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#close[1]',
    previousDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.create-organisation.ORGANISATION_DESCRIPTION_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#apply-button',
  content: 'tours.create-organisation.CREATE_ORGANISATION_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close[1]',
    nextDelay: 500
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
  target: '#dashboard',
  content: 'tours.home.DASHBOARD_LABEL',
  link: 'tours.home.DASHBOARD_LINK_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'dashboard' }
  }
}, {
  target: '#help',
  link: 'tours.home.HELP_LABEL',
  params: {
    placement: 'top',
    clickOnLink: '#help'
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
    clickOnPrevious: ['#close-modal', '#app-bar-leading'],
    previousDelay: 500
  }
}]
