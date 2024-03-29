<template>
  <KCard
    v-bind="$props"
    :actions="itemActions"
    :bind-actions="false">
    <!--
      Card content
     -->
    <template v-slot:card-content>
       <!-- Participants section -->
      <KCardSection
        :title="$t('EventTemplateCard.PARTICIPANTS_SECTION')"
        :actions="participantsActions"
        :context="$props">
        <div v-if="hasParticipants">
          <k-chips-pane
            :chips="item.participants"
            :value-path="['profile.name', 'value', 'name']" />
        </div>
        <div v-else>
          {{ $t('EventTemplateCard.NO_PARTICIPANTS_LABEL')}}
        </div>
      </KCardSection>
      <!-- Coordinators section -->
      <KCardSection
        :title="$t('PlanTemplateCard.COORDINATORS_SECTION')"
        :actions="coordinatorsActions"
        :context="$props">
        <div v-if="hasCoordinators">
          <k-chips-pane
            :chips="item.coordinators"
            :value-path="['profile.name', 'value', 'name']" />
        </div>
        <div v-else>
          {{ $t('PlanTemplateCard.NO_COORDINATORS_LABEL')}}
        </div>
      </KCardSection>
      <!-- Expiry duration section -->
      <KCardSection
        :title="$t('EventTemplateCard.EXPIRY_DURATION_SECTION')"
        :actions="expiryDurationActions"
        :context="$props">
        <div v-if="hasExpiryDuration">
          {{ $t('EventTemplateCard.EXPIRY_DURATION_LABEL', { days: item.expiryDuration }) }}
        </div>
        <div v-else>
          {{ $t('EventTemplateCard.NO_EXPIRY_DURATION_LABEL')}}
        </div>
      </KCardSection>
      <!-- Permission section -->
      <KCardSection
        :title="$t('EventTemplateCard.PERMISSION_SECTION')"
        :actions="permissionActions"
        :context="$props">
        <q-chip :label="permission" outline square dense color="grey-10" />
      </KCardSection>
      <!-- Workflow section -->
      <KCardSection
        :title="$t('EventTemplateCard.WORKFLOW_SECTION')"
        :actions="workflowActions"
        :context="$props">
         <div v-if="hasWorkflow">
           {{ $t('EventTemplateCard.WORKFLOW_LABEL', { count: item.workflow.length }) }}
        </div>
        <div v-else>
          {{ $t('EventTemplateCard.NO_WORKFLOW_LABEL')}}
        </div>
      </KCardSection>
    </template>
  </KCard>
</template>

<script>
import _ from 'lodash'
import { Dialog } from 'quasar'
import { mixins as kCoreMixins } from '@kalisio/kdk/core.client'

export default {
  name: 'event-template-card',
  mixins: [kCoreMixins.baseItem],
  computed: {
    participantsActions () {
      return _.filter(this.itemActions, { scope: 'participants' })
    },
    hasParticipants () {
      return !_.isEmpty(this.item.participants)
    },
    coordinatorsActions () {
      return _.filter(this.itemActions, { scope: 'coordinators' })
    },
    hasCoordinators () {
      return !_.isEmpty(this.item.coordinators)
    },
    expiryDurationActions () {
      return _.filter(this.itemActions, { scope: 'expiryDuration' })
    },
    hasExpiryDuration () {
      return _.get(this.item, 'expiryDuration')
    },
    permission () {
      return this.$t(_.upperCase(_.get(this.item, 'permission', 'member')))
    },
    permissionActions () {
      return _.filter(this.itemActions, { scope: 'permission' })
    },
    workflowActions () {
      return _.filter(this.itemActions, { scope: 'workflow' })
    },
    hasWorkflow () {
      return !_.isEmpty(this.item.workflow)
    }
  },
  data () {
    return {
      step: 1
    }
  },
  methods: {
    removeWorkflow () {
      Dialog.create({
        title: this.$t('EventTemplateCard.REMOVE_WORKFLOW_TITLE'),
        persistent: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(() => {
        this.$api.getService('event-templates').patch(this.item._id, { workflow: null, hasWorkflow: false })
      })
    }
  }
}
</script>
