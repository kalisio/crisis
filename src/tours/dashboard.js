module.exports = [{
  target: 'div[id^=organisation]',
  title: 'tours.dashboard.DASHBOARD_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: 'div[id^=organisation-grid]',
  title: 'tours.dashboard.GRID_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: 'div[id^=organisation-name]',
  title: 'tours.dashboard.ORGANISATION_LABEL',
  link: 'tours.dashboard.ORGANISATION_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: 'div[id^=organisation-name]'
  }
}]
