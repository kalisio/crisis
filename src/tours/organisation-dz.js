module.exports = [{
  target: '#danger-zone',
  link: 'tours.organisation.DANGER_ZONE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#delete-block',
  title: 'tours.organisation.DELETE_LABEL',
  content: 'tours.organisation.PREVENT_DELETE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#properties',
  link: 'tours.organisation.PROPERTIES_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#properties',
    tour: 'organisation-settings-activity/properties'
  }
}, {
  target: '#billing',
  link: 'tours.organisation.BILLING_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#billing',
    tour: 'organisation-settings-activity/billing'
  }
}]
