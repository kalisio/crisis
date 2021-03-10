module.exports = [{
  target: '#top-opener',
  title: 'tours.catalog.NAVIGATION_BAR_LABEL',
  link: 'tours.catalog.NAVIGATION_BAR_LINK_LABEL',
  params: {
    placement: 'bottom',
    tour: 'navigation-bar'
  }
}, {
  target: '#right-opener',
  title: 'tours.catalog.CATALOG_LABEL',
  link: 'tours.catalog.CATALOG_LINK_LABEL',
  params: {
    placement: 'left',
    hoverClickOnLink: '#right-opener',
    tour: 'catalog-panel'
  }
}, {
  target: '#bottom-opener',
  title: 'tours.catalog.TIMELINE_LABEL',
  link: 'tours.catalog.TIMELINE_LINK_LABEL',
  params: {
    placement: 'top',
    hoverClickOnLink: '#bottom-opener',
    tour: 'timeline'
  }
}, {
  target: '#fab',
  title: 'tours.catalog.FAB_LABEL',
  link: 'tours.catalog.FAB_LINK_LABEL',
  params: {
    placement: 'top',
    hoverClickOnLink: 'div.q-fab__icon-holder',
    tour: 'fab'
  }
}]
