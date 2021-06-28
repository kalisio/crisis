<template>
  <div v-if="organisation">
    <q-btn-dropdown 
      flat
      dense
      no-caps
      square
      menu-anchor="bottom middle"
      menu-self="top middle">
      <template v-slot:label>
        <div>
          <k-avatar 
            :class="$q.screen.lt.sm ? 'q-pa-none' : 'q-pa-xs'" 
            :object="organisation" 
            :contextId="organisation._id"
            :size="$q.screen.lt.sm ? '1.5rem' : '2rem'" />
        </div>
      </template>
      <template v-slot:default>
        <q-card class="bg-white" style="width: 300px;">
          <div class="row full-width justify-center q-pa-md text-subtitle1 bg-grey-4">
            {{ organisation.name }}
          </div>
          <mini-organisation-card :organisation="organisation" :dense="true" />
        </q-card>
      </template>
    </q-btn-dropdown>
  </div>
</template>
  
</template>

<script>
import { QBtnDropdown } from 'quasar'
import MiniOrganisationCard from './MiniOrganisationCard.vue'

export default {
  name: 'organisation-menu',
  components: {
    QBtnDropdown,
    MiniOrganisationCard
  },
  data () {
    return {
      organisation: this.$store.get('context')
    }
  },
  beforeCreate () {
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
  }
}
</script>


