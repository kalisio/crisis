<template>
  <Card
    v-bind="$props"
    :actions="itemActions"
    :bind-actions="false"
    :options="{ nameField: 'value' }"
    :dense="dense">
    <!--
      Card content
     -->
    <template v-slot:card-content>
      <!-- Members -->
      <KCardSection :title="$t('TagCard.MEMBERS_SECTION')" :dense="dense">
        <KAction
          id="list-members"
          icon="las la-user-friends"
          :label="$t('TagCard.MEMBERS_LABEL', { count: membersCount })"
          :tooltip="$t('TagCard.VIEW_MEMBERS_LABEL')"
          @triggered="onListMembers"
        />
      </KCardSection>
    </template>
  </Card>
</template>

<script>
import { countMembersWithTag } from '../../../common/permissions'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import Card from '../Card.vue'
import { useOrganisations } from '../../composables'

export default {
  name: 'k-tag-card',
  mixins: [kCoreMixins.baseItem],
  components: {
    Card
  },
  data () {
    return {
      membersCount: 0
    }
  },
  computed: {
    dense () {
      return this.$q.screen.lt.sm
    },
    contextId () {
      const { CurrentOrganisation } = useOrganisations()
      return CurrentOrganisation.value._id
    }
  },
  methods: {
    async refreshStats () {
      const membersService = this.$api.getService('members', this.contextId)
      const members = await countMembersWithTag(membersService, this.item._id)
      this.membersCount = members.total
    },
    onListMembers () {
      // Setup filter accordingly
      this.$store.patch('filter', {
        items: [Object.assign({
          service: 'tags',
          field: 'value'
        }, this.item)]
      })
      this.$router.push({ name: 'members-activity', params: { contextId: this.contextId, mode: 'filter' } })
    }
  },
  created () {
    // Compute the count of members having the tag
    this.refreshStats()
  }
}
</script>
