const layout = require('./kdk/layout.js')

module.exports = [layout.leftOpener(), {
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
