const _ = require('lodash')
const sideNav = require('./map/side-nav')
const accountProfil = require('./core/account-profile')
const account = require('./core/account')

const home = [{
  target: '#left-opener',
  title: 'tours.side-nav.SIDENAV_LABEL',
  params: {
    placement: 'right',
    hoverClickOnNext: '#left-opener'
  }
}, {
  target: '#my-organisations',
  content: 'tours.side-nav.ORGANISATIONS_LABEL',
  link: 'tours.side-nav.ORGANISATIONS_LINK_LABEL',
  params: {
    placement: 'top',
    clickOnLink: ['#left-opener', '#contextual-help'],
    clickOnPrevious: '#left-opener',
    clickOnNext: '#left-opener'
  }
}, {
  target: '#settings',
  content: 'tours.side-nav.SETTINGS_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#left-opener',
    clickOnNext: '#left-opener'
  }
}, {
  target: '#online-help',
  link: 'tours.side-nav.HELP_LABEL',
  params: {
    placement: 'top',
    clickOnLink: ['#left-opener', '#online-help'],
    clickOnPrevious: '#left-opener',
    clickOnNext: '#left-opener'
  }
}]

module.exports = _.union(home, sideNav, accountProfil, account)