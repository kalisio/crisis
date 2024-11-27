<template>
  <q-scroll-area class="fit">
      <template v-for="participant in participants" :key="participant._id">
        <div class="full-width row items-center q-pl-md q-pr-sm no-wrap">
          <q-btn flat round small color="primary" @click="onStateClicked(participant)">
            <KAvatar :subject="participant" />
            <q-tooltip v-if="participant.step" content-class="bg-primary" >{{ getUserState(participant) }}</q-tooltip>
            <q-tooltip v-if="participant.step" :offset="[0, 48]">{{ $t('EventActivityPanel.FILTER_PARTICIPANTS') }}</q-tooltip>
          </q-btn>
          <div class="ellipsis" v-if="getUserComment(participant)">{{ getUserName(participant) }}: {{ getUserComment(participant) }}
            <q-tooltip content-class="bg-primary" >{{ getUserComment(participant) }}</q-tooltip>
          </div>
          <div v-else>{{ getUserName(participant) }}</div>
          <q-space />
          <q-btn v-if="!archived && canFollowUpUser(participant)" flat round small color="primary" @click="doUserFollowUp(participant._id)">
            <q-icon name="las la-sms" color="red" />
            <q-tooltip>{{ getUserFollowUp(participant) }}</q-tooltip>
          </q-btn>
          <q-btn flat round small color="primary" @click="onZoomClicked(participant)">
            <q-icon name="las la-search-location" />
          </q-btn>
        </div>
      </template>
  </q-scroll-area>
</template>

<script>
import _ from 'lodash'
import { utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

export default {
  name: 'event-activity-panel',
  mixins: [
    mixins.events
  ],
  props: {
    event: {
      type: Object,
      required: true
    },
    participants: {
      type: Array,
      required: true
    }
  },
  methods: {
    participantIconName (participant) {
      return kCoreUtils.getIconName(participant)
    },
    participantIconColor (participant) {
      return _.get(participant, 'icon.color', '')
    },
    onZoomClicked (participant) {
      this.$events.emit('zoom-to-participant', participant)
    },
    onStateClicked (participant) {
      this.$events.emit('filter-participant-states', participant)
    }
  },
  created () {
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
  }
}
</script>
