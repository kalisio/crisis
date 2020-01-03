<template>
  <div>
    <k-icon-chooser ref="iconChooser" @icon-choosed="onIconChanged" />
    <q-expansion-item ref="points" default-opened icon="fas fa-map-marker-alt" :label="$t('LayerStyleForm.POINTS')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section avatar class="col-6">
            {{$t('LayerStyleForm.ADD_PROPERTY')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="add" @click="onAddStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
        <q-item v-for="style in styles" :key="style.key" class="col-12">
          <q-item-section avatar>
            <q-chip clickable v-ripple text-color="white"
              :icon="style.icon.name" :color="style.icon.color" @click="onIconClicked(style)"/>
          </q-item-section>
          <q-item-section>
            <component
              :is="style.componentKey"
              :properties="style.properties"
              :display="{ icon: true, label: true, labelWidth: 3 }"
              @field-changed="onValueChanged"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <!--q-expansion-item ref="lines" icon="fas fa-grip-lines" :label="$t('LayerStyleForm.LINES')" group="group">
    </q-expansion-item>
    <q-expansion-item ref="polygons" icon="fas fa-draw-polygon" :label="$t('LayerStyleForm.POLYGONS')" group="group">
    </q-expansion-item-->
    <q-list v-show="hasError" dense class="row items-center justify-around q-pa-md">
      <q-item>
        <q-item-section side>
          <q-icon name="warning" color="negative" />
        </q-item-section>
        <q-item-section class="text-negative">
        {{error}}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { uid } from 'quasar'
import { mixins as kCoreMixins } from '@kalisio/kdk-core/client'

export default {
  name: 'k-layer-style-form',
  components: {
  },
  mixins: [
    kCoreMixins.schemaProxy,
    kCoreMixins.refsResolver()
  ],
  props: {
    layer: { type: Object, default: () => null }
  },
  computed: {
    fields () {
      return _.get(this.layer, 'schema.content.properties', {})
    },
    properties () {
      let properties = []
      _.forOwn(this.fields, (value, key) => {
        // Use helper or ID
        properties.push({
          label: _.get(value, 'field.helper', key),
          value: key
        })
      })
      return properties
    }
  },
  data () {
    return {
      property: null,
      styles: [],
      hasError: false,
      error: ''
    }
  },
  methods: {
    async build () {
      logger.debug('Building layer style form')
      // Since some properties are injected in form we need to make sure Vue.js has processed props
      // This could be done externally but adding it here we ensure no one will forget it
      await this.$nextTick()
      this.hasError = false
    },
    async fill (values) {
      logger.debug('Filling layer style form', values)
    },
    validate () {
      logger.debug('Validating layer style form')
      this.hasError = false
      return {
        isValid: !this.hasError,
        values: this.values()
      }
    },
    values () {
      const values = {  }
      return values
    },
    onAddStyle (property) {
      let properties = this.fields[property.value]
      const componentKey = _.kebabCase(properties.field.component)
      // Load the component if not previously loaded
      if (!this.$options.components[componentKey]) {
        this.$options.components[componentKey] = this.$load(properties.field.component)
      }
      // We generate a UID so that we can identify each style uniquely
      this.styles.push({
        key: uid().toString(), componentKey, property, properties, icon: { name: 'edit', color: 'blue' }
      })
    },
    onIconClicked (style) {
      this.editedStyle = style
      this.$refs.iconChooser.open(style.icon.name, style.icon.color)
    },
    onValueChanged (field, value) {
      this.editedStyle.value = value
    },
    onIconChanged (icon) {
      Object.assign(this.editedStyle.icon, icon)
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-icon-chooser'] = this.$load('input/KIconChooser')

    await this.build()
    this.$emit('form-ready', this)
  }
}
</script>
