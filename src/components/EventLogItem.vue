<template>
  <k-item
    v-bind="$props"
    :options="{ toggle: true }"
    :actions="itemActions"
    :bind-actions="false">
    <!--
      Item toggle
     -->
    <template v-slot:item-toggle>
      <q-checkbox :disable="!hasFollowUp" :disabled="!hasFollowUp" v-model="toggled" @input="onItemToggled(toggled)"/>
    </template>
    <!--
      Item content
     -->
    <template v-slot:item-content>
      <q-item-section>
        <q-item-label>{{ getUserName(item) }}</q-item-label>
        <q-item-label v-if="itemStep" caption>{{ getUserComment(item) }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label v-if="itemStep">{{ getUserState(item) }}</q-item-label>
        <q-item-label v-if="!itemStep">{{ $t('EventLogItem.READ') }}</q-item-label>
        <q-item-label v-if="createdAt" caption>{{ createdAt.toLocaleString() }}</q-item-label>
      </q-item-section>
    </template>
  </k-item>
</template>

<script>
import _ from 'lodash'
import { QCheckbox } from 'quasar'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

export default {
  name: 'event-log-item',
  components: {
    QCheckbox
  },
  mixins: [
    kCoreMixins.baseItem,
    mixins.events
  ],
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      toggled: false,
      itemStep: null,
      hasFollowUp: false
    }
  },
  computed: {
    createdAt () {
      return this.item.createdAt ? new Date(this.item.createdAt) : null
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-item'] = this.$load('collection/KItem')
  },
  created () {
    // Archived mode ?
    this.archived = _.get(this.$route, 'query.archived')
    // Update built-in actions
    this.itemStep = this.getWorkflowStep(this.item)
    this.hasFollowUp = !this.archived && this.itemStep &&
      this.waitingInteraction(this.itemStep, this.item, 'coordinator')
    if (this.hasFollowUp) {
      const followUpAction = _.find(this.itemActions, action => action.id === 'follow-up')
      // Update tooltip of the generic action to reflect current item state in tooltip
      if (followUpAction) followUpAction.tooltip = this.getUserFollowUp(this.item)
    } else {
      _.remove(this.itemActions, action => action.id === 'follow-up')
    }
    if (this.item.geometry) {
      const locationMapAction = _.find(this.itemActions, action => action.id === 'location-map')
      // Update location of the generic action to reflect current item location in map
      if (locationMapAction) _.set(locationMapAction, 'content[0].value', _.get(this.item, 'geometry'))
    }
  }
}
</script>
