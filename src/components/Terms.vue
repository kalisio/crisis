<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <KMarkdownViewer 
          :url="`statics/aktnmap-terms_${locale}.md`"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { utils as kdkCoreUtils } from '@kalisio/kdk/core.client'

export default {
  name: 'terms',
  components: {
    KMarkdownViewer: kdkCoreUtils.loadComponent('media/KMarkdownViewer')
  },
  data () {
    return {
      locale: kCoreUtils.getAppLocale()
    }
  }
}
</script>
