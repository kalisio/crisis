<template>
  <k-modal
    id="catalog-projects-modal"
    :title="title"
    :toolbar="toolbar"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <div id="catalog-projects-content">
      <q-card-section id="catalog-projects-list" v-if="mode === 'list'">
        <k-list
          style="min-height: 50px; min-width: 200px"
          service="projects"
          :renderer="projectRenderer"
          :nbItemsPerPage="8"
          :base-query="{}"
          :filter-query="filter.query"
          @collection-refreshed="refreshProjects" />
      </q-card-section>
      <q-card-section id="catalog-projects-add" v-if="mode === 'add'">
        <k-form :ref="onAddFormCreated" :schema="projectSchema" style="min-width: 300px" />
      </q-card-section>
      <q-card-section id="catalog-projects-edit" v-if="mode === 'edit'">
        <k-form :ref="onEditFormCreated" @form-ready="onEditFormReady" :schema="projectSchema" style="min-width: 300px" />
      </q-card-section>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'catalog-projects',
  mixins: [
    kCoreMixins.baseModal
  ],
  inject: ['kActivity'],
  computed: {
    title () {
      if (this.mode === 'add') {
        return this.$t('CatalogProjects.ADD_TITLE')
      } else if (this.mode === 'edit') {
        return this.$t('CatalogProjects.UPDATE_TITLE')
      } else {
        return this.$t('CatalogProjects.TITLE')
      }
    },
    toolbar () {
      if (this.mode === 'list') {
        return [
          {
            component: 'collection/KSorter',
            id: 'catalog-projects-sorter-options',
            tooltip: 'CatalogProjects.SORT',
            options: [
              { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
              { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } },
              { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
              { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 } }
            ]
          },
          { component: 'collection/KFilter', style: 'max-width: 200px;' },
          { component: 'QSpace' },
          {
            id: 'add-catalog-project',
            icon: 'las la-plus-circle',
            tooltip: 'CatalogProjects.CREATE_PROJECT',
            size: '1rem',
            handler: () => { this.mode = 'add' }
          }
        ]
      } else {
        return []
      }
    },
    buttons () {
      const buttons = []
      buttons.push({
        id: 'close-button',
        label: 'CLOSE',
        renderer: 'form-button',
        handler: () => this.closeModal(),
        outline: (this.mode !== 'list')
      })
      if ((this.mode !== 'list') && (this.count > 0)) {
        buttons.push({
          id: 'back-button',
          label: 'CatalogProjects.BACK_BUTTON',
          renderer: 'form-button',
          outline: true,
          handler: () => { this.mode = 'list' }
        })
      }
      if (this.mode === 'add') {
        buttons.push({
          id: 'create-catalog-project',
          label: 'CatalogProjects.ADD_BUTTON',
          renderer: 'form-button',
          loading: this.savingProject,
          handler: this.onAdd
        })
      } else if (this.mode === 'edit') {
        buttons.push({
          id: 'edit-catalog-project',
          label: 'CatalogProjects.EDIT_BUTTON',
          renderer: 'form-button',
          loading: this.savingProject,
          handler: this.onEdit
        })
      }
      return buttons
    },
    projectSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://www.kalisio.xyz/schemas/catalog-project.create.json#',
        title: 'schemas.CATALOG_PROJECT_CREATE_TITLE',
        description: 'Catalog project creation schema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'schemas.CATALOG_PROJECT_NAME_FIELD_LABEL'
            }
          },
          layers: {
            type: 'array',
            multiselect: true,
            uniqueItems: true,
            services: [{
              service: 'catalog',
              field: 'name',
              description: 'description',
              baseQuery: {},
              icon: {
                name: 'las la-layer-group'
              }
            }, {
              service: 'catalog',
              context: null,
              field: 'name',
              description: 'description',
              baseQuery: {},
              icon: {
                name: 'las la-layer-group'
              }
            }],
            field: {
              component: 'form/KItemField',
              label: 'schemas.CATALOG_PROJECT_LAYERS_FIELD_LABEL'
            }
          },
          views: {
            type: 'array',
            multiselect: true,
            uniqueItems: true,
            services: [{
              service: 'catalog',
              field: 'name',
              description: 'description',
              baseQuery: {
                type: 'Context'
              },
              icon: {
                name: 'las la-star'
              }
            }],
            field: {
              component: 'form/KItemField',
              label: 'schemas.CATALOG_PROJECT_VIEWS_FIELD_LABEL'
            }
          }
        },
        required: ['name']
      }
    }
  },
  data () {
    return {
      filter: this.$store.get('filter'),
      sorter: this.$store.get('sorter'),
      mode: 'list',
      count: 0,
      savingProject: false,
      projectRenderer: {
        component: 'collection/KItem',
        actions: [{
          id: 'edit-catalog-project',
          icon: 'las la-file-alt',
          tooltip: 'CatalogProjects.EDIT_PROJECT',
          handler: (context) => this.editProject(context.item)
        }, {
          id: 'view-catalog-project',
          icon: 'las la-eye',
          tooltip: 'CatalogProjects.VIEW_PROJECT',
          handler: (context) => this.viewProject(context.item)
        }, {
          id: 'remove-catalog-project',
          icon: 'las la-trash',
          tooltip: 'CatalogProjects.REMOVE_PROJECT',
          handler: (context) => this.removeProject(context.item)
        }]
      }
    }
  },
  methods: {
    serializeProject (project) {
      // Keep only track of IDs, take care that layers come from global/local catalog
      project.layers = _.map(project.layers, (layer) => _.pick(layer, ['_id', 'context']))
      project.views = _.map(project.views, (view) => _.pick(view, ['_id']))
    },
    async onAdd () {
      const result = this.addForm.validate()
      if (result.isValid) {
        const project = result.values
        this.serializeProject(project)
        this.savingProject = true
        try {
          await this.$api.getService('projects').create(project)
          this.savingProject = false
        } catch (error) {
          this.savingProject = false
          throw error
        }
        this.mode = 'list'
      }
    },
    async onEdit () {
      const result = this.editForm.validate()
      if (result.isValid) {
        const project = result.values
        this.serializeProject(project)
        this.savingProject = true
        try {
          await this.$api.getService('projects').patch(this.editedProject._id, project)
          this.savingProject = false
        } catch (error) {
          this.savingProject = false
          throw error
        }
        this.editedProject = null
        this.mode = 'list'
      }
    },
    refreshProjects (items) {
      this.count = items.length
      if (this.count == 0) {
        if (!this.filter.pattern) this.mode = 'add'
      }
    },
    onAddFormCreated (ref) {
      if (ref && !this.addForm) {
        this.addForm = ref
      }
    },
    onEditFormCreated (ref) {
      if (ref && !this.editForm) {
        this.editForm = ref
      }
    },
    onEditFormReady (form) {
      this.editForm.fill(this.editedProject)
    },
    async editProject (project) {
      this.mode = 'edit'
      this.editedProject = project
    },
    async viewProject (project) {
      this.$router.push({
        name: 'catalog-activity',
        query: Object.assign({ project: project._id }, this.$route.query),
        params: Object.assign({}, this.$route.params)
      })
    },
    removeProject (project) {
      this.$api.getService('projects').remove(project._id)
    }
  }
}
</script>
