<template>
  <Card
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
      <KCardSection
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.OBJECTIVES_SECTION')"
        :context="$props"
        :dense="dense"
      >
        <ChipsPane v-if="item.objectives" class="q-pl-sm" :chips="item.objectives" :value-path="'name'" />
        <KStamp v-else :text="'ArchivedPlanCard.NO_OBJECTIVES_LABEL'" direction="horizontal" />
      </KCardSection>
      <!-- location section -->
      <KCardSection
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.LOCATION_SECTION')"
        :context="$props"
        :dense="dense"
      >
        <KLocationMap v-if="item.location" v-model="item.location" :editable="false" style="min-height: 220px;" />
        <KStamp v-else :text="'ArchivedPlanCard.NO_LOCATION_LABEL'" direction="horizontal" />
      </KCardSection>
      <!-- coordinators section -->
      <KCardSection
        v-if="isExpanded"
        :title="$t('ArchivedPlanCard.COORDINATORS_SECTION')"
        :context="$props">
        <ChipsPane class="q-pl-sm" :chips="item.coordinators" :valuePath="['profile.name', 'value', 'name']" />
      </KCardSection>
      <!-- Timestamps section -->
      <KCardSection
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
      </KCardSection>
    </template>
  </Card>
</template>

<script>
import _ from 'lodash'
import { mixins as kdkCoreMixins } from '@kalisio/kdk/core.client'
import ChipsPane from './ChipsPane.vue'
import Card from './Card.vue'

export default {
  name: 'archived-plan-card',
  mixins: [kdkCoreMixins.baseItem],
  components: {
    ChipsPane,
    Card
  },
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
      components.push({ component: 'QSpace' })
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
  }
}
</script>
