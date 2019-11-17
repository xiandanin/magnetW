<template>
    <div>
        <el-tag size="mini" v-show="resolution"
                disable-transitions :type="getResolutionTagType(resolution)">
            {{resolution}}
        </el-tag>
        <span class="page-items-magnet" @click="handleOpenMagnet(url)"
              v-html="highlight(keyword, value, 'highlight-name')"></span>
    </div>
</template>

<script>
  import {shell} from 'electron'

  export default {
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
        shell.openExternal(url)
      }
    }
  }
</script>
<style lang="scss">
    .page-items-magnet {
        color: $--color-primary;
        cursor: pointer;

        .highlight-name {
            color: $--color-danger;
        }
    }
</style>
