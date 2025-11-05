<template>
  <KPanel
    id="profile-header"
    :content="header"
    :context="User"
    class="q-py-sm full-width justify-end no-wrap"
    @triggered="onTriggered"
  />
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { composables as kdkCoreComposables } from '@kalisio/kdk/core.client'

// Props
const props = defineProps({
  editable: {
    type: Boolean,
    default: true
  },
  manageable: {
    type: Boolean,
    default: true
  }
})

// Emit
const emit = defineEmits(['triggered'])

// Data
const { User, name: userName, description: userDescription, avatar: userAvatar, role: userRole } = kdkCoreComposables.useUser()

// Computed
const header = computed(() => {
  const actions = []
  if (props.editable) {
    actions.push({
      id: 'edit-profile',
      icon: 'las la-edit',
      size: '0.75rem',
      tooltip: 'KProfile.EDIT_PROFILE',
      dialog: {
        component: 'editor/KEditor',
        service: 'users',
        objectId: User.value._id,
        perspective: 'profile',
        hideButtons: true,
        cancelAction: 'CANCEL',
        okAction: {
          id: 'ok-button',
          label: 'APPLY',
          handler: 'apply'
        }
      }
    })
  }
  if (props.manageable) {
    const manageAccountAction = {
      id: 'manage-account',
      icon: 'las la-cog',
      size: '0.75rem',
      tooltip: 'KProfile.MANAGE_ACCOUNT',
      dialog: {
        component: 'account/Account',
        okAction: 'CLOSE'
      }
    }
    if (_.has(User.value, 'isVerified') && !User.value.isVerified) {
      manageAccountAction.badge = {
        rounded: true,
        floating: true,
        class: 'q-ma-sm',
        color: 'red',
        icon: { name: 'fas fa-exclamation', size: '8px' }
      }
    }
    actions.push(manageAccountAction)
  }
  return actions
})

// Functions
function onTriggered (args) {
  emit('triggered', args)
}
</script>
