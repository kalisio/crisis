<template>
  <div v-if="organisation">
    <div v-if="hasMenu">
      <q-btn-dropdown 
        flat
        no-caps
        fab-mini
        menu-anchor="bottom left"
        menu-self="top left"
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
            <!-- Objectives section -->
          <k-card-section :title="$t('PlanCard.OBJECTIVES_LABEL')" >
            <template slot="card-section-content">
              <k-chips-pane class="q-pl-sm" :chips="plan.objectives" />
            </template>
          </k-card-section>
          <!-- location section -->
          <k-card-section :title="$t('PlanCard.LOCATION_LABEL')" >
            <template slot="card-section-content">
              <k-location-map v-if="plan.location" v-model="plan.location" :editable="false" style="min-height: 160px;" />
              <div v-else>
                <k-stamp :text="'PlanCard.UNDEFINED_LOCATION_LABEL'" direction="horizontal" />
              </div>
            </template>
          </k-card-section>
          </q-card>
          
            

          <!--k-panel
            id="menu-entries"
            :content="entries"
            action-renderer="item"
            direction="vertical" /-->

            <!--q-card style="width: 300px; height: 500px"-->

            </q-card>
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
    this.$options.components['plan-card'] = this.$load('PlanCard')
    this.$options.components['k-card-section'] = this.$load('collection/KCardSection')
    this.$options.components['k-chips-pane'] = this.$load('frame/KChipsPane')
    this.$options.components['k-location-map'] = this.$load('KLocationMap')
  }
}
</script>


