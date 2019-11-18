<template>
    <div class="guide-page" v-html="markedGuideContent">
    </div>
</template>

<script>
  import marked from 'marked'
  import {ipcRenderer} from 'electron'

  export default {
    props: [],
    data () {
      return {
        guideContent: null
      }
    },
    computed: {
      markedGuideContent () {
        return marked(this.guideContent)
      }
    },
    methods: {},
    created () {
      // this.guideContent = ipcRenderer.sendSync('get-guide-markdown')
    }
  }
</script>

<style scoped lang="scss">

    .guide-page {
        height: 100%;
        padding: 20px;
        position: absolute;
        z-index: 2000;
    }

    .p {

    }

    .header-disclaimer-text {
        color: $color-text-gray;
        font-size: 12px;
    }
</style>
