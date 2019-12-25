<template>
  <div class="config">
    <el-form ref="form" label-width="auto" label-position="left">
      <el-form-item label="默认窗口大小">
        <el-radio-group v-model="config.maxWindow">
          <el-radio :label="false">标准</el-radio>
          <el-radio :label="true">最大化</el-radio>
        </el-radio-group>
      </el-form-item>
      <tooltip-form-item label="云引擎URL" tooltip="通过服务器中转来加速请求">
        <el-input :size="formSize" v-model="config.cloudUrl" :placeholder="defaultConfig.cloudUrl"></el-input>
      </tooltip-form-item>
      <tooltip-form-item label="规则同步URL" tooltip="解析源站的规则文件URL，支持网络链接和本地路径">
        <el-input :size="formSize" v-model="config.ruleUrl" :placeholder="defaultConfig.ruleUrl"></el-input>
      </tooltip-form-item>
      <el-form-item label="源站">
        <el-checkbox v-model="config.showProxyRule">显示所有源站</el-checkbox>
        <el-checkbox v-model="config.showSourceLink">显示源站入口</el-checkbox>
      </el-form-item>
      <el-form-item label="预加载">
        <el-switch v-model="config.preload"></el-switch>
      </el-form-item>
      <el-form-item label="缓存有效时间">
        <el-input :size="formSize" v-model="config.cacheExpired" :placeholder="defaultConfig.cacheExpired"
                  class="form-input-center small-input-width">
          <template slot="append">秒</template>
        </el-input>
      </el-form-item>
      <el-form-item label="启用HTTP代理">
        <el-row>
          <el-col :span="3">
            <el-switch v-model="config.proxy"></el-switch>
          </el-col>
          <el-col :span="20">
            <el-input :size="formSize" v-model="config.proxyHost" :placeholder="defaultConfig.proxyHost"
                      class="form-input-center medium-input-width">
              <template slot="prepend">地址</template>
            </el-input>
            <el-input :size="formSize" v-model="config.proxyPort" :placeholder="defaultConfig.proxyPort"
                      class="form-input-center small-input-width input-append">
              <template slot="prepend">端口</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="请求标识">
        <el-switch v-model="config.requestIdentifier"></el-switch>
      </el-form-item>
      <el-form-item label="自定义UserAgent">
        <el-switch v-model="config.customUserAgent"></el-switch>
        <el-input v-show="config.customUserAgent" type="textarea"
                  v-model="config.customUserAgentValue" placeholder="自定义UserAgent"
                  :size="formSize"></el-input>
      </el-form-item>
      <el-form-item label="日志">
        <el-input disabled :size="formSize" v-model="appInfo.logDir">
          <el-button slot="append" icon="el-icon-folder-opened" @click="handleOpenLoggerDir"></el-button>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import TooltipFormItem from './TooltipFormItem'
  import {ipcRenderer, shell} from 'electron'

  export default {
    components: {TooltipFormItem},
    props: {
      config: Object
    },
    data () {
      return {
        formSize: 'mini',
        defaultConfig: ipcRenderer.sendSync('get-default-server-config'),
        appInfo: ipcRenderer.sendSync('get-app-info')
      }
    },
    methods: {
      handleOpenLoggerDir () {
        if (this.appInfo.logDir) {
          shell.showItemInFolder(this.appInfo.logDir)
        }
      }
    },
    created () {
    }
  }
</script>

<style scoped lang="scss">
  .config {
    position: relative;
  }

  .el-form-item__content .el-input-group {
    vertical-align: middle;
  }

  .form-input-center /deep/ input {
    text-align: center;
  }

  /deep/ .el-form-item__label-wrap {
    margin-left: 0 !important;
  }

  .placeholder-disabled {
    background-color: white;
    opacity: 0.7;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .small-input-width {
    width: 130px;
  }

  .input-append {
    margin-left: 20px;
  }

  .medium-input-width {
    width: 180px;
  }

</style>
