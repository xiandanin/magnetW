<template>
  <browser-link :href="url" type="primary">
    <el-tag size="mini" v-show="resolution"
            disable-transitions :type="getResolutionTagType(resolution)">
      {{resolution}}
    </el-tag>
    <span v-html="highlight(keyword, value, 'highlight-name')"></span>
  </browser-link>
</template>

<script>
  import BrowserLink from './BrowserLink'

  export default {
    components: {BrowserLink},
    props: ['keyword', 'resolution', 'url', 'value'],
    methods: {
      getResolutionTagType (resolution) {
        if (resolution) {
          const regx = {
            '4K': 'primary',
            '2K': 'danger',
            '1080P': 'success'
          }
          for (let key in regx) {
            if (new RegExp(key, 'i').test(resolution)) {
              return regx[key]
            }
          }
          return 'info'
        }
      },
      /**
       * 点击磁力链
       */
      handleOpenMagnet (url) {
        window.open(url)
      }
    }
  }
</script>
<style lang="scss">
  .highlight-name {
    color: $--color-danger
  }
</style>
