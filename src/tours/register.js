module.exports = [{
  target: '#name-field',
  title: 'tours.register.LOCAL_LABEL',
  content: 'tours.register.NAME_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#email-field',
  content: 'tours.register.EMAIL_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#password-field',
  content: 'tours.register.PASSWORD_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#password-field-visibility',
  content: 'tours.register.PASSWORD_VISIBILITY_LABEL',
  params: {
    placement: 'top',
    click: 1000
  }
}, {
  target: '#confirmPassword-field',
  content: 'tours.register.CONFIRM_PASSWORD_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#confirmPassword-field-visibility',
  content: 'tours.register.CONFIRM_PASSWORD_VISIBILITY_LABEL',
  params: {
    placement: 'top',
    click: 1000
  }
}, {
  target: '#consentTerms-field',
  content: 'tours.register.TERMS_LABEL',
  params: {
    placement: 'right',
    click: 1000
  }
}, {
  target: '#register',
  title: 'tours.register.REGISTER_LABEL',
  content: 'tours.register.EMAIL_VERIFICATION_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#login-link',
  content: 'tours.register.LOGIN_LABEL',
  params: {
    placement: 'bottom',
    route: { name: 'login', query: { tour: true } },
    routeDelay: 3000
  }
}]
