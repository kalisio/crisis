module.exports = [{
  target: '#opener-top',
  title: 'tours.catalog.NAVIGATION_BAR_LABEL',
  link: 'tours.catalog.NAVIGATION_BAR_LINK_LABEL',
  params: {
    placement: 'bottom',
    tour: 'navigation-bar'
  }
}, {
  target: '#opener-right',
  title: 'tours.catalog.CATALOG_LABEL',
  link: 'tours.catalog.CATALOG_LINK_LABEL',
  params: {
    placement: 'left',
    hoverClickOnLink: '#opener-right',
    tour: 'catalog-panel'
  }
}, {
  target: '#opener-bottom',
  title: 'tours.catalog.TIMELINE_LABEL',
  link: 'tours.catalog.TIMELINE_LINK_LABEL',
  params: {
    placement: 'top',
    hoverClickOnLink: '#opener-bottom',
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
