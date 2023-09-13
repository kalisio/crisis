<template>
  <div>
    <k-card
      v-bind="$props"
      :header="header"
      :actions="itemActions"
      :bind-actions="false"
      :dense="dense"
      :expandable="true"
      @expanded="isExpanded = true"
      @collapsed="isExpanded = false"
    >
      <!--
        Card content
       -->
      <template v-slot:card-content>
        <!-- Plan section is only visible in event logbook -->
        <KCardSection
          v-if="planName"
          :title="$t('ArchivedEventCard.PLAN_SECTION')"
          :hideHeader="!isExpanded"
          :actions="planActions"
          :context="$props"
          :dense="dense"
        >
          <div class="row full-width items-center">
          <q-badge :color="planColor" :multi-line="true">
            {{ planName }}
            <q-tooltip v-if="planDescription">
              {{ planDescription }}
            </q-tooltip>
          </q-badge>
          <q-space />
          <k-panel v-if="!isExpanded" :content="planActions" :context="$props" />
          <KStamp v-if="!planName" :text="'ArchivedEventCard.UNDEFINED_PLAN_LABEL'" direction="horizontal" />
          </div>
        </KCardSection>
        <!-- Objective section is only visible in plan logbook -->
        <KCardSection
          v-if="plan && !planName && (isExpanded || objective)"
          :title="$t('ArchivedEventCard.OBJECTIVE_SECTION')"
          :hideHeader="!isExpanded"
          :dense="dense"
        >
          <q-badge v-if="objective" :label="objective" color="grey-7" :multi-line="true"/>
          <KStamp v-else text="ArchivedEventCard.UNDEFINED_OBJECTIVE_LABEL" direction="horizontal" />
        </KCardSection>
        <!-- Location section -->
        <KLocationCardSection
          v-if="isExpanded"
          :location="item.location"
          :actions="locationActions"
          :context="$props"
          :dense="dense"
        />
        <!-- Participants section -->
        <KCardSection v-if="isExpanded"
          :title="$t('ArchivedEventCard.PARTICIPANTS_SECTION')"
          :context="$props"
          :dense="dense"
        >
          <div v-if="hasParticipants">
            <k-chips-pane class="q-pl-sm" :chips="item.participants" :value-path="['profile.name', 'value', 'name']" />
          </div>
          <div v-else>
            {{ $t('ArchivedEventCard.NO_PARTICIPANTS_LABEL')}}
          </div>
        </KCardSection>
        <!-- Coordinators section -->
        <KCardSection v-if="isExpanded"
          :key="item + '-coordinators'"
          :title="$t('ArchivedEventCard.COORDINATORS_SECTION')"
          :context="$props"
          :dense="dense"
        >
          <k-chips-pane class="q-pl-sm" :chips="item.coordinators" :value-path="['profile.name', 'value', 'name']" />
        </KCardSection>
        <!-- Timestamps section -->
        <KCardSection
          v-if="isExpanded"
          :dense="dense">
          <div v-if="createdAt || updatedAt || deletedAt">
            <cite v-if="createdAt">
              <small>{{ $t('ArchivedEventCard.CREATED_AT_LABEL') }} {{ createdAt.toLocaleString() }}</small>
            </cite>
            <br />
            <cite v-if="deletedAt">
              <small>{{ $t('ArchivedEventCard.CLOSED_AT_LABEL') }} {{ deletedAt.toLocaleString() }}</small>
            </cite>
            <cite v-else-if="updatedAt">
              <small>{{ $t('ArchivedEventCard.UPDATED_AT_LABEL') }} {{ updatedAt.toLocaleString() }}</small>
            </cite>
          </div>
        </KCardSection>
      </template>
    </k-card>
    <k-media-browser ref="mediaBrowser" :options="mediaBrowserOptions()" />
  </div>
</template>

<script>
import _ from 'lodash'
import { mixins as kdkCoreMixins, utils as kdkCoreUtils } from '@kalisio/kdk/core.client'
import { mixins as kdkMapMixins } from '@kalisio/kdk/map.client.map'
import { useAlerts } from '../composables'
import mixins from '../mixins'

export default {
  name: 'event-card',
  mixins: [
    kdkCoreMixins.baseItem,
    kdkCoreMixins.service,
    kdkCoreMixins.schemaProxy,
    mixins.events
  ],
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    item: function () {
      // Some actions are not fully reactive and need to be updated manually
      this.configureActions()
    }
  },
  computed: {
    header () {
      const components = []
      if (this.deletedAt) {
        components.push({ component: 'QBadge', label: this.$t('ArchivedEventCard.CLOSED_LABEL'), color: 'black' })
      } else {
        components.push({ component: 'QBadge', label: this.$t('ArchivedEventCard.OPENED_LABEL'), color: 'green-7' })
      }
      if (this.participantsCount > 0) {
        components.push({
          id: this.item._id + '-participants',
          icon: 'las la-user',
          label: this.participantsCount.toString(),
          tooltip: this.$t('ArchivedEventCard.PARTICIPANT_COUNT_LABEL'),
          size: '0.75rem'
        })
      }
      components.push({ component: 'QSpace' })
      components.concat(_.filter(this.itemActions, { scope: 'header' }))
      return components
    },
    icon () {
      return kdkCoreUtils.getIconName(this.getUserIcon(this.participantState, this.participantStep))
    },
    iconColor () {
      return _.get(this.item, 'icon.color', '')
    },
    iconName () {
      return kdkCoreUtils.getIconName(this.item)
    },
    plan () {
      return this.item.plan
    },
    planName () {
      // Plan is only populated when required
      return _.get(this.item, 'plan.name')
    },
    planColor () {
      // Plan is only populated when required
      return _.get(this.item, 'plan.icon.color', 'grey-7')
    },
    planDescription () {
      // Plan is only populated when required
      return _.get(this.item, 'plan.description')
    },
    planActions () {
      return _.filter(this.itemActions, { scope: 'plan' })
    },
    objective () {
      return this.item.objective
    },
    hasParticipants () {
      return !_.isEmpty(this.item.participants)
    },
    createdAt () {
      return this.item.createdAt ? new Date(this.item.createdAt) : null
    },
    updatedAt () {
      return this.item.updatedAt ? new Date(this.item.updatedAt) : null
    },
    deletedAt () {
      return this.item.deletedAt ? new Date(this.item.deletedAt) : null
    }
  },
  data () {
    return {
      zoomDescription: false,
      isExpanded: false,
      participantsCount: 0
    }
  },
  methods: {
    followUp () {
      this.$router.push({
        name: 'event-activity',
        params: { objectId: this.item._id, contextId: this.contextId },
        // Depending if event is in a plan we get it as ID or object
        query: { archived: true, plan: _.get(this.item, 'plan._id', _.get(this.item, 'plan')) }
      })
    },
    browseMedia () {
      this.$refs.mediaBrowser.show(this.attachments)
    },
    viewMap () {
      this.$router.push({
        name: 'event-activity',
        params: { objectId: this.item._id, contextId: this.contextId },
        // Depending if event is in a plan we get it as ID or object
        query: { plan: _.get(this.item, 'plan._id', _.get(this.item, 'plan')) }
      })
    },
    async refresh () {
      this.refreshUser()
      if (this.userId) {
        if (this.item.alert) {
          this.loadAlertLayer(this.item.alert)
          // When created from alert automatically fill the description in if not overriden by user content
          if (!this.item.description) this.item.description = this.getAlertDetailsAsHtml(this.item.alert)
        }
        const eventLogsService = this.$api.getService('archived-event-logs', this.contextId)
        const result = await eventLogsService.find({
          query: {
            $aggregate: true,
            event: this.item._id,
            lastInEvent: true
          }
        })
        if (result.length > 0) this.participantsCount = result[0].count
      }
    }
  },
  async created () {
    // Required alias for the event logs mixin
    this.event = this.item
    await this.loadAttachments()
    // Set the required actor
    if (this.$store.get('user')) this.refresh()
    this.$events.on('user-changed', this.refresh)
  },
  beforeUnmount () {
    this.$events.off('user-changed', this.refresh)
  },
  setup () {
    return {
      ...useAlerts()
    }
  }
}
</script>

<style lang="scss">
  .event-card-description {
    transition: font-size .2s;
  }
  .event-card-description-zoomed {
    font-size: larger;
  }
</style>
