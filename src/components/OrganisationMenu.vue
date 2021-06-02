<template>
  <div v-if="organisation">
    <div v-if="hasMenu">
      <q-btn-dropdown 
        flat
        no-caps
        fab-mini
        menu-anchor="bottom left"
        menu-self="top left">
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
          <k-panel
            id="menu-entries"
            :content="entries"
            action-renderer="item"
            direction="vertical" />
        </template>
      </q-btn-dropdown>
    </div>
    <div v-else>
      <k-avatar 
        :class="$q.screen.lt.sm ? 'q-pa-xs' : 'q-pa-sm'" 
        :object="organisation" 
        :contextId="organisation._id"
        :size="$q.screen.lt.sm ? '2rem' : '2.2rem'" />
    </div>
  </div>
</template>
  
</template>

<script>
import { QBtnDropdown } from 'quasar'
import mixins from '../mixins'

export default {
  name: 'k-organisation-avatar',
  mixins: [
    mixins.plans
  ],
  components: {
    QBtnDropdown
  },
  props: {
    menu: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      organisation: this.$store.get('context'),
      currentObject: this.$store.get('context'),
      entries: []
    }
  },
  computed: {
    hasMenu () {
      return this.entries.length > 0
    }
  },
  watch:{
    $route: {
      handler (to, from) {
        this.organisation = this.$store.get('context')
        this.currentObject = this.organisation
        this.entries = []
      },
      immediate: true
    },
    plan : {
      handler (plan) {
        if (plan) {
          this.currentObject = this.plan
          this.entries.push({
            id: 'edit-plan',
            icon: 'las la-edit',
            label: 'OrganisationMenu.EDIT_LABEL',
            route: { 
              path: this.$route.path + '/edit-plan/' + this.planId,
              query: this.$route.query 
            }
          })
        }
      }
    }
  },
  beforeCreate () {
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  }
}
</script>