<template>
  <k-catalog :layers="layers" :layerHandlers="layerHandlers" :layerCategories="layerCategories"
    :forecastModels="forecastModels" :forecastModelHandlers="forecastModelHandlers" :forecastModel="forecastModel" >
    <div slot="footer" >
      <q-expansion-item v-if="participants.length > 0" icon="las la-user" header-class="text-primary" :label="$t('EventActivityPanel.PARTICIPANTS_LABEL')">
        <template v-for="participant in participants">
          <div class="row justify-between no-wrap" style="overflow: auto" :key="participant._id">
            <div class="col-auto self-center">
              <q-btn flat round small color="primary" @click="onStateClicked(participant)">
                <q-icon :name="participantIconName(participant)" :color="participantIconColor(participant)" />
                <q-tooltip v-if="participant.step" content-class="bg-primary" >{{ participantState(participant) }}</q-tooltip>
                <q-tooltip v-if="participant.step" :offset="[0, 48]">{{ $t('EventActivityPanel.FILTER_PARTICIPANTS') }}</q-tooltip>
              </q-btn>
              {{participantName(participant)}}
            </div>
            <k-text-area style="flex-shrink: 0" class="col-auto light-paragraph self-center" :text="participantComment(participant)" />
            <div class="col-auto self-center">
              <q-btn v-if="!archived && canFollowUp(participant)" flat round small color="primary" @click="doFollowUp(participant._id)">
                <q-icon name="las la-sms" color="red" />
              </q-btn>
              <q-btn flat round small color="primary" @click="onZoomClicked(participant)">
                <q-icon name="las la-search-location" />
              </q-btn>
            </div>
          </div>
        </template>
      </q-expansion-item>
    </div>
  </k-catalog>
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
    layers: {
      type: Object,
      default: () => {}
    },
    layerCategories: {
      type: Array,
      default: () => []
    },
    layerHandlers: {
      type: Object,
      default: () => {}
    },
    forecastModels: {
      type: Array,
      default: () => []
    },
    forecastModelHandlers: {
      type: Object,
      default: () => {}
    },
    forecastModel: {
      type: Object,
      default: () => {}
    },
    participants: {
      type: Array,
      default: () => []
    },
    event: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    participantName (participant) {
      // Manage the case the participant is not correctly populated
      return _.get(participant, 'participant.name', this.$t('EventActivity.UNAMED'))
    },
    participantIconName (participant) {
      return kCoreUtils.getIconName(participant)
    },
    participantIconColor (participant) {
      return _.get(participant, 'icon.color', '')
    },
    participantComment (participant) {
      return this.getUserComment(participant)
    },
    participantState (participant) {
      const step = this.getWorkflowStep(participant)
      const interaction = this.getUserInteraction(participant)
      const state = (interaction ? step.title + ' : ' + interaction : step.title)
      return state
    },
    onZoomClicked (participant) {
      this.$events.$emit('zoom-to-participant', participant)
    },
    onStateClicked (participant) {
      this.$events.$emit('filter-participant-states', participant)
    }
  },
  created () {
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-catalog'] = this.$load('catalog/KCatalog')
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
  }
}
</script>
