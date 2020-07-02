module.exports = [{
  target: '#members',
  title: 'tours.members.MEMBERS_LABEL',
  content: 'tours.members.MEMBER_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#overflow-menu-entry',
  content: 'tours.members.OVERFLOW_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#overflow-menu-entry',
    clickDelay: 500,
    clickOnNext: '#overflow-menu-entry',
    nextDelay: 500,
    clickOnPrevious: '#overflow-menu-entry',
    previousDelay: 500
  }
}, {
  target: '#fab',
  content: 'tours.members.ADD_INVITE_MEMBER_LABEL',
  params: {
    placement: 'left',
    clickOn: 'div.q-fab__icon-holder',
    clickDelay: 500,
    nextDelay: 500
  }
}, {
  target: '#add-member',
  content: 'tours.members.ADD_MEMBER_LABEL',
  link: 'tours.members.ADD_MEMBER_LINK_LABEL',
  params: {
    placement: 'left',
    clickOnPrevious: '#fab',
    previousDelay: 500,
    route: { name: 'add-member' }
  }
}, {
  target: '#invite-member',
  content: 'tours.members.INVITE_MEMBER_LABEL',
  link: 'tours.members.INVITE_MEMBER_LINK_LABEL',
  params: {
    placement: 'left',
    clickOnNext: 'div.q-fab__icon-holder',
    nextDelay: 500,
    route: { name: 'invite-member' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.members.MEMBER_CARD_LABEL',
  params: {
    placement: 'right',
    clickOnPrevious: 'div.q-fab__icon-holder',
    previousDelay: 500
  }
}, {
  target: '#join-group',
  content: 'tours.members.JOIN_GROUP_LABEL',
  link: 'tours.members.JOIN_GROUP_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#join-group'
  }
}, {
  target: '#tag-member',
  content: 'tours.members.TAG_MEMBER_LABEL',
  link: 'tours.members.TAG_MEMBER_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#tag-member'
  }
}, {
  target: '#change-role',
  content: 'tours.members.CHANGE_ROLE_LABEL',
  link: 'tours.members.CHANGE_ROLE_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#change-role'
  }
}, {
  target: '#card-overflow-menu',
  content: 'tours.members.MEMBER_OVERFLOW_MENU_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#card-overflow-menu',
    nextDelay: 500
  }
}, {
  target: '#remove-member',
  title: 'tours.members.REMOVE_MEMBER_LABEL',
  content: 'tours.members.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left'
  }
}]