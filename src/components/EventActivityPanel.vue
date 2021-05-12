<template>
  <k-catalog :layers="layers" :layerHandlers="layerHandlers" :layerCategories="layerCategories"
    :forecastModels="forecastModels" :forecastModelHandlers="forecastModelHandlers" :forecastModel="forecastModel" >
    <div slot="footer" >
      <q-expansion-item icon="las la-user" header-class="text-primary" :label="$t('EventActivityPanel.PARTICIPANTS_LABEL')">
        <template v-for="participant in participants">
          <div class="row justify-between no-wrap" style="overflow: auto" :key="participant._id">
            <div class="col-auto self-center">
              <q-btn flat round small color="primary" @click="onStateClicked(participant)">
                <q-icon :name="participantIconName(participant)" :color="participantIconColor(participant)" />
                <q-tooltip v-if="participant.step" content-class="bg-primary" >{{ participantState(participant) }}</q-tooltip>
                <q-tooltip v-if="participant.step" :offset="[0, 48]">{{ $t('EventActivityPanel.FILTER_PARTICIPANTS') }}</q-tooltip>
              </q-btn>
              <span>{{ participantName(participant) }}&nbsp;&nbsp;</span>
            </div>
            <k-text-area class="self-center text-italic" :text="participantComment(participant)" :length="30"/>
            <div class="col-auto self-center">
              <q-btn v-if="!archived && canFollowUp(participant)" flat round small color="primary" @click="doFollowUp(participant._id)">
                <q-icon name="las la-sms" color="red" />
                <q-tooltip>{{ participantFollowUp(participant) }}</q-tooltip>
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
      return _.get(participant, 'participant.name', this.$t('EventActivityPanel.UNAMED'))
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
    participantFollowUp (participant) {
      const step = this.getWorkflowStep(participant)
      return step.title + ' : ' + this.$t('EventActivityPanel.ACTION_REQUIRED_WARNING')
    },
    participantState (participant) {
      const interaction = this.getUserInteraction(participant)
      if (interaction) {
        // Don't use current step here as the interaction can be recorded on the previous one
        const step = this.getUserInteractionStep(participant)
        return step.title + ' : ' + interaction
      } else {
        const step = this.getWorkflowStep(participant)
        return step.title + ' : ' + this.$t('EventActivityPanel.AWAITING_INFORMATION')
      }
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
