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
      <div class="q-pa-md row justify-center items-center">
        <q-btn v-if="isCountAvailable('events')" :key="key('events')" flat small no-caps rounded dense color="primary"
          :id="key('events')"
          icon="las la-fire"
          :label="$t('OrganisationCard.EVENTS', { count: stats.events })"
          @click="onListEvents()"/>
      </div>
      <q-separator />
      <div class="full-width q-pa-md column">
        <div v-if="isCountAvailable('members')" class="row items-center">
          <div class="col-grow">{{ $t('OrganisationCard.MEMBERS') }}</div>
          <q-badge color="grey-7" outline>{{ stats.members }}</q-badge>
        </div>
        <div v-if="isCountAvailable('tags')" class="row items-center">
          <div class="col-grow">{{ $t('OrganisationCard.TAGS') }}</div>
          <q-badge color="grey-7" outline>{{ stats.tags }}</q-badge>
        </div>
        <div v-if="isCountAvailable('groups')" class="row items-center">
          <div class="col-grow">{{ $t('OrganisationCard.GROUPS') }}</div>
          <q-badge color="grey-7" outline>{{ stats.groups }}</q-badge>
        </div>
        <div v-if="isCountAvailable('event-templates')" class="row items-center">
          <div class="col-grow">{{ $t('OrganisationCard.EVENT_TEMPLATES') }}</div>
          <q-badge color="grey-7" outline>{{ stats['event-templates'] }}</q-badge>
        </div>
      </div>
      <!--q-separator />
      <div class="q-pa-md row justify-around items-center">
        <q-btn v-if="isCountAvailable('events')" :key="key('events')" flat small rounded dense color="primary" class="col-3"
          :id="key('events')"
          icon="las la-fire"
          :label="stats.events"
          @click="onListEvents()"/>
        <template v-for="(role, index) in roleNames">
          <q-btn v-if="isCountAvailable(role)" :key="key(role)" flat small rounded dense color="primary" class="col-3"
            :id="key(role)"
            :icon="roleIcons[index]"
            :label="stats[role]"
            @click="onListMembers(role, index)"/>
        </template>
      </div-->
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
      // Count events
     /* const eventsService = this.$api.getService('events', this.item._id)
      const response = await eventsService.find({ query: {}, $limit: 0 })
      this.$set(this.stats, 'events', response.total)
      // Count members
      const membersService = this.$api.getService('members', this.item._id)
      await Promise.all(this.roleNames.map(async (role) => {
        const response = await permissions.countMembersOfOrganisation(membersService, this.item._id, role)
        this.$set(this.stats, role, response.total)
      })) */
    },
    onListEvents () {
      this.$router.push({ name: 'events-activity', params: { contextId: this.item._id } })
    },
    onListMembers (role, index) {
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
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    // We will use the member role to illustrate the number of users
    this.userRole = _.upperCase(permissions.getRoleForOrganisation(this.$store.get('user'), this.item._id))
    this.roleNames = permissions.RoleNames
    this.roleIcons = this.$config('roles.icons')
    this.roleLabels = this.$config('roles.labels')
    this.refreshStats()
  }
}
</script>
