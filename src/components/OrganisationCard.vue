<template>
  <k-card v-bind="$props" :actions="itemActions" :bind-actions="false">
    <!--
      Card header
    -->
    <template v-slot:card-header>
      <div v-if="userRole" class="q-pa-sm row justify-end">
        <q-badge id="role-badge" color="grey-7">
          {{ $t(userRole) }}
        </q-badge>
      </div>
    </template>
    <!--
      Card avatar
    -->
    <template v-slot:card-avatar>
      <k-avatar :object="item" :contextId="item._id" size="4rem" />
    </template>
    <!--
      Card content
     -->
    <div slot="card-content">
      <!-- Events section -->
      <q-list bordered>
        <q-item clickable @click.native.prevent="$router.push({ name: 'events-activity', params: { contextId: item._id } })">
          <q-item-section avatar>
            <q-icon name="las la-fire" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('OrganisationCard.EVENTS', { count: this.stats.events }) }}</q-item-label>
            <q-tooltip>{{ $t('OrganisationCard.VIEW_EVENTS') }}</q-tooltip>
          </q-item-section>
          <q-item-section side>
            <div class="row justify-between">
              <k-action 
                id= "map"
                icon= "las la-map"
                :tooltip="$t('OrganisationCard.VIEW_CATALOG')"
                :route="{ name: 'catalog-activity', params: { contextId: this.item._id } }" 
                :propagate="false" />
              <k-action 
                id= "history"
                icon= "las la-history"
                :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_EVENTS')"
                :route="{ name: 'archived-events-activity', params: { contextId: this.item._id } }" 
                :propagate="false" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Assets section -->
      <q-list bordered>
        <q-item 
          v-if="isCountAvailable('members')"
          clickable 
          @click.native.prevent="$router.push({ name: 'members-activity', params: { contextId: item._id } })">
          <q-item-section avatar>
            <q-icon name="las la-user-friends" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('OrganisationCard.MEMBERS', { count: stats.members }) }}</q-item-label>
            <q-tooltip>{{ $t('OrganisationCard.VIEW_MEMBERS') }}</q-tooltip>
          </q-item-section>
        </q-item>
        <q-item 
          v-if="isCountAvailable('tags')"
          clickable 
          @click.native.prevent="$router.push({ name: 'tags-activity', params: { contextId: item._id } })">
          <q-item-section avatar>
            <q-icon name="las la-tag" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('OrganisationCard.TAGS', { count: stats.tags }) }}</q-item-label>
            <q-tooltip>{{ $t('OrganisationCard.VIEW_TAGS') }}</q-tooltip>
          </q-item-section>
        </q-item>
        <q-item 
          v-if="isCountAvailable('groups')"
          clickable 
          @click.native.prevent="$router.push({ name: 'groups-activity', params: { contextId: item._id } })">
          <q-item-section avatar>
            <q-icon name="las la-sitemap" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('OrganisationCard.GROUPS', { count: stats.groups }) }}</q-item-label>
            <q-tooltip>{{ $t('OrganisationCard.VIEW_GROUPS') }}</q-tooltip>
          </q-item-section>
        </q-item>
        <q-item 
          v-if="isCountAvailable('event-templates')"
          clickable 
          @click.native.prevent="$router.push({ name: 'event-templates-activity', params: { contextId: item._id } })">
          <q-item-section avatar>
            <q-icon name="las la-project-diagram" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ $t('OrganisationCard.EVENT_TEMPLATES', { count: stats['event-templates'] }) }}</q-item-label>
            <q-tooltip>{{ $t('OrganisationCard.VIEW_EVENT_TEMPLATES') }}</q-tooltip>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </k-card>
</template>

<script>
import { permissions } from '@kalisio/kdk/core.common'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'organisation-card',
  mixins: [kCoreMixins.baseItem],
  data () {
    return {
      role: null,
      stats: {},
      roleLabels: []
    }
  },
  methods: {
    key (scope) {
      return this.item._id + '-' + scope
    },
    isCountAvailable (scope) {
      return !_.isNil(this.stats[scope])
    },
    async refreshStats () {
      const scopes = ['events', 'members', 'tags', 'groups', 'event-templates']
      for (const scope of scopes) {
        const service = this.$api.getService(scope, this.item._id)
        const response = await service.find({ query: {}, $limit: 0 })
        this.$set(this.stats, scope, response.total)
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-action'] = this.$load('frame/KAction')
    // We will use the member role to illustrate the number of users
    this.userRole = _.upperCase(permissions.getRoleForOrganisation(this.$store.get('user'), this.item._id))
    this.roleLabels = this.$config('roles.labels')
    this.refreshStats()
  }
}
</script>
