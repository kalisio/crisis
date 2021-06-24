<template>
  <div v-if="organisation">
    <q-btn-dropdown 
      flat
      no-caps
      fab-mini
      menu-anchor="bottom left"
      menu-self="top middle"
      content-style="margin: 0px !important; padding: 0px !important;">
      <template v-slot:label>
        <div>
          <k-avatar 
            :class="$q.screen.lt.sm ? 'q-pa-none' : 'q-pa-xs'" 
            :object="currentObject" 
            :contextId="organisation._id"
            :size="$q.screen.lt.sm ? '1.8rem' : '2rem'" />
        </div>
      </template>
      <template v-slot:default>
        <q-card class="bg-white" style="width: 300px;">
          <mini-organisation-card :organisationId="organisation._id" :dense="true" />
        </q-card>
      </template>
    </q-btn-dropdown>
  </div>
</template>
  
</template>

<script>
import { QBtnDropdown } from 'quasar'
import mixins from '../mixins'
import MiniOrganisationCard from './MiniOrganisationCard.vue'

export default {
  name: 'organisation-menu',
  components: {
    QBtnDropdown,
    MiniOrganisationCard
  },
  mixins: [mixins.plans],
  data () {
    return {
      organisation: this.$store.get('context'),
      currentObject: this.$store.get('context')
    }
  },
  watch: {
    plan : {
      handler (plan) {
        if (plan) this.currentObject = this.plan
        else this.currentObject = this.$store.get('context')
      }
    }
  },
  beforeCreate () {
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
  }
}
</script>


