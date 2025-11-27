<template>
  <Card
    v-bind="$props"
    :actions="itemActions"
    :bind-actions="false">
    <!--
      Card content
     -->
    <template v-slot:card-content>
      <!-- Objectives section -->
      <KCardSection
        :title="$t('PlanTemplateCard.OBJECTIVES_SECTION')"
        :actions="objectivesActions"
        :context="$props">
        <div v-if="hasObjectives">
          <ChipsPane :chips="item.objectives" :value-path="'name'" :removable="canEditItem()" @chip-removed="onObjectiveRemoved" />
        </div>
        <div v-else>
          {{ $t('PlanTemplateCard.NO_OBJECTIVES_LABEL')}}
        </div>
      </KCardSection>
      <!-- coordinators section -->
      <KCardSection
        :title="$t('PlanTemplateCard.COORDINATORS_SECTION')"
        :actions="coordinatorsActions"
        :context="$props">
        <div v-if="hasCoordinators">
          <ChipsPane
            :chips="item.coordinators"
            :value-path="['profile.name', 'value', 'name']"
            :removable="canEditItem()"
            @chip-removed="onCoordinatorRemoved" />
        </div>
        <div v-else>
          {{ $t('PlanTemplateCard.NO_COORDINATORS_LABEL')}}
        </div>
      </KCardSection>
      <!-- Permission section -->
      <KCardSection
        :title="$t('PlanTemplateCard.PERMISSION_SECTION')"
        :actions="permissionActions"
        :context="$props">
        <q-chip :label="permission" outline square dense color="grey-10" />
      </KCardSection>
    </template>
  </Card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'
import ChipsPane from './ChipsPane.vue'
import Card from './Card.vue'

export default {
  name: 'plan-template-card',
  mixins: [kCoreMixins.baseItem],
  components: {
    ChipsPane,
    Card
  },
  computed: {
    objectivesActions () {
      return _.filter(this.itemActions, { scope: 'objectives' })
    },
    hasObjectives () {
      return !_.isEmpty(this.item.objectives)
    },
    coordinatorsActions () {
      return _.filter(this.itemActions, { scope: 'coordinators' })
    },
    hasCoordinators () {
      return !_.isEmpty(this.item.coordinators)
    },
    permission () {
      return this.$t(_.upperCase(_.get(this.item, 'permission', 'member')))
    },
    permissionActions () {
      return _.filter(this.itemActions, { scope: 'permission' })
    }
  },
  methods: {
    editObjectives () {
      this.$router.push({
        name: 'edit-plan-template-objectives', params: { objectId: this.item._id }
      })
    },
    async onObjectiveRemoved (chip) {
      const service = this.$api.getService('plan-templates', this.contextId)
      const objectives = this.item.objectives.filter(objective => objective.id !== chip.id)
      await service.patch(this.item._id, { objectives })
    },
    async onCoordinatorRemoved (chip) {
      const service = this.$api.getService('plan-templates', this.contextId)
      const coordinators = this.item.coordinators.filter(coordinator => coordinator._id !== chip._id)
      await service.patch(this.item._id, { coordinators })
    }
  }
}
</script>
