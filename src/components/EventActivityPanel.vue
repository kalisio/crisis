<template>
  <template v-for="participant in participants" :key="participant._id">
    <div class="row justify-between no-wrap" style="overflow: auto">
      <div class="col-auto self-center">
        <q-btn flat round small color="primary" @click="onStateClicked(participant)">
          <k-avatar :object="participant" />
          <q-tooltip v-if="participant.step" content-class="bg-primary" >{{ getUserState(participant) }}</q-tooltip>
          <q-tooltip v-if="participant.step" :offset="[0, 48]">{{ $t('EventActivityPanel.FILTER_PARTICIPANTS') }}</q-tooltip>
        </q-btn>
        <span v-if="getUserComment(participant)">{{ getUserName(participant) }}: {{ getUserComment(participant) }}</span>
        <span v-else>{{ getUserName(participant) }}</span>
      </div>
      <div class="col-auto self-center">
        <q-btn v-if="!archived && canFollowUpUser(participant)" flat round small color="primary" @click="doUserFollowUp(participant._id)">
          <q-icon name="las la-sms" color="red" />
          <q-tooltip>{{ getUserFollowUp(participant) }}</q-tooltip>
        </q-btn>
        <q-btn flat round small color="primary" @click="onZoomClicked(participant)">
          <q-icon name="las la-search-location" />
        </q-btn>
      </div>
    </div>
  </template>
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
