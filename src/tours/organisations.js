module.exports = [{
  target: '#left-opener',
  title: 'tours.organisations.SIDENAV_LABEL',
  link: 'tours.organisations.SIDENAV_LINK_LABEL',
  params: {
    placement: 'right',
    hoverClickOnLink: '#left-opener',
    tour: 'side-nav'
  }
}, {
  target: '#online-help',
  title: 'tours.organisations.HELP_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#organisations',
  title: 'tours.organisations.ORGANISATIONS_LABEL',
  content: 'tours.organisations.ORGANISATION_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-organisation',
  content: 'tours.organisations.SEARCH_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#create-organisation',
  title: 'tours.organisations.NEW_ORGANISATION_LABEL',
  link: 'tours.organisations.NEW_ORGANISATION_LINK_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    route: { name: 'create-organisation' }
  }
}, {
  target: '#goto-organisation',
  title: 'tours.organisations.ORGANISATION_LABEL',
  link: 'tours.organisations.ORGANISATION_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#goto-organisation'
  }
}]
