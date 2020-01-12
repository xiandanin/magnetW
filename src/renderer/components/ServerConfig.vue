<template>
  <div class="config">
    <el-form ref="settingForm" label-width="130px" label-position="left" :model='config' :rules="formRules">
      <el-form-item label="默认窗口大小">
        <el-radio-group v-model="config.maxWindow">
          <el-radio :label="false">标准</el-radio>
          <el-radio :label="true">最大化</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="源站">
        <el-checkbox v-model="config.showProxyRule">显示所有源站</el-checkbox>
        <el-checkbox v-model="config.showSourceLink">显示源站入口</el-checkbox>
      </el-form-item>
      <tooltip-form-item label="云解析" prop="cloudUrl" tooltip="通过服务器中转来代理请求">
        <el-row>
          <el-col :span="3">
            <el-switch v-model="config.cloud"></el-switch>
          </el-col>
          <el-col :span="21">
            <el-input :size="formSize" v-model="config.cloudUrl"
                      :placeholder="defaultConfig.cloudUrl||'输入解析服务器的BaseURL'"></el-input>
          </el-col>
        </el-row>
      </tooltip-form-item>
      <div v-show="!config.cloud">
        <div class="setting-item-dividing"></div>
        <el-form-item label="映射端口">
          <el-radio-group v-model="config.customServerPort">
            <el-radio :label="false">自动分配</el-radio>
            <el-radio :label="true">自定义</el-radio>
          </el-radio-group>
          <el-input :size="formSize" v-model="config.customServerPortValue" class="input-server-port"
                    type="number" placeholder="端口号" :disabled="!config.customServerPort"></el-input>
          <div v-if="appInfo.server" class="server-status-success">
            <span>搜索服务已启动，映射端口：{{appInfo.server.port}}</span>
          </div>
          <div v-else class="server-status-error">服务启动失败，请查看日志</div>
        </el-form-item>
        <tooltip-form-item label="规则同步URL" tooltip="解析源站的规则文件URL，支持网络链接和本地路径">
          <el-input :size="formSize" v-model="config.ruleUrl" :placeholder="defaultConfig.ruleUrl"></el-input>
        </tooltip-form-item>
        <el-form-item label="启用代理">
          <el-row>
            <el-col :span="3">
              <el-switch v-model="config.proxy"></el-switch>
            </el-col>
            <el-col :span="10">
              <el-radio-group v-model="config.proxyType">
                <el-radio label="http">HTTP</el-radio>
                <el-radio label="socks5">Socks5</el-radio>
              </el-radio-group>
            </el-col>
          </el-row>
          <div>
            <el-input :size="formSize" v-model="config.proxyHost" :placeholder="defaultConfig.proxyHost"
                      class="form-input-center medium-input-width">
              <template slot="prepend">地址</template>
            </el-input>
            <el-input :size="formSize" v-model.number="config.proxyPort" :placeholder="defaultConfig.proxyPort"
                      type="number"
                      class="form-input-center small-input-width input-append">
              <template slot="prepend">端口</template>
            </el-input>
            <el-button :size="formSize" @click="handleCheckProxy" class="input-append" :loading="checkProxyLoading">
              测试连接
            </el-button>
          </div>
          <el-input v-show="checkProxyInfo" type="textarea"
                    v-model="checkProxyInfo"
                    disabled
                    autosize
                    class="textarea-proxy-info"
                    :size="formSize"></el-input>
        </el-form-item>
        <div class="setting-item-dividing"></div>
        <el-form-item label="内容过滤">
          <el-checkbox v-model="config.filterBare">过滤暴露内容</el-checkbox>
          <el-checkbox v-model="config.filterEmpty">过滤空文件</el-checkbox>
        </el-form-item>
        <el-form-item label="预加载">
          <el-switch v-model="config.preload"></el-switch>
        </el-form-item>
        <el-form-item label="缓存有效时间">
          <el-input :size="formSize" v-model.number="config.cacheExpired" :placeholder="defaultConfig.cacheExpired"
                    type="number"
                    class="form-input-center small-input-width">
            <template slot="append">秒</template>
          </el-input>
        </el-form-item>
        <el-form-item label="自定义UserAgent" prop="customUserAgentValue">
          <el-switch v-model="config.customUserAgent"></el-switch>
          <el-input v-show="config.customUserAgent" type="textarea"
                    v-model="config.customUserAgentValue" placeholder="自定义UserAgent"
                    :size="formSize"></el-input>
        </el-form-item>
        <el-form-item label="请求标识">
          <el-switch v-model="config.requestIdentifier"></el-switch>
        </el-form-item>
      </div>
      <div class="setting-item-dividing"></div>
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
        checkProxyLoading: false,
        checkProxyInfo: null,
        defaultConfig: ipcRenderer.sendSync('get-default-server-config'),
        appInfo: ipcRenderer.sendSync('get-app-info'),
        formRules: {
          cloudUrl: [{
            validator: (rule, value, callback) => {
              // 如果开启了云解析 但不是url
              const regx = /^(http|https):\/\//
              const err = this.config.cloud && !regx.test(value) ? new Error('请输入正确的BaseURL') : undefined
              callback(err)
            },
            trigger: 'change'
          }],
          customUserAgentValue: [{
            validator: (rule, value, callback) => {
              // 如果开启了自定义UserAgent 但是值不合适
              const regx = /^\s*$|[\u4e00-\u9fa5]|magnet|magnetw|magnetx|mwbrowser|mwspider/
              const err = this.config.customUserAgent && (!value || regx.test(value)) ? new Error('请输入正确的UserAgent') : undefined
              callback(err)
            },
            trigger: 'change'
          }]
        }
      }
    },
    methods: {
      handleOpenLoggerDir () {
        if (this.appInfo.logDir) {
          shell.showItemInFolder(this.appInfo.logDir)
        }
      },
      handleCheckProxy () {
        this.checkProxyLoading = true
        ipcRenderer.send('get-network-info', this.config)
      }
    },
    created () {
      // 测试代理的监听
      ipcRenderer.on('on-get-network-info', (event, {info, test, time}) => {
        this.checkProxyLoading = false
        this.checkProxyInfo = (test ? `连接正常 ${time}ms` : '连接失败，请检查地址端口是否正确') + (info ? `\n\n${info.trim()}` : '')
      })
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

  /deep/ input::-webkit-outer-spin-button,
  /deep/ input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  /deep/ input[type="number"] {
    -moz-appearance: textfield;
  }

  .textarea-proxy-info {
    margin-top: 10px;

    /deep/ .el-textarea__inner {
      line-height: 120% !important;
    }
  }

  .config-item-title {
    font-size: 20px;
    font-weight: bolder;
    color: $--color-text-primary;
  }

  .server-status-error {
    color: $--color-danger;
  }

  .server-status-success {
    color: $--color-success
  }

  .server-status-success-value {
    margin-left: 15px;
  }

  .setting-title {
    font-size: 20px;
    font-weight: bolder;
    color: $--color-text-primary;
    border-bottom: $color-border solid 1px;
    padding-bottom: 15px;
    margin-bottom: 7px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }

  .setting-item-dividing {
    margin-bottom: 10px;
    border-bottom: $color-border solid 1px;
  }

  .input-server-port {
    width: 80px;
    margin-left: 10px;

    /deep/ input {
      text-align: center;
    }
  }
</style>
