const layout = require('./kdk/layout.js')

module.exports = [{
  target: '#catalog',
  title: 'tours.catalog.CATALOG_LABEL',
  link: 'tours.catalog.NAVIGATION_BAR_LINK_LABEL',
  params: {
    placement: 'bottom',
    tour: 'navigation-bar'
  }
}, layout.rightOpener(), {
  target: '#bottom-opener',
  title: 'tours.catalog.TIMELINE_LABEL',
  link: 'tours.catalog.TIMELINE_LINK_LABEL',
  params: {
    placement: 'top',
    hoverClickOnLink: '#bottom-opener',
    tour: 'timeline'
  }
}, layout.fab()]
