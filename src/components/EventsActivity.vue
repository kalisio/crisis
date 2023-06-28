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
import mixins from '../mixins'

const activityMixin = kCoreMixins.baseActivity('eventsActivity')

export default {
  mixins: [
    activityMixin,
    mixins.plans
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
      const dense = (this.planId ? true : this.$q.screen.lt.sm)
      return _.merge({ component: 'EventCard', dense }, this.activityOptions.items)
    },
    baseQuery () {
      const query = _.clone(this.sorter.query)
      // When displaying events of all plans we'd like to have the plan object directly to ease processing
      if (!this.planId) Object.assign(query, { planAsObject: true })
      Object.assign(query, this.getPlanQuery())
      return query
    },
    filterQuery () {
      const query = _.clone(this.filter.query)
      Object.assign(query, this.getPlanObjectiveQuery())
      return query
    },
    columnWidth () {
      if (this.$q.screen.lt.md) return 280
      if (this.$q.screen.lt.lg) return 360
      return 440
    },
    boardColumns () {
      return [{
        label: 'EventsActivity.TODO_LABEL',
        value: 'todo',
        props: {
          service: 'events',
          renderer: this.renderer,
          contextId: this.contextId,
          baseQuery: Object.assign({ participants: { $eq: [] } }, this.baseQuery),
          filterQuery: this.filterQuery
        },
        width: this.columnWidth
      }, {
        label: 'EventsActivity.DOING_LABEL',
        value: 'doing',
        props: {
          service: 'events',
          renderer: this.renderer,
          contextId: this.contextId,
          baseQuery: Object.assign({ participants: { $ne: [] } }, this.baseQuery),
          filterQuery: this.filterQuery
        },
        width: this.columnWidth
      }, {
        label: 'EventsActivity.DONE_LABEL',
        value: 'done',
        props: {
          service: 'archived-events',
          renderer: { component: 'ArchivedEventCard', dense: true },
          contextId: this.contextId,
          baseQuery: Object.assign({ deletedAt: { $exists: true } }, this.baseQuery),
          filterQuery: this.filterQuery
        },
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
    // Keep track of changes once loaded
    // Indeed, archived events do not emit real-time service events
    // so that we need to manually update the archived events collection
    if (this.planId) {
      const eventsService = this.$api.getService('events', this.contextId)
      eventsService.on('removed', this.onEventRemoved)
    }
  },
  beforeUnmount () {
    this.$events.off('user-changed', this.refreshFab)
    if (this.planId) {
      const eventsService = this.$api.getService('events', this.contextId)
      eventsService.off('removed', this.onEventRemoved)
    }
  }
}
</script>
