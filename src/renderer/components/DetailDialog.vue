<template>
  <el-dialog :visible.sync="dialog.show"
             width="80%">
    <div slot="title">{{dialog.name}}</div>
    <div class="detail-dialog-content"
         v-loading="loading"
         element-loading-text="此源站需要分析详情，请稍等">
      <div class="dialog-error-parent" v-show="!loading&&errorMessage">
        <span class="dialog-error-message">{{errorMessage}}</span>
      </div>
      <div v-if="detail" class="detail-info">
        <div class="detail-info-left">
          <browser-link v-show="detail.magnet" type="primary" :href="detail.magnet">{{detail.magnet}}</browser-link>
          <div v-if="detail.files">
            <div class="row-title">文件列表</div>
            <el-row v-for="f in detail.files" :key="f.name" class="file-row-item" :gutter="20">
              <el-col :span="20">{{f.name}}</el-col>
              <el-col :span="4">{{f.size | size}}</el-col>
            </el-row>
          </div>
        </div>
        <div class="detail-info-right">
          <qrcode v-show="detail.magnet" :value="detail.magnet"
                  :options="{ width: 150, margin:0 }"></qrcode>
          <item-button-group :item="detail"
                             :list="['miwifi','copy']"
                             class="detail-button-group">
          </item-button-group>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  import BrowserLink from './BrowserLink'
  import ItemButtonGroup from './ItemButtonGroup'
  import Qrcode from '@chenfengyuan/vue-qrcode'

  export default {
    components: {Qrcode, ItemButtonGroup, BrowserLink},
    props: {
      'dialog': {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        loading: false,
        detail: null,
        detailCache: {},
        errorMessage: null
      }
    },
    watch: {
      dialog (val) {
        const vm = this

        if (vm.detail && vm.detail.url && vm.detail.url.indexOf(val.path) !== -1) {
          return
        }

        vm.errorMessage = null

        const path = val.path
        const id = val.id

        if (path in vm.detailCache) {
          vm.detail = vm.detailCache[path]
        } else {
          vm.loading = true
          this.$http.get('/detail', {
            params: {id, path}
          }).then((rsp) => {
            const data = rsp.data
            vm.detail = data
            if (data) {
              vm.detailCache[path] = data
            }
          }).catch((err) => {
            vm.errorMessage = err.message
          }).finally(() => {
            vm.loading = false
          })
        }
      }
    },
    methods: {},
    created () {

    }
  }
</script>

<style lang="scss" scoped>

  .detail-dialog-content {
    min-height: 150px;
    position: relative;
  }

  .dialog-error-parent {
    height: 100%;
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .dialog-error-message {
      text-align: center;
      font-size: 16px;
      color: $--color-danger;
      position: absolute;
      margin: auto;
    }
  }

  /deep/ .el-dialog__header {
    word-break: break-all;
    margin-right: 20px;
    padding-bottom: 0;
  }

  .el-loading-mask {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .el-loading-spinner {
    top: auto;
    margin-top: auto;
  }

  .file-row-item {
    margin-top: 5px;
  }

  .row-title {
    font-size: 1.17em;
    font-weight: bold;
    margin: 15px 0 5px 0;
  }

  .detail-info {
    display: flex;

    .detail-info-left {
      flex: 1;
      margin-right: 20px;
    }
  }

  .detail-button-group /deep/ .el-link, .detail-button-group /deep/ .el-button {
    margin-top: 10px;
    width: 100%;
    display: block;
    margin-left: 0 !important;
  }
</style>
