<template>
  <q-card class="q-py-sm no-shadow">
    <!-- Sections -->
    <q-expansion-item
      v-if="isVerified"
      :label="$t('VerifyEmailManager.TITLE')"
      group="account"
      class="bg-grey-2"
      header-class= 'text-red'
      id="verify-email-manager"
      default-opened
    >
      <VerifyEmailManager notifierEmail="email-notifications@kalisio.com" />
    </q-expansion-item>
    <template v-for="section in sections" :key="section.title">
      <q-expansion-item
        :label="$tie(section.title)"
        group="account"
        class="bg-grey-2"
        :id="section.id"
      >
        <component :is="section.instance" v-bind="section" />
      </q-expansion-item>
    </template>
    <!-- Deletion -->
    <q-expansion-item
      v-if="deletable"
      :label="$t('DeleteAccountManager.TITLE')"
      group="account"
      class="bg-grey-2"
      id="delete-account-manager"
    >
      <DeleteAccountManager />
    </q-expansion-item>
  </q-card>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref, onMounted } from 'vue'
import { Store, utils, Events } from '@kalisio/kdk/core.client'
import VerifyEmailManager from './VerifyEmailManager.vue'
import DeleteAccountManager from './DeleteAccountManager.vue'

// Data
const isVerified = ref(false)
const deletable = ref(true)
const sections = ref([])
const User = Store.get('user')

// Make store react to external changes to update verify email section
Events.on('user-changed', (path, value) => {
  if (_.has(value, 'isVerified')) isVerified.value = !value.isVerified
})

// Hooks
onMounted(async () => {
  deletable.value = _.get(config, 'account.deletable', true)
  if (_.has(User, 'isVerified')) isVerified.value = !User.isVerified
  const confSections = _.cloneDeep(_.get(config, 'account.sections', []))
  for (let i = 0; i < confSections.length; ++i) {
    const section = confSections[i]
    section.instance = utils.loadComponent(section.component)
  }
  sections.value = confSections
})
</script>
