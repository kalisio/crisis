<template>
  <KModal
    :title="title"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <div class="column xs-gutter">
      <q-card-section>
        <KPanel id="plan-objectives-toolbar" :content="toolbar" :mode="mode" class="no-wrap" />
      </q-card-section>
      <q-card-section id="plan-objectives-list" v-show="mode === 'list'">
        <KList 
          :ref="onListReferenceCreated"
          style="min-height: 50px; min-width: 200px"
          service="plan-objectives"
          :renderer="objectiveRenderer"
          :nbItemsPerPage="8"
          :base-query="{}"
          :filter-query="{}"
        />
      </q-card-section>
      <q-card-section id="plan-objective-add" v-if="mode === 'add'">
        <div class="colum q-gutter-y-md">
          <KForm 
            :ref="onAddFormReferenceCreated" 
            :schema="objectiveSchema" 
            style="min-width: 300px" 
          />
        </div>
      </q-card-section>
      <q-card-section id="plan-objective-edit" v-if="mode === 'edit'">
        <div class="colum q-gutter-y-md">
          <KForm 
            :ref="onEditFormReferenceCreated"
            :schema="objectiveSchema" 
            style="min-width: 300px" 
          />
        </div>
      </q-card-section>
    </div>
  </KModal>
</template>

<script>
import _ from 'lodash'
import { uid } from 'quasar'
import { mixins as kdkCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-editor',
  mixins: [
    kdkCoreMixins.baseModal,
    kdkCoreMixins.service,
    kdkCoreMixins.objectProxy
  ],
  props: {
    objectId: {
      type: String,
      required: true
    }
  },
  computed: {
    title () {
      if (this.mode === 'list') return this.$t('PlanObjectivesEditor.MANAGE', { name: _.get(this.object, 'name') })
      else if (this.mode === 'add') return this.$t('PlanObjectivesEditor.CREATE', { name: _.get(this.object, 'name') })
      else return this.$t('PlanObjectivesEditor.EDIT', { name: this.editedObjective.name })
    },
    buttons () {
      if (this.mode === 'list') {
        return [
          { id: 'close-button', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeModal() }
        ]
      } else if (this.mode === 'add') {
        return [
          { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => { this.mode = 'list' } },
          { id: 'add-plan-objective-button', label: 'CREATE', renderer: 'form-button', disabled: !addForm, handler: () => this.onCreatePlanObjective() }
        ]
      } else {
        return [
          { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => { this.mode = 'list' } },
          { id: 'add-plan-objective-button', label: 'UPDATE', renderer: 'form-button', disabled: !editForm, handler: () => this.onEditPlanObjective() }
        ]
      }
    }
  },
  data () {
    return {
      filter: this.$store.get('filter'),
      sorter: this.$store.get('sorter'),
      mode: 'list',
      savingObjective: false,
      objectiveRenderer: {
        component: 'PlanObjectiveItem',
        actions: [{
          id: 'edit-plan-objective',
          icon: 'las la-edit',
          tooltip: 'PlanObjectivesEditor.EDIT_OBJECTIVE',
          handler: (context) => this.editPlanObjective(context.item)
        }, {
          id: 'remove-plan-objective',
          icon: 'las la-trash',
          tooltip: 'PlanObjectivesEditor.REMOVE_OBJECTIVE',
          handler: (context) => this.removePlanObjective(context.item)
        }]
      },
      toolbar: {
        list: [
          { component: 'QSpace' },
          {
            id: 'add-plan-objective',
            icon: 'las la-plus-circle',
            tooltip: 'PlanObjectivesEditor.ADD_OBJECTIVE',
            size: '1rem',
            handler: () => { this.mode = 'add' }
          }
        ],
        edit: [],
        add: []
      },
      addForm: null,
      editForm: null,
      objectiveSchema: {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://www.kalisio.xyz/schemas/plan-objective.create.json#',
        title: 'schemas.PLAN_OBJECTIVE_CREATE_TITLE',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'schemas.PLAN_OBJECTIVE_NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            field: {
              component: 'form/KTextareaField',
              label: 'schemas.PLAN_OBJECTIVE_DESCRIPTION_FIELD_LABEL'
            }
          },
          location: {
            type: 'object',
            field: {
              component: 'form/KLocationField',
              label: 'schemas.PLAN_OBJECTIVE_LOCATION_FIELD_LABEL',
              draggable: true,
              draw: true
            }
          }
        },
        required: ['name', 'description']
      }
    }
  },
  methods: {
    updatePlanObjectivesServiceStore () {
      let objectivesStore = _.get(this.object, 'objectives', [])
      // Jump from array to map for in memory service
      objectivesStore = _.keyBy(objectivesStore, 'name')
      const service = this.$api.getService('plan-objectives')
      // Update store with a fresh object otherwise it causes a weird bug in navigator
      service.store = Object.assign({}, objectivesStore)
    },
    async updatePlanObjectives (objectives) {
      /*_.set(this.object, 'objectives', objectives)
      this.updatePlanObjectivesServiceStore()
      this.savingObjective = true
      try {
        await this.getService().patch(this.object._id, { objectives })
        this.savingObjective = false
      } catch (error) {
        this.savingObjective = false
        throw error
      }
      // After create or edit jump to the list mode
      if (this.mode !== 'list') this.mode = 'list'
      // Force the list to be refreshed
      if (this.list) this.list.refreshCollection()*/
    },
    async onCreatePlanObjective () {
      if (!this.addForm) throw new Error('Cannot create plan objectives with a non-ready form')
      const result = this.addForm.validate()
      if (result.isValid) {
        const objective = result.values
        // We generate a UID so that we can identify each objective uniquely,
        // indeed names might be similar or be changed
        objective.id = uid().toString()
        // Update objectives in-memory and in DB
        const objectives = _.get(this.object, 'objectives', [])
        // Check for unique name
        if (_.find(objectives, item => item.name === objective.name)) {
          this.$toast({ message: this.$t('errors.OBJECT_ID_ALREADY_TAKEN') })
          return
        }
        await this.updatePlanObjectives(objectives.concat(objective))
      }
    },
    async onEditPlanObjective () {
      if (!this.editForm) throw new Error('Cannot edit plan objectives with a non-ready form')
      const result = this.editForm.validate()
      if (result.isValid) {
        // Keep track of ID as it is lost in form
        const objective = Object.assign({ id: this.editedObjective.id }, result.values)
        // Update objectives in-memory and in DB
        const objectives = _.get(this.object, 'objectives', [])
        // Check for unique name
        if (_.find(objectives, item => item.name === objective.name && item.id !== objective.id)) {
          this.$toast({ message: this.$t('errors.OBJECT_ID_ALREADY_TAKEN') })
          return
        }
        const index = _.findIndex(objectives, item => item.id === objective.id)
        objectives[index] = objective
        await this.updatePlanObjectives(objectives)
      }
    },
    async editPlanObjective (objective) {
      this.mode = 'edit'
      this.editedObjective = objective
      await this.editForm.build()
      this.editForm.fill(objective)
    },
    async removePlanObjective (objective) {
      // Update objectives in-memory and in DB
      const objectives = _.get(this.object, 'objectives', [])
      _.remove(objectives, item => item.id === objective.id)
      await this.updatePlanObjectives(objectives)
    },
    onListReferenceCreated (reference) {
      if (reference) {
        this.list = reference
      }
    },
    onAddFormReferenceCreated (reference) {
      if (reference) {
        this.addForm = reference
      }
    },
    onEditFormReferenceCreated (reference) {
      if (reference) {
        this.editForm = reference
      }
    }
  },
  async created () {
    await this.loadObject()
    // Extract objectives as we will map it using an in-memory service
    // so that we can use standard collection/form components
    this.updatePlanObjectivesServiceStore()
    // Check whether the place has some objectives. Otherwise jump to the add mode
    if (_.isEmpty(this.object.objectives)) this.mode = 'add'
  }
}
</script>
