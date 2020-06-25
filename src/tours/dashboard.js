const home = require('./home')

module.exports = home.concat([{
  target: '#page-content',
  title: 'tours.dashboard.DASHBOARD_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#new-organisation',
    previousDelay: 500
  }
}])
