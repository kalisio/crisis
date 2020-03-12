<template>
  <q-stepper header-nav animated ref="stepper" v-model="currentStep" @input="onStepSelected">
    <q-step v-for="(step, index) in steps" :key="step.name + '_' + index" :name="step.name"
      :title="step.title" :icon="getStepIcon(step)">
      <k-form ref="stepForm" v-show="!preview" :schema="schema" @form-ready="fillStepForm" @field-changed="onStepFieldChanged">
      </k-form>
      <div v-show="preview">
        <k-form ref="previewForm" :schema="previewSchema"/>
      </div>
    </q-step>
    <template v-slot:navigation>
      <q-stepper-navigation class="row justify-end">
        <q-btn class="col-1" :disabled="currentStep === steps[0].name" flat color="primary" icon="navigate_before" @click="onPreviousStep()">
          <q-tooltip v-if="currentStep !== steps[0].name" anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t('EventWorkflowForm.PREVIOUS_STEP_BUTTON')}}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-1" v-show="!preview" flat color="primary" icon="playlist_add" @click="onAddStep()">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t('EventWorkflowForm.ADD_STEP_BUTTON')}}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-1" v-show="!preview && (steps.length > 1)" flat color="primary" icon="delete_sweep" @click="onRemoveStep()">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t('EventWorkflowForm.REMOVE_STEP_BUTTON')}}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-1" flat color="primary" :icon="preview ? 'edit' : 'play_arrow'" @click="onPreviewOrEdit">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t(!preview ? 'EventWorkflowForm.PREVIEW_WORKFLOW_BUTTON': 'EventWorkflowForm.EDIT_WORKFLOW_BUTTON')}}
          </q-tooltip>
        </q-btn>
        <q-btn class="col-1" :disabled="currentStep === steps[steps.length - 1].name" flat color="primary" icon="navigate_next" @click="onNextStep()">
          <q-tooltip v-if="currentStep !== steps[steps.length - 1].name" anchor="top middle" self="bottom middle" :offset="[10, 10]">
            {{$t('EventWorkflowForm.NEXT_STEP_BUTTON')}}
          </q-tooltip>
        </q-btn>
      </q-stepper-navigation>
    </template>
  </q-stepper>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'
import { QStepper, QStep, QStepperNavigation, uid } from 'quasar'

export default {
  name: 'event-workflow-form',
  components: {
    QStepper,
    QStep,
    QStepperNavigation
  },
  mixins: [
    kCoreMixins.schemaProxy,
    kCoreMixins.refsResolver(),
    mixins.eventLogs
  ],
  props: {
    contextId: {
      type: String
    },
    objectId: {
      type: String,
      default: ''
    },
    layerId: {
      type: String
    }
  },
  watch: {
    layerId: async function () {
      await this.loadLayerSchema(this.layerId)
      this.fill({ workflow: this.steps })
    }
  },
  data () {
    return {
      steps: [],
      currentStep: '',
      preview: false,
      previewSchema: null
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
      this.restoreStep()
    },
    onRemoveStep () {
      const name = this.currentStep
      const index = this.getCurrentStepIndex()
      // Before modifying array check if current step is the last one,
      // if so go back otherwise jump to previous
      if (this.currentStep !== this.steps[0].name) {
        this.currentStep = this.steps[index - 1].name
      } else {
        // when removing first step the second will replace it
        this.currentStep = this.steps[1].name
      }
      // Can't use splice because Vue does not detect the change
      this.steps = this.steps.filter((step) => step.name !== name)
      // Restore step form when editing
      this.restoreStep()
    },
    onPreviousStep () {
      // Apply current form changes when editing
      // If not possible the current form is invalid so do nothing
      if (!this.applyStepChanges()) return
      const index = this.getCurrentStepIndex()
      this.currentStep = this.steps[index - 1].name
      this.restoreStep()
    },
    onNextStep () {
      // Apply current form changes when editing
      // If not possible the current form is invalid so do nothing
      if (!this.applyStepChanges()) return
      const index = this.getCurrentStepIndex()
      this.currentStep = this.steps[index + 1].name
      // Restore step form when editing
      this.restoreStep()
    },
    onStepSelected (step) {
      // Apply current form changes when editing
      // If not possible the current form is invalid so do nothing
      // FIXME: when called the step has already been changed in model
      // so that current step is not the right one anymore
      // For now we don't validate
      // if (!this.applyStepChanges()) return
      // Restore step form when editing
      this.restoreStep()
    },
    onPreviewOrEdit () {
      // Apply current form changes before previewing
      if (!this.preview) {
        // If not possible the current form is invalid so do nothing
        if (!this.applyStepChanges()) return
      }
      this.preview = !this.preview
      // Restore step form when editing
      this.restoreStep()
    },
    applyStepChanges () {
      if (this.preview) return true
      const form = this.getForm('stepForm').validate()
      if (form.isValid) {
        _.assign(this.getCurrentStep(), form.values)
      }
      return form.isValid
    },
    async restoreStep () {
      // For preview we need to update the underlying schema to reflect step values
      if (this.preview) {
        this.previewSchema = await this.generateSchemaForStep(this.getCurrentStep(), this.layer)
        // We need to force a refresh so that the schema is correctly transfered to child component by Vuejs
        await this.$nextTick()
        // Force form refresh to default values
        const form = this.getForm('previewForm')
        await form.build()
        form.clear()
      } else {
        // Otherwise simply fill the step form
        this.fillStepForm()
      }
    },
    async loadPreviewSchema () {
      try {
        this.previewSchema = await this.generateSchemaForStep(this.getCurrentStep(), this.layer)
        return this.previewSchema
      } catch (error) {
        this.$events.$emit('error', error)
        throw error
      }
    },
    onStepFieldChanged (field, value) {
      // Setup workflow ending values selector depending on interaction field state
      if (field === 'interaction') {
        this.setupEndField()
      }
    },
    fillStepForm () {
      const form = this.getForm('stepForm')
      form.fill(this.getCurrentStep())
      this.setupFeatureInteractionField()
      this.setupEndField()
    },
    setupFeatureInteractionField () {
      if (!this.layerSchema) return
      const form = this.getForm('stepForm')
      const interactionField = form.getField('featureInteraction')
      // Add required label field
      _.set(interactionField, 'properties.field.options',
        _.toPairs(this.layerSchema.properties).map(([key, value]) => ({ value: key, label: value.field.helper })))
    },
    setupEndField () {
      const form = this.getForm('stepForm')
      const interactionField = form.getField('interaction')
      const endField = form.getField('end')
      // Add required label field
      _.set(endField, 'properties.field.options',
        interactionField.model.map(option => Object.assign({ label: option.value }, option)))
    },
    async build () {
      // Because our step form is under a v-if caused by the Quasar stepper
      // it is destroyed/recreated by Vue so that we need to restore the refs each time it is build
      this.setRefs(['stepForm'])
      // Build the internal form
      await Promise.all([
        this.loadSchema('event-workflow' + (this.objectId ? '.update' : '.create')),
        this.loadPreviewSchema(),
        this.loadRefs()
      ])

      return Promise.all([
        this.getForm('stepForm').build(),
        this.getForm('previewForm').build()
      ])
    },
    async fill (object) {
      // If no workflow given this will use default one
      if (object.workflow) {
        this.steps = object.workflow
        this.currentStep = this.steps[0].name
      }
      // Restore step form when editing
      this.restoreStep()
    },
    clear () {
      this.fill({ workflow: [this.generateStep()] })
    },
    validate () {
      // Apply current form changes when editing
      const isValid = this.applyStepChanges()
      return {
        isValid,
        values: {
          workflow: this.steps
        }
      }
    },
    async apply (object) {
      object.workflow = this.steps
    },
    submitted (object) {
    }
  },
  created () {
    this.defaultStep = {
      title: '',
      icon: { name: 'check', color: 'primary' },
      description: '',
      featureInteraction: [],
      interaction: [],
      end: [],
      stakeholder: 'participant'
    }
    // Load the required components
    this.$options.components['k-form'] = this.$load('form/KForm')
    // Initialize step data on creation so that local ref to form can be resolved
    this.steps = [this.generateStep()]
    this.currentStep = this.steps[0].name
    // Load layer schema if any
    this.loadLayerSchema(this.layerId)
  }
}
</script>
