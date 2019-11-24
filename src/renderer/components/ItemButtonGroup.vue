<template>
    <div>
        <qrcode-popover :text="item.magnet" :title="item.name">
            <el-button :size="size" icon="iconfont icon-qrcode" class="popover-button">
                二维码
            </el-button>
        </qrcode-popover>
        <el-button :size="size" icon="el-icon-document" @click="handleDetailUrl(item.detailUrl)">
            源站详情
        </el-button>
        <el-button :size="size" icon="iconfont icon-router" @click="handleMiWiFi(item.magnet)">
            小米路由
        </el-button>
        <el-button :size="size" type="primary" plain icon="el-icon-copy-document"
                   @click="handleCopyMagnet(item.magnet)">
            复制链接
        </el-button>
    </div>
</template>

<script>
  import {ipcRenderer, clipboard, shell} from 'electron'
  import {Base64} from 'js-base64'
  import QrcodePopover from './QrcodePopover'
  import mixin from '../mixins/mixin'

  export default {
    props: {'baseURL': String, 'item': Object},
    components: {
      QrcodePopover
    },
    mixins: [mixin],
    data () {
      return {
        size: 'mini'
      }
    },
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
        shell.openExternal(this.formatURL(this.baseURL + detailUrl))
      }
    }
  }
</script>
<style scoped lang="scss">
    .header-version {
        width: 180px;
    }

    .header-version-text {
        margin-left: 10px;
        color: $color-title;
        line-height: 1.3;
    }

    .popover-button {
        margin-right: 5px;
    }

    .el-button + .el-button {
        margin-left: 5px;
    }

    .el-button--mini {
        padding: 7px 10px;
    }
</style>
