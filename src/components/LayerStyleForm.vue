<template>
  <div>
    <k-icon-chooser ref="iconChooser" @icon-choosed="onIconChanged" />
    <k-color-chooser ref="colorChooser" @color-choosed="onColorChanged" />
    <q-expansion-item ref="points" default-opened icon="fas fa-map-marker-alt" :label="$t('LayerStyleForm.POINTS')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="clustering"/>
          </q-item-section>
          <q-item-section class="col-6">
          {{$t('LayerStyleForm.POINT_CLUSTERING')}}
          </q-item-section>
          <q-item-section class="col-4">
            <q-slider v-model="disableClusteringAtZoom" :disable="!clustering"
              :min="1" :max="18" :step="1"
              label label-always :label-value="disableClusteringAtZoom"/>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar>
            <q-chip clickable v-ripple text-color="white"
              :icon="defaultIcon.name" :color="defaultIcon.color" @click="onIconClicked({ icon: defaultIcon })"/>
          </q-item-section>
          <q-item-section>
            {{$t('LayerStyleForm.DEFAULT_POINT_STYLE')}}
          </q-item-section>
        </q-item>
        <q-item v-for="iconStyle in iconStyles" :key="iconStyle.key" class="col-12">
          <q-item-section avatar>
            <q-chip clickable v-ripple text-color="white"
              :icon="iconStyle.icon.name" :color="iconStyle.icon.color" @click="onIconClicked(iconStyle)"/>
          </q-item-section>
          <q-item-section>
            <component
              :is="iconStyle.componentKey"
              :ref="iconStyle.key"
              :properties="iconStyle.properties"
              :display="{ icon: true, label: true, labelWidth: 3 }"
              @field-changed="iconStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="delete" @click="onRemoveIconStyle(iconStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('LayerStyleForm.REMOVE_POINT_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar class="col-6">
            {{$t('LayerStyleForm.ADD_POINT_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="add" @click="onAddIconStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="lines" icon="fas fa-grip-lines" :label="$t('LayerStyleForm.LINES')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-4">
            {{$t('LayerStyleForm.DEFAULT_LINE_STYLE')}}
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="defaultLine['stroke-color']" @click="onColorClicked(defaultLine, 'stroke-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="defaultLine['stroke-width']"
              :min="1" :max="20" :step="1"
              label label-always :label-value="$t('LayerStyleForm.LINE_WIDTH') + defaultLine['stroke-width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="defaultLine['stroke-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('LayerStyleForm.LINE_OPACITY') + defaultLine['stroke-opacity']"/>
          </q-item-section>
        </q-item>
        <q-item v-for="lineStyle in lineStyles" :key="lineStyle.key" class="col-12">
          <q-item-section class="col-4">
            <component
              :is="lineStyle.componentKey"
              :ref="lineStyle.key"
              :properties="lineStyle.properties"
              :display="{ icon: true, label: true, labelWidth: 3 }"
              @field-changed="lineStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="lineStyle['stroke-color']" @click="onColorClicked(lineStyle, 'stroke-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="lineStyle['stroke-width']"
              :min="1" :max="20" :step="1"
              label label-always :label-value="$t('LayerStyleForm.LINE_WIDTH') + lineStyle['stroke-width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="lineStyle['stroke-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('LayerStyleForm.LINE_OPACITY') + lineStyle['stroke-opacity']"/>
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="delete" @click="onRemoveLineStyle(lineStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('LayerStyleForm.REMOVE_LINE_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar class="col-6">
            {{$t('LayerStyleForm.ADD_LINE_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="add" @click="onAddLineStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="polygons" icon="fas fa-draw-polygon" :label="$t('LayerStyleForm.POLYGONS')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-4">
            {{$t('LayerStyleForm.DEFAULT_POLYGON_FILL_STYLE')}}
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="defaultPolygon['fill-color']" @click="onColorClicked(defaultPolygon, 'fill-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="defaultPolygon['fill-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('LayerStyleForm.POLYGON_FILL_OPACITY') + defaultPolygon['fill-opacity']"/>
          </q-item-section>
        </q-item>
        <q-item v-for="polygonStyle in polygonStyles" :key="polygonStyle.key" class="col-12">
          <q-item-section class="col-4">
            <component
              :is="polygonStyle.componentKey"
              :ref="polygonStyle.key"
              :properties="polygonStyle.properties"
              :display="{ icon: true, label: true, labelWidth: 3 }"
              @field-changed="polygonStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="polygonStyle['fill-color']" @click="onColorClicked(polygonStyle, 'fill-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="polygonStyle['fill-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('LayerStyleForm.POLYGON_FILL_OPACITY') + polygonStyle['fill-opacity']"/>
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="delete" @click="onRemovePolygonStyle(polygonStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('LayerStyleForm.REMOVE_POLYGON_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar class="col-6">
            {{$t('LayerStyleForm.ADD_LINE_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="add" @click="onAddPolygonStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="popup" icon="fas fa-comment-alt" :label="$t('LayerStyleForm.POPUP')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="popup"/>
          </q-item-section>
          <q-item-section avatar class="col-5">
            {{$t('LayerStyleForm.ADD_POPUP')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select :disable="!popup" v-model="popupProperties" multiple :options="properties"></q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="tooltip" icon="fas fa-mouse-pointer" :label="$t('LayerStyleForm.TOOLTIP')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="tooltip"/>
          </q-item-section>
          <q-item-section avatar class="col-5">
            {{$t('LayerStyleForm.ADD_TOOLTIP')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select :disable="!tooltip" v-model="tooltipProperty" :options="properties"></q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
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
import { QSlider, uid } from 'quasar'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk-core/client'

export default {
  name: 'k-layer-style-form',
  components: {
    QSlider
  },
  mixins: [
    kCoreMixins.schemaProxy,
    kCoreMixins.refsResolver()
  ],
  props: {
    layer: { type: Object, default: () => null },
    options: { type: Object, required: true }, // Contains default style options
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
    },
    hasIconStyles () {
      return this.iconStyles.length > 0
    },
    hasLineStyles () {
      return this.lineStyles.length > 0
    },
    hasPolygonStyles () {
      return this.polygonStyles.length > 0
    }
  },
  data () {
    return {
      property: null,
      popup: false,
      popupProperties: [],
      tooltip: false,
      tooltipProperty: null,
      clustering: true,
      disableClusteringAtZoom: 18,
      defaultIcon: {},
      iconStyles: [],
      defaultLine: {},
      lineStyles: [],
      defaultPolygon: {},
      polygonStyles: [],
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
    async loadStyleComponents (styles) {
      // Since we use dynamic component loading we need to make sure Vue.js has loaded them
      // Set the refs to be resolved
      this.setRefs(styles.map(style => style.key))
      await this.loadRefs()
      styles.forEach(style => this.$refs[style.key][0].fill(style.value))
    },
    async fillClusteringStyle(values) {
      this.clustering = (_.get(values, 'leaflet.cluster', _.get(this.options, 'cluster')) ? true : false)
      this.disableClusteringAtZoom = _.get(values, 'leaflet.cluster.disableClusteringAtZoom',
        _.get(this.options, 'cluster.disableClusteringAtZoom', 18))
    },
    async fillIconStyles(values) {
      this.iconStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default icon
      if (!templates.includes('marker-color') && !templates.includes('icon-classes')) {
        // Conversion from palette to RGB color is required for markers
        this.defaultIcon.color = kCoreUtils.getPaletteFromColor(_.get(values, 'leaflet.marker-color',
          _.get(this.options, 'pointStyle.icon.options.markerColor', 'blue')))
        this.defaultIcon.name = _.get(values, 'leaflet.icon-classes',
          _.get(this.options, 'pointStyle.icon.options.iconClasses', 'fas fa-circle'))
      } else {
        // Otherwise we have icons for a set of values templated using if statements
        // Split after else statement to get default icon color/name
        const templateColors = _.get(values, 'leaflet.marker-color').split('} else {')
        const templateNames = _.get(values, 'leaflet.icon-classes').split('} else {')
        // Conversion from palette to RGB color is required for markers
        this.defaultIcon.color = kCoreUtils.getPaletteFromColor(templateColors[1].match(/%>([^<%]+)<%/)[1])
        this.defaultIcon.name = templateNames[1].match(/%>([^<%]+)<%/)[1]
        // Match properties equality to get property names
        const propertyNameRegex = /properties.([^===]+)===/g
        // Match quotes to get property values and %> <% to get icon colors/names
        const propertyValueRegex = /"([^"]+)"/g
        const colorRegex = /%>([^<%]+)<%/g
        const nameRegex = /%>([^<%]+)<%/g
        let propertyValue
        while ((propertyValue = propertyValueRegex.exec(templateColors[0])) !== null) {
          const propertyName = propertyNameRegex.exec(templateColors[0])
          const color = colorRegex.exec(templateColors[0])
          const name = nameRegex.exec(templateNames[0])
          this.iconStyles.push(this.createStyle(propertyName[1].trim(), {
            icon: { name: name[1].trim(), color: kCoreUtils.getPaletteFromColor(color[1].trim()) },
            value: propertyValue[1].replace('"', '').trim()
          }))
        }
        await this.loadStyleComponents(this.iconStyles)
      }
    },
    async fillLineStyles(values) {
      this.lineStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default style
      if (!templates.includes('stroke-color') && !templates.includes('stroke-width') && !templates.includes('stroke-opacity')) {
        // Conversion from palette to RGB color is required for path style
        this.defaultLine['stroke-color'] = kCoreUtils.getPaletteFromColor(_.get(values, 'leaflet.stroke-color',
          kCoreUtils.getColorFromPalette(_.get(this.options, 'featureStyle.color'), 'red')))
        this.defaultLine['stroke-width'] = _.get(values, 'leaflet.stroke-width',
          _.get(this.options, 'featureStyle.weight', 1))
        this.defaultLine['stroke-opacity'] = _.get(values, 'leaflet.stroke-opacity',
          _.get(this.options, 'featureStyle.opacity', 1))
      } else {
        // Otherwise we have line styles for a set of values templated using if statements
        // Split after else statement to get default line style
        const templateColors = _.get(values, 'leaflet.stroke-color').split('} else {')
        const templateWidths = _.get(values, 'leaflet.stroke-width').split('} else {')
        const templateOpacities = _.get(values, 'leaflet.stroke-opacity').split('} else {')
        // Conversion from palette to RGB color is required for markers
        this.defaultLine['stroke-color'] = kCoreUtils.getPaletteFromColor(templateColors[1].match(/%>([^<%]+)<%/)[1])
        this.defaultLine['stroke-width'] = templateWidths[1].match(/%>([^<%]+)<%/)[1]
        this.defaultLine['stroke-opacity'] = templateOpacities[1].match(/%>([^<%]+)<%/)[1]
        // Match properties equality to get property names
        const propertyNameRegex = /properties.([^===]+)===/g
        // Match quotes to get property values and %> <% to get icon colors/names
        const propertyValueRegex = /"([^"]+)"/g
        const colorRegex = /%>([^<%]+)<%/g
        const widthRegex = /%>([^<%]+)<%/g
        const opacityRegex = /%>([^<%]+)<%/g
        let propertyValue
        while ((propertyValue = propertyValueRegex.exec(templateColors[0])) !== null) {
          const propertyName = propertyNameRegex.exec(templateColors[0])
          const color = colorRegex.exec(templateColors[0])
          const width = widthRegex.exec(templateWidths[0])
          const opacity = opacityRegex.exec(templateOpacities[0])
          this.lineStyles.push(this.createStyle(propertyName[1].trim(), {
            'stroke-color': kCoreUtils.getPaletteFromColor(color[1].trim()),
            'stroke-width': Number(width[1].trim()),
            'stroke-opacity': Number(opacity[1].trim()),
            value: propertyValue[1].replace('"', '').trim()
          }))
        }
        await this.loadStyleComponents(this.lineStyles)
      }
    },
    async fillPolygonStyles(values) {
      this.polygonStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default style
      if (!templates.includes('fill-color') && !templates.includes('fill-opacity')) {
        // Conversion from palette to RGB color is required for path style
        this.defaultPolygon['fill-color'] = kCoreUtils.getPaletteFromColor(_.get(values, 'leaflet.fill-color',
          kCoreUtils.getColorFromPalette(_.get(this.options, 'featureStyle.fillColor', 'green'))))
        this.defaultPolygon['fill-opacity'] = _.get(values, 'leaflet.fill-opacity',
          _.get(this.options, 'featureStyle.fillOpacity', 1))
      } else {
        // Otherwise we have polygon styles for a set of values templated using if statements
        // Split after else statement to get default polygon style
        const templateColors = _.get(values, 'leaflet.fill-color').split('} else {')
        const templateOpacities = _.get(values, 'leaflet.fill-opacity').split('} else {')
        // Conversion from palette to RGB color is required for markers
        this.defaultPolygon['fill-color'] = kCoreUtils.getPaletteFromColor(templateColors[1].match(/%>([^<%]+)<%/)[1])
        this.defaultPolygon['fill-opacity'] = templateOpacities[1].match(/%>([^<%]+)<%/)[1]
        // Match properties equality to get property names
        const propertyNameRegex = /properties.([^===]+)===/g
        // Match quotes to get property values and %> <% to get icon colors/names
        const propertyValueRegex = /"([^"]+)"/g
        const colorRegex = /%>([^<%]+)<%/g
        const opacityRegex = /%>([^<%]+)<%/g
        let propertyValue
        while ((propertyValue = propertyValueRegex.exec(templateColors[0])) !== null) {
          const propertyName = propertyNameRegex.exec(templateColors[0])
          const color = colorRegex.exec(templateColors[0])
          const opacity = opacityRegex.exec(templateOpacities[0])
          this.polygonStyles.push(this.createStyle(propertyName[1].trim(), {
            'fill-color': kCoreUtils.getPaletteFromColor(color[1].trim()),
            'fill-opacity': Number(opacity[1].trim()),
            value: propertyValue[1].replace('"', '').trim()
          }))
        }
        await this.loadStyleComponents(this.polygonStyles)
      }
    },
    async fillPopupStyles(values) {
      this.popup = (_.get(values, 'leaflet.popup') ? true : false)
      this.popupProperties = _.get(values, 'leaflet.popup.pick',
        _.get(this.options, 'popup.pick', this.properties.map(property => property.value)))
      // Jump to select data model
      if (this.popupProperties) this.popupProperties = this.popupProperties.map(property =>
        _.find(this.properties, { value: property })
      )
    },
    async fillTooltipStyles(values) {
      this.tooltip = (_.get(values, 'leaflet.tooltip') ? true : false)
      this.tooltipProperty = _.get(values, 'leaflet.tooltip.property',
        _.get(this.options, 'tooltip.property', null))
      // Jump to select data model
      if (this.tooltipProperty) this.tooltipProperty = _.find(this.properties, { value: this.tooltipProperty })
    },
    async fill (values) {
      logger.debug('Filling layer style form', values)
      // Clustering
      this.fillClusteringStyle(values)
      // Points
      await this.fillIconStyles(values)
      // Lines
      await this.fillLineStyles(values)
      // Polygons
      await this.fillPolygonStyles(values)
      // Popup
      await this.fillPopupStyles(values)
      // Tooltip
      await this.fillTooltipStyles(values)
      
    },
    validate () {
      logger.debug('Validating layer style form')
      this.hasError = false
      return {
        isValid: !this.hasError,
        values: this.values()
      }
    },
    clusteringValues () {
      return {
        'leaflet.cluster': (this.clustering ? { disableClusteringAtZoom: this.disableClusteringAtZoom } : false)
      }
    },
    iconStylesValues() {
      let values = {}
      values['leaflet.icon-color'] = '#FFFFFF'
      values['leaflet.template'] = (this.hasIconStyles ? ['marker-color', 'icon-classes'] : [])
      let colorTemplate = '', iconTemplate = ''
      this.iconStyles.forEach(style => {
        // Conversion from palette to RGB color is required for markers
        const color = kCoreUtils.getColorFromPalette(style.icon.color)
        const name = style.icon.name
        const property = style.property
        const value = style.value
        colorTemplate += `if (properties.${property} === "${value}") { %>${color}<% } else `
        iconTemplate += `if (properties.${property} === "${value}") { %>${name}<% } else `
      })
      // Conversion from palette to RGB color is required for markers
      const color = kCoreUtils.getColorFromPalette(this.defaultIcon.color)
      const name = this.defaultIcon.name
      colorTemplate += (this.hasIconStyles ? `{ %>${color}<% }` : `${color}`)
      iconTemplate +=  (this.hasIconStyles ? `{ %>${name}<% }` : `${name}`)
      values['leaflet.marker-color'] = (this.hasIconStyles ? `<% ${colorTemplate} %>` : `${colorTemplate}`)
      values['leaflet.icon-classes'] = (this.hasIconStyles ? `<% ${iconTemplate} %>` : `${iconTemplate}`)
      return values
    },
    lineStylesValues() {
      let values = {}
      let colorTemplate = '', widthTemplate = '', opacityTemplate = ''
      this.lineStyles.forEach(style => {
        // Conversion from palette to RGB color is required for styles
        const color = kCoreUtils.getColorFromPalette(style['stroke-color'])
        const width = style['stroke-width']
        const opacity = style['stroke-opacity']
        const property = style.property
        const value = style.value
        colorTemplate += `if (properties.${property} === "${value}") { %>${color}<% } else `
        widthTemplate += `if (properties.${property} === "${value}") { %>${width}<% } else `
        opacityTemplate += `if (properties.${property} === "${value}") { %>${opacity}<% } else `
      })
      // Conversion from palette to RGB color is required for styles
      const color = kCoreUtils.getColorFromPalette(this.defaultLine['stroke-color'])
      const width = this.defaultLine['stroke-width']
      const opacity = this.defaultLine['stroke-opacity']
      colorTemplate += (this.hasLineStyles ? `{ %>${color}<% }` : `${color}`)
      widthTemplate +=  (this.hasLineStyles ? `{ %>${width}<% }` : `${width}`)
      opacityTemplate +=  (this.hasLineStyles ? `{ %>${opacity}<% }` : `${opacity}`)
      values['leaflet.stroke-color'] = (this.hasLineStyles ? `<% ${colorTemplate} %>` : `${colorTemplate}`)
      values['leaflet.stroke-width'] = (this.hasLineStyles ? `<% ${widthTemplate} %>` : `${widthTemplate}`)
      values['leaflet.stroke-opacity'] = (this.hasLineStyles ? `<% ${opacityTemplate} %>` : `${opacityTemplate}`)
      values['leaflet.template'] = (this.hasLineStyles ? ['stroke-color', 'stroke-width', 'stroke-opacity'] : [])
      return values
    },
    polygonStylesValues() {
      let values = {}
      let colorTemplate = '', opacityTemplate = ''
      this.polygonStyles.forEach(style => {
        // Conversion from palette to RGB color is required for styles
        const color = kCoreUtils.getColorFromPalette(style['fill-color'])
        const opacity = style['fill-opacity']
        const property = style.property
        const value = style.value
        colorTemplate += `if (properties.${property} === "${value}") { %>${color}<% } else `
        opacityTemplate += `if (properties.${property} === "${value}") { %>${opacity}<% } else `
      })
      // Conversion from palette to RGB color is required for styles
      const color = kCoreUtils.getColorFromPalette(this.defaultPolygon['fill-color'])
      const opacity = this.defaultPolygon['fill-opacity']
      colorTemplate += (this.hasPolygonStyles ? `{ %>${color}<% }` : `${color}`)
      opacityTemplate +=  (this.hasPolygonStyles ? `{ %>${opacity}<% }` : `${opacity}`)
      values['leaflet.fill-color'] = (this.hasPolygonStyles ? `<% ${colorTemplate} %>` : `${colorTemplate}`)
      values['leaflet.fill-opacity'] = (this.hasPolygonStyles ? `<% ${opacityTemplate} %>` : `${opacityTemplate}`)
      values['leaflet.template'] = (this.hasPolygonStyles ? ['fill-color', 'fill-opacity'] : [])
      return values
    },
    popupStylesValues() {
      return {
        'leaflet.popup': (this.popup ? { pick: this.popupProperties.map(property => property.value) } : undefined)
      }
    },
    tooltipStylesValues() {
      return {
        'leaflet.tooltip': (this.tooltip ? { property: this.tooltipProperty.value } : undefined)
      }
    },
    values () {
      let values = {}
      // Be default lodash merges objects only not arrays
      // As the template style property is one we need this
      const customizer = (objValue, srcValue) => {
        if (_.isArray(objValue)) return objValue.concat(srcValue)
      }
      // Clustering
      _.merge(values, this.clusteringValues())
      // Point style
      _.mergeWith(values, this.iconStylesValues(), customizer)
      // Line style
      _.mergeWith(values, this.lineStylesValues(), customizer)
      // Polygon style
      _.mergeWith(values, this.polygonStylesValues(), customizer)
      // Popup style
      _.merge(values, this.popupStylesValues())
      // Tooltip style
      _.merge(values, this.tooltipStylesValues())
      return values
    },
    createStyle (property, options = {}) {
      // Retrieve schema descriptor
      const properties = this.fields[property]
      const componentKey = _.kebabCase(properties.field.component)
      // Load the required component if not previously loaded
      if (!this.$options.components[componentKey]) {
        this.$options.components[componentKey] = this.$load(properties.field.component)
      }
      let style = {
        key: uid().toString(), componentKey, property, properties,
        onValueChanged: (field, value) => style.value = value
      }
      return Object.assign(style, options)
    },
    onAddIconStyle (property) {
      this.iconStyles.push(this.createStyle(property.value, {
        // Default icon
        icon: {
          name: _.get(this.options, 'pointStyle.icon.options.iconClasses', 'fas fa-circle'),
          color: _.get(this.options, 'pointStyle.icon.options.markerColor', 'blue')
        },
      }))
    },
    onRemoveIconStyle (style) {
      // Required to update the array to make it reactive
      this.iconStyles = this.iconStyles.filter(item => item.key !== style.key)
    },
    onIconClicked (style) {
      this.editedStyle = style
      this.$refs.iconChooser.open(style.icon.name, style.icon.color)
    },
    onIconChanged (icon) {
      Object.assign(this.editedStyle.icon, icon)
    },
    onColorClicked (style, color) {
      this.editedStyle = style
      this.editedColor = color
      this.$refs.colorChooser.open(_.get(style, color))
    },
    onColorChanged (color) {
      _.set(this.editedStyle, this.editedColor, color)
    },
    onAddLineStyle (property) {
      this.lineStyles.push(this.createStyle(property.value, {
        // Default line
        'stroke-color': _.get(this.options, 'featureStyle.color', 'red'),
        'stroke-width': _.get(this.options, 'featureStyle.weight', 1),
        'stroke-opacity': _.get(this.options, 'featureStyle.opacity', 1)
      }))
    },
    onRemoveLineStyle (style) {
      // Required to update the array to make it reactive
      this.lineStyles = this.lineStyles.filter(item => item.key !== style.key)
    },
    onAddPolygonStyle (property) {
      this.polygonStyles.push(this.createStyle(property.value, {
        // Default line
        'fill-color': _.get(this.options, 'featureStyle.fillColor', 'green'),
        'fill-opacity': _.get(this.options, 'featureStyle.fillOpacity', 1)
      }))
    },
    onRemovePolygonStyle (style) {
      // Required to update the array to make it reactive
      this.polygonStyles = this.polygonStyles.filter(item => item.key !== style.key)
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-icon-chooser'] = this.$load('input/KIconChooser')
    this.$options.components['k-color-chooser'] = this.$load('input/KColorChooser')

    await this.build()
    this.property = this.properties[0]
    this.$emit('form-ready', this)
  }
}
</script>
