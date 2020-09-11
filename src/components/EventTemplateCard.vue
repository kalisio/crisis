<template>
  <k-card v-bind="$props" :itemActions="actions">
    <template v-slot:card-label>
      <span class="text-subtitle1 text-weight-medium ellipsis-2-lines">{{ name }}</span>
    </template>
    <template v-slot:card-content>
      <q-separator />
      <div class="q-pa-sm">
        <k-text-area :text="description" :length="150" />
      </div>
    </template>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins, utils as kCoreUtils } from '@kalisio/kdk/core.client'
import { Dialog, QIcon } from 'quasar'

export default {
  name: 'event-template-card',
  mixins: [kCoreMixins.baseItem],
  components: {
    QIcon
  },
  computed: {
    iconColor () {
      return _.get(this.item, 'icon.color', '')
    },
    iconName () {
      return kCoreUtils.getIconName(this.item)
    }
  },
  methods: {
    refreshActions () {
      // Item actions
      this.clearActions()
      if (this.$can('update', 'event-templates', this.contextId, this.item)) {
        this.registerPaneAction({
          name: 'edit-event-template',
          label: this.$t('EventTemplateCard.EDIT_LABEL'),
          icon: 'las la-file-alt',
          route: { name: 'edit-event-template', params: { contextId: this.contextId, objectId: this.item._id } }
        })
      }
      if (this.$can('update', 'event-templates', this.contextId, this.item)) {
        this.registerPaneAction({
          name: 'copy-event-template',
          label: this.$t('EventTemplateCard.COPY_LABEL'),
          icon: 'las la-copy',
          route: { name: 'create-event-template', params: { contextId: this.contextId, templateId: this.item._id } }
        })
      }
      if (this.$can('remove', 'event-templates', this.contextId, this.item)) {
        this.registerMenuAction({
          name: 'remove-event-template', label: this.$t('EventTemplateCard.REMOVE_LABEL'), icon: 'las la-minus-circle', handler: this.removeEventTemplate
        })
      }
    },
    removeEventTemplate (template) {
      Dialog.create({
        title: this.$t('EventTemplateCard.REMOVE_DIALOG_TITLE', { template: template.name }),
        message: this.$t('EventTemplateCard.REMOVE_DIALOG_MESSAGE', { template: template.name }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(() => {
        const eventTemplatesService = this.$api.getService('event-templates')
        eventTemplatesService.remove(template._id)
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
  }
}
</script>
