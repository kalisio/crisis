<template>
  <KPage padding>
    <!--
      Members collection, cannot rely on smart strategy here because membership is not managed at service level
      but using authorisations on users
    -->
    <KGrid
      :ref="onGridReferenceCreated"
      service="members"
      :renderer="renderer"
      :contextId="contextId"
      :base-query="baseQuery"
      :filter-query="filter.query">
      <template v-slot:empty-section>
        <div class="absolute-center">
          <KStamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KGrid.EMPTY_LABEL')" />
        </div>
      </template>
    </KGrid>
    <!--
      Router view to enable routing to modals
    -->
    <router-view service="members"></router-view>
  </KPage>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, Exporter } from '@kalisio/kdk/core.client'
import { getRoleForOrganisation } from '../../../common/permissions'

const activityName = 'membersActivity'
const activityMixin = kCoreMixins.baseActivity(activityName)

export default {
  name: activityName,
  mixins: [activityMixin],
  provide () {
    return {
      kActivity: this
    }
  },
  props: {
    contextId: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: undefined
    }
  },
  computed: {
    baseQuery () {
      let query = _.clone(this.sorter.query)
      if (this.filters.includes('guest')) {
        query = Object.assign(query, { expireAt: { $ne: null } })
      }
      const roleFilters = _.intersection(['owner', 'manager', 'member'], this.filters)
      if (roleFilters.length > 0) {
        query = Object.assign(query, { organisations: { $elemMatch: { _id: this.contextId, permissions: { $in: roleFilters } } } })
      }
      return query
    }
  },
  data () {
    return {
      sorter: this.$store.get('sorter'),
      filter: this.$store.get('filter'),
      filters: [],
      // Make this configurable from app
      renderer: _.merge({
        component: 'team/MemberCard',
        options: {
          descriptionField: 'email'
        }
      }, this.activityOptions.items)
    }
  },
  methods: {
    onGridReferenceCreated (reference) {
      if (reference) {
        this.membersGrid = reference
      }
    },
    configureActivity () {
      activityMixin.methods.configureActivity.call(this)
      this.subscribeUsers()
      if (this.mode) this.setTopPaneMode(this.mode)
    },
    subscribeUsers () {
      // Remove previous listener if any
      this.unsubscribeUsers()
      const usersService = this.$api.getService('users')
      // Members service is only a filter on users but it will not trigger
      // any remove operation when adding/removing permissions,
      // thus it will not update the member list automatically
      usersService.on('patched', this.refresh)
      usersService.on('removed', this.refresh)
    },
    unsubscribeUsers () {
      const usersService = this.$api.getService('users')
      usersService.off('patched', this.refresh)
      usersService.off('removed', this.refresh)
    },
    exportMembers () {
      Exporter.export({
        service: 'members',
        context: this.contextId,
        formats: [
          { label: 'CSV', format: 'csv' },
          { label: 'JSON', format: 'json' }
        ],
        gzip: false
      })
    },
    refresh (user) {
      if (this.membersGrid) {
        const member = _.find(this.membersGrid.items, { _id: user._id })
        const role = getRoleForOrganisation(user, this.contextId)
        // If the user has a role in this organisation and
        // was not in our list he might have been added so refresh
        const newMember = (role && !member)
        // If the user has not a role in this organisation and
        // was in our list he might have been removed so refresh
        const oldMember = (!role && member) 
        // If the user was invited in this organisation and
        // he has initialized his account refresh
        const isInvited = (member && member.expireAt)
        if (newMember || oldMember || isInvited) {
          this.membersGrid.refreshCollection()
        }
      }
    }
  },
  beforeUnmount () {
    this.unsubscribeUsers()
  }
}
</script>
