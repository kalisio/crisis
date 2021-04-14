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
      <k-avatar class="q-pa-sm" :object="item" :contextId="item._id" size="4rem" />
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
                v-if="canAccessCatalog"
                id= "map"
                icon= "las la-map"
                :tooltip="$t('OrganisationCard.VIEW_CATALOG')"
                :route="{ name: 'catalog-activity', params: { contextId: this.item._id } }" 
                :propagate="false" />
              <k-action
                v-if="canAccessArchivedEvents"
                id= "history"
                icon= "las la-clipboard-list"
                :tooltip="$t('OrganisationCard.VIEW_ARCHIVED_EVENTS')"
                :route="{ name: 'archived-events-activity', params: { contextId: this.item._id } }" 
                :propagate="false" />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <!-- Assets section -->
      <q-list bordered>
        <template v-for="scope in scopes.slice(1)">
          <q-item 
            v-if="isCountAvailable(scope.name)"
            :key="scope.key"
            clickable 
            @click.native.prevent="$router.push({ name: `${scope.name}-activity`, params: { contextId: item._id } })">
            <q-item-section avatar>
              <q-icon :name="scope.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ $t(`OrganisationCard.${scope.key}`, { count: stats[scope.name] }) }}
              </q-item-label>
              <q-tooltip>
                {{ $t(`OrganisationCard.VIEW_${scope.key}`) }}
              </q-tooltip>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
      <!-- PLan section -->
      <q-list bordered>
        <q-item @click.native.prevent="$router.push({ name: 'events-activity', params: { contextId: item._id } })">
          <q-item-section avatar>
            <q-icon name="las la-credit-card" />
          </q-item-section>          
          <q-item-section v-if="subscription">
            <q-item-label>
              {{ $t(`plans.${subscription.plan}_LABEL`) }}
              <q-tooltip>
                <template v-for="scope in scopes">
                  <q-chip 
                    v-if="hasQuota(scope.name)" 
                    :key="scope.name" 
                    :icon="scope.icon" 
                    :label="getQuota(scope.name)"
                    color="white"
                    outline 
                    square   
                    size="sm" />
                </template>
              </q-tooltip>
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row justify-end">
              <k-action 
                v-if="canAccessBilling"
                id= "map"
                icon= "las la-cog"
                :tooltip="$t('OrganisationCard.MANAGE_SUBSCRIPTIONS')"
                :route="{ name: 'organisation-settings-activity', params: { contextId: this.item._id, tab: 'billing' } }" 
                :propagate="false" />
            </div>
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
      scopes: [ 
        { key: 'EVENTS', name: 'events', icon: 'las la-fire' },
        { key: 'MEMBERS', name: 'members', icon: 'las la-user-friends' },
        { key: 'TAGS', name: 'tags', icon: 'las la-tag' },
        { key: 'GROUPS', name: 'groups', icon: 'las la-sitemap' },
        { key: 'EVENT_TEMPLATES', name: 'event-templates', icon: 'las la-project-diagram' }
      ],
      userRole: null,
      subscription: null,
      stats: {}
    }
  },
  computed: {
    canAccessCatalog () {
      return this.$can('update', 'catalog', this.item._id)
    },
    canAccessArchivedEvents () {
      return this.$can('read', 'archived-events', this.item._id)
    },
    canAccessBilling () {
      return this.$can('update', 'organisations', null, { _id: this.item._id })
    }
  },
  methods: {
    key (scope) {
      return this.item._id + '-' + scope
    },
    isCountAvailable (scope) {
      return !_.isNil(this.stats[scope])
    },
    hasQuota (scope) {
      if (!this.subscription) return false
      return _.get(this.quotas, `${this.subscription.plan}.${scope}`) > 0
    },
    getQuota (scope) {
      if (!this.subscription) return undefined
      return _.get(this.quotas, `${this.subscription.plan}.${scope}`)
    },
    async refreshStats () {
      this.quotas = this.$store.get('capabilities.api.quotas', {})
      for (const scope of this.scopes) {
        const service = this.$api.getService(scope.name, this.item._id)
        const response = await service.find({ query: {}, $limit: 0 })
        this.$set(this.stats, scope.name, response.total)
      }
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-action'] = this.$load('frame/KAction')
    // Retrieve the billing perspective
    const perspective = await this.$api.getService('organisations').get(this.item._id, { query: { $select: ['billing'] } })
    this.subscription = _.get(perspective, 'billing.subscription')
    // Retrieve the user role
    this.userRole = _.upperCase(permissions.getRoleForOrganisation(this.$store.get('user'), this.item._id))
    // Compute the stats
    this.refreshStats()
  }
}
</script>
