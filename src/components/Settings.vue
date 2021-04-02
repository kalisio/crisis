<template>
  <div>
    <q-list>
      <!--
        Edit link
      -->
      <q-item id="edit-settings" @click="editSettings" clickable v-ripple>
        <q-item-section avatar><q-icon name="las la-cog"/></q-item-section>
        <q-item-section>{{$t('sideNav.SETTINGS')}}</q-item-section>
      </q-item>
    </q-list>
    <!--
      Create editor
     -->
    <k-modal-editor
      id="editor"
      ref="editor" 
      service="settings"
      objectId="settings"
      @applied="onSettingsEdited" />
  </div>
</template>

<script>

export default {
  name: 'settings',
  methods: {
    editSettings () {
      this.$refs.editor.openModal()
    },
    onSettingsEdited () {
      this.$refs.editor.closeModal()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal-editor'] = this.$load('editor/KModalEditor')
  }
}
</script>