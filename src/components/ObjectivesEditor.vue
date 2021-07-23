<template>
  <k-modal
    :title="title" 
    :buttons="buttons" 
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content" class="column xs-gutter">
      <q-card-section>
        <k-panel id="objectives-toolbar" :content="getToolbar()" :mode="mode" class="no-wrap" />
      </q-card-section>
      <q-card-section id="layer-categories-list" v-if="mode === 'list'">
        <template v-for="objective in objectives">
          <div :key="objective" class="col-12">
            {{ objective }}
          </div>
        </template>
        <!--k-list
          style="min-height: 50px; min-width: 200px"
          service="catalog"
          :renderer="categoryRenderer"
          :nbItemsPerPage="8"
          :base-query="baseQuery"
          :filter-query="filter.query"
          @collection-refreshed="refreshCategories" /-->
      </q-card-section>
      <q-card-section id="layer-category-add" v-if="mode === 'add'">
        <div class="colum q-gutter-y-md">
          <k-form ref="addForm" :schema="getObjectiveSchema()" style="min-width: 300px" />
        </div>
      </q-card-section>
      <q-card-section id="layer-category-edit" v-if="mode === 'edit'">
        <div class="colum q-gutter-y-md">
          <k-form ref="editForm" :schema="getObjectiveSchema()" style="min-width: 300px" />
        </div>
      </q-card-section>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins } from '@kalisio/kdk/core.client'

export default {
  name: 'plan-editor',
  mixins: [
    mixins.baseModal,
    mixins.service,
    mixins.objectProxy
  ],
  props: {
    objectId: {
      type: String,
      required: true
    }
  },
  computed: {
    title () {
      return _.get(this.object, 'name')
    },
    buttons () {
      if (this.mode === 'list') return [
        { id: 'close-button', label: 'CLOSE', renderer: 'form-button', handler: () => this.closeModal() }
      ]
      else if (this.mode === 'add') return [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => { this.mode = 'list' } },
        { id: 'add-button', label: 'ADD', renderer: 'form-button', handler: () => this.add() }
      ]
      else return [
        { id: 'close-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => { this.mode = 'list' } },
        { id: 'add-button', label: 'UPDATE', renderer: 'form-button', handler: () => this.update() }
      ]
    },
    objectives () {
      return _.get(this.object, 'objectives')
    }
  },
  data () {
    return {
      mode: 'list',
      saving: false
    }
  },
  methods: {
    getToolbar () {
      return {
        list: [
          {
            component: 'collection/KSorter',
            id: 'sorter-options',
            tooltip: 'KLayerCategories.SORT',
            options: [
              { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
              { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
            ]
          },
          { component: 'collection/KFilter', style: 'max-width: 200px;' },
          { component: 'QSpace' },
          { id: 'add-objective', icon: 'las la-plus-circle', tooltip: 'ObjectivesEditor.ADD_OBJECTIVE', size: '1rem', handler: () => { this.mode = 'add' } }
        ],
        edit: [],
        add: []
      }
    },
    getObjectiveSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://www.kalisio.xyz/schemas/objective.create.json#',
        title: 'schemas.LAYER_CATEGORY_CREATE_TITLE',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'schemas.LAYER_CATEGORY_NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string', 
            field: {
              component: 'form/KTextareaField',
              label: 'schemas.PLANS_DESCRIPTION_FIELD_LABEL'
            }
          },
          location: {
            type: 'object', 
            field: {
              component: 'form/KLocationField',
              label: 'schemas.PLANS_LOCATION_FIELD_LABEL',
              draggable: true,
              draw: true
            }
          }
        },
        required: ['name', 'description']
      }
    },
    async add () {
      const result = this.$refs.addForm.validate()
      if (result.isValid) {
        const objective = result.values
        /*try {
          await this.$api.getService('catalog').create(category)
          this.savingCategory = false
        } catch (error) {
          this.savingCategory = false
          throw error
        }*/
        this.mode = 'list'
      }
    },
    async update () {
      const result = this.$refs.editForm.validate()
      if (result.isValid) {
        const objective = result.values
        /*try {
          await this.$api.getService('catalog').patch(this.editedCategory._id, result.values)
          this.savingCategory = false
        } catch (error) {
          this.savingCategory = false
          throw error
        }
        this.editedCategory = null*/
        this.mode = 'list'
      }
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-list'] = this.$load('collection/KList')
    this.$options.components['k-form'] = this.$load('form/KForm')
  },
  async created () {
    await this.loadObject()
  }
}
</script>
