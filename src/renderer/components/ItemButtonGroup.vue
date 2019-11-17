<template>
    <el-button-group>
        <el-button size="small" @click="handleDetailUrl(item.detailUrl)">
            源站详情
        </el-button>
        <el-button size="small" @click="handleMiWiFi(item.magnet)">
            小米路由
        </el-button>
        <el-button size="small" @click="handleCopyMagnet(item.magnet)">
            复制链接
        </el-button>
    </el-button-group>
</template>

<script>
  import {ipcRenderer, clipboard, shell} from 'electron'
  import {Base64} from 'js-base64'

  export default {
    props: {'activeUrl': String, 'item': Object},
    methods: {
      /**
       * 复制链接
       * @param url
       */
      handleCopyMagnet (url) {
        clipboard.writeText(url)
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      },
      /**
       * 小米路由
       * @param url
       */
      handleMiWiFi (url) {
        const miwifi = 'http://d.miwifi.com/d2r/?url=' + Base64.encodeURI(url)
        shell.openExternal(miwifi)
      },
      /**
       * 去源站详情
       * @param detailUrl
       */
      handleDetailUrl (detailUrl) {
        shell.openExternal(this.activeUrl + detailUrl)
      }
    }
  }
</script>
<style lang="scss">
    .header-version {
        width: 180px;
    }

    .header-version-text {
        margin-left: 10px;
        color: $color-title;
        line-height: 1.3;
    }
</style>
