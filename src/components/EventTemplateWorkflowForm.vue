<template>
  <q-stepper id="workflow" header-nav animated ref="stepper" v-model="currentStep" @input="onStepSelected">
    <q-step v-for="(step, index) in steps" :key="step.name + '_' + index" :name="step.name"
      :title="step.title" :icon="getStepIcon(step)">
      <KForm ref="stepForm" v-show="!preview" :schema="stepSchema" :values='stepValues'
        @form-ready="onFormReady" @field-changed="onStepFieldChanged" />
      <div v-show="preview">
        <KForm ref="previewForm" :schema="previewSchema" />
      </div>
    </q-step>
    <template v-slot:navigation>
      <q-stepper-navigation class="row justify-end">
        <q-btn class="col-1" id="previous-step" :disabled="currentStep === steps[0].name" flat color="primary" icon="las la-step-backward" @click="onPreviousStep()">
          <q-tooltip v-if="currentStep !== steps[0].name" anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t('EventTemplateWorkflowForm.PREVIOUS_STEP_BUTTON')}}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-1" id="add-step" v-show="!preview" flat color="primary" icon="las la-plus-circle" @click="onAddStep()">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t('EventTemplateWorkflowForm.ADD_STEP_BUTTON')}}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-1" id="remove-step" v-show="!preview && (steps.length > 1)" flat color="primary" icon="las la-trash" @click="onRemoveStep()">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t('EventTemplateWorkflowForm.REMOVE_STEP_BUTTON')}}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-1" id="preview-step" flat color="primary" :icon="preview ? 'las la-edit' : 'las la-play'" @click="onPreviewOrEdit">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t(!preview ? 'EventTemplateWorkflowForm.PREVIEW_WORKFLOW_BUTTON': 'EventTemplateWorkflowForm.EDIT_WORKFLOW_BUTTON')}}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-1" id="next-step" :disabled="currentStep === steps[steps.length - 1].name" flat color="primary" icon="las la-step-forward" @click="onNextStep()">
          <q-tooltip v-if="currentStep !== steps[steps.length - 1].name" anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t('EventTemplateWorkflowForm.NEXT_STEP_BUTTON')}}
          </q-tooltip>
        </q-btn>
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<script>
import _ from 'lodash'
import { utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'
import { QStepper, QStep, QStepperNavigation, uid } from 'quasar'

export default {
  name: 'event-template-workflow-form',
  components: {
    QStepper,
    QStep,
    QStepperNavigation
  },
  mixins: [
    mixins.events
  ],
  props: {
    schema: {
      type: Object,
      default: null
    },
    contextId: {
      type: String
    },
    objectId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      steps: [],
      currentStep: '',
      stepValues: {},
      preview: false
    }
  },
  computed: {
    stepSchema () {
      if (!this.schema) return null
      // Start from base schema
      const schema = Object.assign({}, this.schema)
      // Add required end field options
      const options = _.get(this.stepValues, 'interaction', [])
      _.set(schema, 'properties.end.field.options',
        options.map(option => Object.assign({ label: option.value }, option)))
      return schema
    },
    previewSchema () {
      return this.generateSchemaForStep(this.getCurrentStep())
    }
  },
  methods: {
    getForm (form) {
      return this.$refs[form][0]
    },
    generateStep () {
      const newStep = _.cloneDeep(this.defaultStep)
      // We generate a UID so that we can identify each step uniquely,
      // indeed titles might be similar
      newStep.name = uid().toString()
      return newStep
    },
    getCurrentStep () {
      return this.steps.find(step => step.name === this.currentStep)
    },
    getCurrentStepIndex () {
      return _.findIndex(this.steps, step => step.name === this.currentStep)
    },
    getStepIcon (step) {
      return kCoreUtils.getIconName(step)
    },
    onAddStep () {
      // Apply current changes when editing
      // If not possible the current form is invalid so do nothing
      if (!this.applyStepChanges()) return
      const index = this.getCurrentStepIndex()
      const step = this.generateStep()
      // Insert or push ?
      if (index < (this.steps.length - 1)) {
        this.steps.splice(index + 1, 0, step)
        this.currentStep = this.steps[index + 1].name
      } else {
        this.steps.push(step)
        this.currentStep = this.steps[this.steps.length - 1].name
      }
      this.refreshStep()
    },
    onRemoveStep () {
      const index = this.getCurrentStepIndex()
      // Before modifying array check if current step is the last one,
      // if so go back otherwise jump to previous
      if (this.currentStep !== this.steps[0].name) {
        this.currentStep = this.steps[index - 1].name
      } else {
        // When removing first step the second will replace it
        this.currentStep = this.steps[1].name
      }
      // Use splice so that Vue detects the change
      this.steps.splice(index, 1)
      // Restore step form when editing
      this.refreshStep()
    },
    onPreviousStep () {
      // Apply current form changes when editing
      // If not possible the current form is invalid so do nothing
      if (!this.applyStepChanges()) return
      const index = this.getCurrentStepIndex()
      this.currentStep = this.steps[index - 1].name
      this.refreshStep()
    },
    onNextStep () {
      // Apply current form changes when editing
      // If not possible the current form is invalid so do nothing
      if (!this.applyStepChanges()) return
      const index = this.getCurrentStepIndex()
      this.currentStep = this.steps[index + 1].name
      // Restore step form when editing
      this.refreshStep()
    },
    onStepSelected (step) {
      // Apply current form changes when editing
      // If not possible the current form is invalid so do nothing
      // FIXME: when called the step has already been changed in model
      // so that current step is not the right one anymore
      // For now we don't validate
      // if (!this.applyStepChanges()) return
      // Restore step form when editing
      this.refreshStep()
    },
    onPreviewOrEdit () {
      // Apply current form changes before previewing
      if (!this.preview) {
        // If not possible the current form is invalid so do nothing
        if (!this.applyStepChanges()) return
      }
      this.preview = !this.preview
      // Restore step form when editing
      this.refreshStep()
    },
    onStepFieldChanged () {
      const form = this.getForm('stepForm')
      if (form) {
        _.assign(this.stepValues, form.values())
      }
    },
    onFormReady () {
      // Now internal form is ready we are as well
      this.$emit('form-ready', this)
    },
    applyStepChanges () {
      if (this.preview) return true
      const form = this.getForm('stepForm').validate()
      if (form.isValid) {
        _.assign(this.getCurrentStep(), form.values)
      }
      return form.isValid
    },
    refreshStep () {
      // For preview the underlying schema should be updated automatically, thus reset the form
      if (!this.preview) {
        // Otherwise simply fill the step form
        this.fillStepForm()
      }
    },
    fillStepForm () {
      this.stepValues = this.getCurrentStep()
    },
    async fill (workflow) {
      // If no workflow given we will use default one
      if (workflow && workflow.length > 0) {
        this.steps = workflow
        // Reset current step if not available
        if (!this.getCurrentStep()) this.currentStep = this.steps[0].name
      }
      // Restore step form when editing
      this.refreshStep()
    },
    clear () {
      this.fill([this.generateStep()])
    },
    validate () {
      // Apply current form changes when editing
      const isValid = this.applyStepChanges()
      return {
        isValid,
        values: this.steps
      }
    },
    async apply (object) {
      object.workflow = this.steps
    },
    submitted (object) {
      // Nothing to do
    }
  },
  created () {
    this.defaultStep = {
      title: '',
      icon: { name: 'fas fa-check', color: 'grey' },
      description: '',
      interaction: [],
      end: [],
      stakeholder: 'participant'
    }
    // Initialize step data on creation so that local ref to form can be resolved
    this.steps = [this.generateStep()]
    this.currentStep = this.steps[0].name
    this.refreshStep()
  }
}
</script>
