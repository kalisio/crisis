<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <k-markdown-viewer :url="`statics/aktnmap-terms_${locale}.md`"></k-markdown-viewer>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { utils as kCoreUtils } from '@kalisio/kdk/core.client'
import * as utils from '../utils'

export default {
  name: 'terms',
  data () {
    return {
      locale: kCoreUtils.getAppLocale()
    }
  },
  created () {
    this.$options.components['k-screen'] = utils.loadComponent('frame/KScreen')
    this.$options.components['k-markdown-viewer'] = utils.loadComponent('media/KMarkdownViewer')
  }
}
</script>
