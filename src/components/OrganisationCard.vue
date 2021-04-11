<template>
  <k-card v-bind="$props" :itemActions="actions" :bind-actions="false">
    <!--
      Card header
    -->
    <template v-slot:card-avatar>
      <k-avatar :object="item" :contextId="item._id" size="6rem" />
    </template>
    <!--
      Card content
     -->
    <div slot="card-content">
      <q-separator />
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
      // Count events
      const eventsService = this.$api.getService('events', this.item._id)
      const response = await eventsService.find({ query: {}, $limit: 0 })
      this.$set(this.stats, 'events', response.total)
      // Count members
      const membersService = this.$api.getService('members', this.item._id)
      await Promise.all(this.roleNames.map(async (role) => {
        const response = await permissions.countMembersOfOrganisation(membersService, this.item._id, role)
        this.$set(this.stats, role, response.total)
      }))
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
    this.roleNames = permissions.RoleNames
    this.roleIcons = this.$config('roles.icons')
    this.roleLabels = this.$config('roles.labels')
    this.refreshStats()
  }
}
</script>
