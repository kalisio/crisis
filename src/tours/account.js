module.exports = [{
  target: '#profile',
  content: 'tours.account.PROFILE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#avatar-field',
  content: 'tours.account.AVATAR_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#name-field',
  content: 'tours.account.NAME_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#apply-button',
  content: 'tours.account.UPDATE_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#security',
  content: 'tours.account.SECURITY_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#security',
    clickOnPrevious: '#profile',
    nextDelay: 500,
    previousDelay: 500
  }
}, {
  target: '#password-block',
  link: 'tours.account.PASSWORD_LINK_LABEL',
  params: {
    placement: 'top',
    route: { name: 'change-password' }
  }
}, {
  target: '#email-block',
  link: 'tours.account.EMAIL_LINK_LABEL',
  params: {
    placement: 'top',
    route: { name: 'send-change-identity' }
  }
}, {
  target: '#devices-block',
  title: 'tours.account.DEVICES_LABEL',
  content: 'tours.account.UNLINK_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#danger-zone',
  content: 'tours.account.DANGER_ZONE_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#danger-zone',
    clickOnPrevious: '#security',
    nextDelay: 500,
    previousDelay: 500
  }
}, {
  target: '#delete-block',
  content: 'tours.account.DELETE_LABEL',
  params: {
    placement: 'bottom'
  }
}]
