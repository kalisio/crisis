<template>
  <k-item 
    v-bind="$props" 
    :actions="itemActions" 
    :bind-actions="false">
    <!--
      Item content
     -->
    <template slot="item-content">
      <q-item-section>
        <q-item-label>{{ getUserName(item) }}</q-item-label>
        <q-item-label v-if="item.step" caption>{{ getUserComment(item) }}</q-item-label>
      </q-item-section>
      <q-item-section>
        <q-item-label v-if="item.step">{{ getUserState(item) }}</q-item-label>
        <q-item-label v-else>{{ $t('EventLogItem.READ') }}</q-item-label>
        <q-item-label v-if="createdAt" caption>{{ createdAt.toLocaleString() }}</q-item-label>
      </q-item-section>
    </template>
  </k-item>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import mixins from '../mixins'

export default {
  name: 'event-log-item',
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
    const itemStep = this.getWorkflowStep(this.item)
    const hasFollowUp = !this.archived && this.event.hasWorkflow &&
      (this.waitingInteraction(itemStep, this.item, 'participant') ||
       this.waitingInteraction(itemStep, this.item, 'coordinator'))
    if (hasFollowUp) {
      let followUpAction = _.find(this.itemActions, action => action.id === 'follow-up')
      // Update tooltip of the generic action to reflect current item state in tooltip
      if (followUpAction) followUpAction.tooltip = this.getUserFollowUp(this.item)
    } else {
      _.remove(this.itemActions, action => action.id === 'follow-up')
    }
  }
}
</script>
