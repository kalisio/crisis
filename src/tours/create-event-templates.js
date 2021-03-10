module.exports = [{
  target: '#name-field',
  content: 'tours.create-event-template.TEMPLATE_NAME_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#choosed-icon',
  content: 'tours.create-event-template.TEMPLATE_ICON_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#choosed-icon',
    nextDelay: 500
  }
}, {
  target: '#icons',
  content: 'tours.create-event-template.SELECT_ICON_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#close-action[1]',
    previousDelay: 500
  }
}, {
  target: '#palette',
  content: 'tours.create-event-template.SELECT_COLOR_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#close-action[1]',
    nextDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.create-event-template.TEMPLATE_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#choosed-icon',
    previousDelay: 500
  }
}, {
  target: '#participants-field',
  title: 'tours.create-event-template.SELECT_PARTICIPANTS_LABEL',
  content: 'tours.create-event-template.PARTICIPANTS_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#coordinators-field',
  title: 'tours.create-event-template.SELECT_COORDINATORS_LABEL',
  content: 'tours.create-event-template.COORDINATORS_LABEL',
  params: {
    placement: 'top'
  }
},/* {
  target: '#layer-field',
  title: 'tours.create-event-template.SELECT_LAYER_LABEL',
  content: 'tours.create-event-template.LAYER_LABEL',
  params: {
    placement: 'top'
  }
}*/{
  target: '#workflow-toggle',
  title: 'tours.create-event-template.ADD_WORKFLOW_LABEL',
  link: 'tours.create-event-template.WORKFLOW_LINK_LABEL',
  params: {
    placement: 'top',
    clickOnLink: '#workflow-toggle',
    nextDelay: 250
  }
}, {
  target: 'div.q-stepper__header',
  title: 'tours.create-event-template.WORKFLOW_DEFINITION_LABEL',
  content: 'tours.create-event-template.WORKFLOW_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#close-action'
  }
}, {
  target: '#workflow * #title-field',
  title: 'tours.create-event-template.WORKFLOW_STEP_TITLE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#workflow * #stakeholder-field',
  title: 'tours.create-event-template.WORKFLOW_STEP_STAKEHOLDER_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#workflow * #choosed-icon',
  title: 'tours.create-event-template.WORKFLOW_STEP_ICON_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#workflow * #description-field',
  title: 'tours.create-event-template.WORKFLOW_STEP_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#workflow * #interaction-field',
  title: 'tours.create-event-template.WORKFLOW_STEP_INTERACTION_LABEL',
  content: 'tours.create-event-template.WORKFLOW_STEP_INTERACTION_ICON_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#workflow * #end-field',
  title: 'tours.create-event-template.WORKFLOW_STEP_END_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#workflow * #previous-step',
  title: 'tours.create-event-template.WORKFLOW_PREVIOUS_STEP_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#workflow * #next-step',
  title: 'tours.create-event-template.WORKFLOW_NEXT_STEP_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#workflow * #add-step',
  title: 'tours.create-event-template.WORKFLOW_ADD_STEP_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#workflow * #remove-step',
  title: 'tours.create-event-template.WORKFLOW_REMOVE_STEP_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#workflow * #preview-step',
  title: 'tours.create-event-template.WORKFLOW_PREVIEW_STEP_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#close-action'
  }
}, {
  target: '#apply-button',
  content: 'tours.create-event-template.CREATE_TEMPLATE_LABEL',
  params: {
    placement: 'left'
  }
}]
