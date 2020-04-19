<template>
  <k-layers-panel :layers="layers" :layerHandlers="layerHandlers" :categories="layerCategories" >
    <div slot="panel-footer" >
      <q-expansion-item v-if="forecastModels.length > 0" icon="fas fa-globe" :label="$t('KWeatherLayersSelector.FORECASTS_LABEL')">
        <k-forecast-models-selector :forecastModels="forecastModels" :forecastModelHandlers="forecastModelHandlers" :forecastModel="forecastModel" />
      </q-expansion-item>
      <q-expansion-item v-if="participants.length > 0" icon="fas fa-user" :label="$t('EventActivityPanel.PARTICIPANTS_LABEL')">
        <template v-for="participant in participants">
          <div class="row justify-between no-wrap" style="overflow: auto" :key="participant._id">
            <div class="col-auto self-center">
              <q-btn flat round small color="primary" @click="onStateClicked(participant)">
                <q-icon :name="participantIconName(participant)"  :color="participantIconColor(participant)" />
              </q-btn>
              {{participantName(participant)}}
            </div>
            <k-text-area style="flex-shrink: 0" class="col-auto light-paragraph self-center" :length="20" :text="participantComment(participant)" />
            <div class="col-auto self-center">
              <q-btn v-if="!archived && canFollowUp(participant)" flat round small color="primary" @click="doFollowUp(participant._id)">
                <q-icon name="message" color="red" />
              </q-btn>
              <q-btn flat round small color="primary" @click="onZoomClicked(participant)">
                <q-icon name="remove_red_eye" />
              </q-btn>
            </div>
          </div>
        </template>
      </q-expansion-item>
    </div>
  </k-layers-panel>
</template>

<script>
import _ from 'lodash'
import { utils as kCoreUtils } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

export default {
  name: 'event-activity-panel',
  mixins: [
    mixins.eventLogs
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
    event: {
      type: Object,
      default: () => {}
    },
    participants: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    participantName (participant) {
      return _.get(participant, 'name', this.$t('EventActivity.UNAMED'))
    },
    participantIconName (participant) {
      return kCoreUtils.getIconName(this.getUserIcon(participant), 'name')
    },
    participantIconColor (participant) {
      return _.get(this.getUserIcon(participant), 'color', '')
    },
    participantComment (participant) {
      return this.getUserComment(participant)
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
    this.$options.components['k-layers-panel'] = this.$load('KLayersPanel')
    this.$options.components['k-forecast-models-selector'] = this.$load('KForecastModelsSelector')
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
  }
}
</script>
