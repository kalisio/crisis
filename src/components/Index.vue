<template>
  <div>
    <KSignupAlert 
      v-if="User" 
      :isVerified="User.isVerified" 
      :accountEmail="User.email" 
      notifierEmail="email-notifications@kalisio.com"
    />
    <KTour ref="tour" />
    <KWelcome />
    <router-view></router-view>
  </div>
</template>

<script setup>
import config from 'config'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { api, permissions, composables } from '@kalisio/kdk/core.client'

// Data
const $q = useQuasar()
// Register custom redirect to handle permissions
const { User } = composables.useSession({ redirect })

// Functions
async function redirect (route, result, user) {
  // Check if we'd like to redirect to an organisation
  let organisation = _.get(route, 'query.organisation', '').toLowerCase()
  const permission = permissions.Roles[organisation]
  if (user && organisation) {
    const organisations = _.get(user, 'organisations', [])
    organisation = _.find(organisations, org => {
      // Redirect on target org or any org with the right permissions
      if (!_.isNil(permission)) {
        if (permissions.Roles[org.permissions] >= permission) return true
      } else if (org._id === organisation) return true
      return false
    })
    if (organisation) {
      return {
        name: _.get(route, 'query.route', 'context'),
        params: Object.assign({
          contextId: organisation._id,
          objectId: organisation._id, // Required for eg billing
          title: organisation.name, // Required for eg billing
          page: _.get(route, 'query.page')
        }, _.get(route, 'params', {})),
        query: _.omit(_.get(route, 'query', {}), ['organisation', 'page'])
      }
    } else {
      $q.notify({ type: 'negative', message: this.$t('Index.ORGANISATION_NOT_FOUND') })
      return false
    }
  }
  // Check for single organisation
  if ((result === 'home') && user) {
    const response = await api.getService(_.get(config, 'context.service')).find({ query: {}, $limit: 1 })
    if (response.total === 1) return { name: 'context', params: { contextId: response.data[0]._id } }
  }
  return result
}
</script>
