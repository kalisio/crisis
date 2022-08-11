<template>
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
      <!-- Objectives section -->
      <k-card-section
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.OBJECTIVES_SECTION')"
        :context="$props"
        :dense="dense"
      >
        <k-chips-pane v-if="item.objectives" class="q-pl-sm" :chips="item.objectives" :value-path="'name'" />
        <k-stamp v-else :text="'ArchivedPlanCard.NO_OBJECTIVES_LABEL'" direction="horizontal" />
      </k-card-section>
      <!-- location section -->
      <k-card-section
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.LOCATION_SECTION')"
        :context="$props"
        :dense="dense"
      >
        <k-location-map v-if="item.location" v-model="item.location" :editable="false" style="min-height: 220px;" />
        <k-stamp v-else :text="'ArchivedPlanCard.NO_LOCATION_LABEL'" direction="horizontal" />
      </k-card-section>
      <!-- coordinators section -->
      <k-card-section
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.COORDINATORS_SECTION')"
        :context="$props">
        <k-chips-pane class="q-pl-sm" :chips="item.coordinators" :valuePath="['profile.name', 'value', 'name']" />
      </k-card-section>
      <!-- Timestamps section -->
      <k-card-section
        v-if="isExpanded"
        :dense="dense">
        <div v-if="createdAt || updatedAt || deletedAt">
          <cite v-if="createdAt">
            <small>{{ $t('ArchivedPlanCard.CREATED_AT_LABEL') }} {{ createdAt.toLocaleString() }}</small>
          </cite>
          <br />
          <cite v-if="deletedAt">
            <small>{{ $t('ArchivedPlanCard.CLOSED_AT_LABEL') }} {{ deletedAt.toLocaleString() }}</small>
          </cite>
          <cite v-else-if="updatedAt">
            <small>{{ $t('ArchivedPlanCard.UPDATED_AT_LABEL') }} {{ updatedAt.toLocaleString() }}</small>
          </cite>
        </div>
      </k-card-section>
    </template>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'archived-plan-card',
  mixins: [kCoreMixins.baseItem],
  props: {
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    header () {
      const components = []
      if (this.item.deletedAt) {
        components.push({ component: 'QBadge', label: this.$t('ArchivedPlanCard.CLOSED_LABEL'), color: 'black' })
      } else {
        components.push({ component: 'QBadge', label: this.$t('ArchivedPlanCard.OPENED_LABEL'), color: 'green-7' })
      }
      components.push({ component: 'QSpace ' })
      components.concat(_.filter(this.itemActions, { scope: 'header' }))
      return components
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
      isExpanded: false
    }
  },
  methods: {
    getLocationMap () {
      return {
        component: 'KLocationMap',
        value: this.item.location,
        editable: false,
        style: 'min-width: 360px; max-width: 360px; min-height: 360px; max-height: 360px;'
      }
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-chips-pane'] = this.$load('frame/KChipsPane')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
  }
}
</script>
