<template>
  <k-card v-bind="$props" :itemActions="actions" :bind-actions="false">
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
      <k-avatar :object="item" :contextId="item._id" size="5rem" />
    </template>
    <!--
      Card content
     -->
    <div slot="card-content">
      <q-separator />
      <div class="q-pa-md row justify-between items-center">
        <div>
          <k-action 
            id= "events"
            size="1rem"
            icon= "las la-fire"
            :label="$t('OrganisationCard.EVENTS', { count: this.stats.events })" 
            :tooltip="$t('OrganisationCard.VIEW_EVENTS')"
            :route="{ name: 'events-activity', params: { contextId: this.item._id } }" />
        </div>
        <div>
           <k-action 
            id= "map"
            size="1rem"
            icon= "las la-map"
            :tooltip="$t('OrganisationCard.VIEW_CATALOG')"
            :route="{ name: 'catalog-activity', params: { contextId: this.item._id } }" />
           <k-action 
            id= "history"
            size="1rem"
            icon= "las la-history"
            :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_EVENTS')"
            :route="{ name: 'archived-events-activity', params: { contextId: this.item._id } }" />
        </div>
      </div>
      <q-separator />
      <div class="full-width q-pa-md column">
        <div v-if="isCountAvailable('members')" class="row items-center">
          <div class="col-grow">{{ $t('OrganisationCard.MEMBERS') }}</div>
          <q-badge color="grey-7" outline>{{ stats.members }}</q-badge>
          <k-action 
            id="event-templates" 
            icon="las la-eye" 
            tooltip="OrganisationCard.VIEW_MEMBERS" 
            :route="{ name: 'members-activity', params: { contextId: this.item._id } }" />
        </div>
        <div v-if="isCountAvailable('tags')" class="row items-center">
          <div class="col-grow">{{ $t('OrganisationCard.TAGS') }}</div>
          <q-badge color="grey-7" outline>{{ stats.tags }}</q-badge>
          <k-action 
            id="event-templates" 
            icon="las la-eye" 
            tooltip="OrganisationCard.VIEW_TAGS" 
            :route="{ name: 'tags-activity', params: { contextId: this.item._id } }" />
        </div>
        <div v-if="isCountAvailable('groups')" class="row items-center">
          <div class="col-grow">{{ $t('OrganisationCard.GROUPS') }}</div>
          <q-badge color="grey-7" outline>{{ stats.groups }}</q-badge>
          <k-action 
            id="event-templates" 
            icon="las la-eye" 
            tooltip="OrganisationCard.VIEW_GROUPS" 
            :route="{ name: 'groups-activity', params: { contextId: this.item._id } }" />
        </div>
        <div v-if="isCountAvailable('event-templates')" class="row items-center">
          <div class="col-grow">{{ $t('OrganisationCard.EVENT_TEMPLATES') }}</div>
          <q-badge color="grey-7" outline>{{ stats['event-templates'] }}</q-badge>
          <k-action 
            id="event-templates" 
            icon="las la-eye" 
            tooltip="OrganisationCard.VIEW_EVENT_TEMPLATES" 
            :route="{ name: 'event-templates-activity', params: { contextId: this.item._id } }" />
        </div>
      </div>
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
    }/*,
    /*onListMembers (role, index) {
      // Setup filter accordingly
      this.$store.patch('filter', {
        items: [Object.assign({
          service: 'organisations',
          field: 'permissions',
          baseQuery: { _id: this.item._id },
          icon: this.roleIcons[index]
        }, { permissions: role, value: this.$t(this.roleLabels[index]) })]
      })
      this.$router.push({ name: 'members-activity', params: { contextId: this.item._id } })
    }*/
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
