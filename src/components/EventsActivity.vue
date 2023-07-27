<template>
  <KPage padding @content-resized="onPageContentResized">
    <template v-slot:page-content>
      <!--
        Events collection
      -->
      <KGrid
        v-if="!planId"
        ref="eventsGrid"
        service="events"
        :renderer="renderer"
        :contextId="contextId"
        :base-query="baseQuery"
        :filter-query="filterQuery"
        :list-strategy="'smart'">
        <template v-slot:empty-section>
          <div class="absolute-center">
            <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_GRID')" />
          </div>
        </template>
      </KGrid>
      <KBoard
        v-else-if="height"
        ref="eventsBoard"
        :columns="boardColumns"
        :height="height"
      />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="events"></router-view>
    </template>
  </KPage>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import { permissions } from '@kalisio/kdk/core.common'
import { usePlan } from '../composables'
import mixins from '../mixins'

const activityMixin = kCoreMixins.baseActivity('eventsActivity')

export default {
  mixins: [
    activityMixin
  ],
  provide () {
    return {
      kActivity: this
    }
  },
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      sorter: this.$store.get('sorter'),
      filter: this.$store.get('filter'),
      height: undefined
    }
  },
  watch: {
    async $route (to, from) {
      // Need to refresh the fab because the plan has probably changed
      await this.refreshFab()
    },
    plan: {
      handler () {
        this.refreshFab()
      }
    }
  },
  computed: {
    renderer () {
      const renderer = { component: 'EventCard' }
      renderer.dense = (this.planId ? true : this.$q.screen.lt.sm)
      if (this.planId) renderer.class = 'full-width'
      return _.merge(renderer, this.activityOptions.items)
    },
    baseQuery () {
      const query = _.clone(this.sorter.query)
      // When displaying events of all plans we'd like to have the plan object directly to ease processing
      if (!this.planId) Object.assign(query, { planAsObject: true })
      Object.assign(query, this.planQuery)
      return query
    },
    filterQuery () {
      const query = _.clone(this.filter.query)
      Object.assign(query, this.planObjectiveQuery)
      return query
    },
    columnWidth () {
      if (this.$q.screen.lt.md) return 280
      if (this.$q.screen.lt.lg) return 360
      return 440
    },
    boardColumns () {
      const props = {
        service: 'events',
        renderer: this.renderer,
        contextId: this.contextId,
        filterQuery: this.filterQuery
      }
      return [{
        label: 'EventsActivity.TODO_LABEL',
        value: 'todo',
        props: _.defaults({
          baseQuery: Object.assign({ participants: { $eq: [] } }, this.baseQuery)
        }, props),
        width: this.columnWidth
      }, {
        label: 'EventsActivity.DOING_LABEL',
        value: 'doing',
        props: _.defaults({
          baseQuery: Object.assign({ participants: { $ne: [] } }, this.baseQuery),
        }, props),
        width: this.columnWidth
      }, {
        label: 'EventsActivity.DONE_LABEL',
        value: 'done',
        props: _.defaults({
          // Override service & component
          service: 'archived-events',
          renderer: Object.assign({}, this.renderer, { component: 'ArchivedEventCard' }),
          baseQuery: Object.assign({ deletedAt: { $exists: true } }, this.baseQuery)
        }, props),
        width: this.columnWidth
      }]
    }
  },
  methods: {
    async configureActivity () {
      activityMixin.methods.configureActivity.call(this)
      this.refreshFab()
    },
    async refreshFab () {
      const userRole = permissions.getRoleForOrganisation(this.$store.get('user'), this.contextId)
      if (this.$can('create', 'events', this.contextId)) {
        const content = []
        const eventTemplatesService = this.$api.getService('event-templates')
        let response = await eventTemplatesService.find({ query: { $limit: 0 } })
        const batchSize = 50
        let batchCount = Math.floor(response.total / batchSize)
        const remainder = response.total % batchSize
        if (remainder > 0) batchCount++
        let offset = 0
        for (let i = 0; i < batchCount; i++) {
          response = await eventTemplatesService.find({
            query: {
              $or: [
                { permission: { $exists: false } },
                { permission: { $in: permissions.getJuniorRoles(userRole) } }
              ],
              $skip: offset,
              $limit: batchSize,
              $select: ['name', 'icon']
            }
          })
          const templates = response.data
          templates.forEach(template => {
            // It is easier to access the DOM with template names, eg in tests, so we use it as action name whenever possible
            // However we have to check about duplicated names
            const doublons = templates.filter(otherTemplate => otherTemplate.name.toLowerCase() === template.name.toLowerCase())
            content.push({
              id: 'create-' + (doublons.length > 1 ? template._id : _.kebabCase(template.name)),
              label: template.name,
              icon: template.icon.name,
              color: template.icon.color,
              route: {
                name: 'create-event',
                params: { contextId: this.contextId, templateId: template._id },
                query: { plan: this.planId }
              }
            })
          })
          offset = offset + batchSize
        }
        this.setFab(content)
      }
    },
    onPageContentResized (size) {
      this.height = size.height - 120
    },
    async onUserChanged () {
      await this.refreshFab()
    },
    onEventUpdated () {
      // Retrieve archived events collection
      const board = this.$refs.eventsBoard
      const columns = board.getColumns(['todo', 'doing'])
      // Force a refresh
      columns.forEach(column => column.resetCollection())
    },
    onEventRemoved () {
      // Retrieve archived events collection
      const board = this.$refs.eventsBoard
      const column = board.getColumn('done')
      // Force a refresh
      column.refreshCollection()
    }
  },
  created () {
    this.$events.on('user-changed', this.refreshFab)
  },
  mounted () {
    // Keep track of changes once loaded, done on mounted as we need the plan ID which is retrieved on before mount in composable.
    // Indeed, archived events do not emit real-time service events, we need to manually update the archived events collection.
    // Morevoer, if the item property used to assign the column is changed it can cause a problem.
    // Indeed, the item will be correctly append to the new column as it is not already present.
    // However, the item will not be removed from the previous column as it is not a remove operation and not tracked anymore as no more matching the query.
    if (this.planId) {
      const eventsService = this.$api.getService('events', this.contextId)
      eventsService.on('patched', this.onEventUpdated)
      eventsService.on('updated', this.onEventUpdated)
      eventsService.on('removed', this.onEventRemoved)
    }
  },
  beforeUnmount () {
    this.$events.off('user-changed', this.refreshFab)
    if (this.planId) {
      const eventsService = this.$api.getService('events', this.contextId)
      eventsService.off('removed', this.onEventUpdated)
      eventsService.off('removed', this.onEventUpdated)
      eventsService.off('removed', this.onEventRemoved)
    }
  },
  setup (props) {
    return {
      ...usePlan({ contextId: props.contextId })
    }
  }
}
</script>
