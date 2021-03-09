module.exports = [{
  target: '#properties',
  content: 'tours.organisation.PROPERTIES_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#name-field',
  content: 'tours.organisation.NAME_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#description-field',
  content: 'tours.organisation.DESCRIPTION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#apply-button',
  content: 'tours.organisation.UPDATE_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#billing',
  link: 'tours.organisation.BILLING_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#billing',
    tour: 'organisation-settings-activity/billing'
  }
}, {
  target: '#danger-zone',
  link: 'tours.organisation.DANGER_ZONE_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#danger-zone',
    tour: 'organisation-settings-activity/danger-zone'
  }
}]
