<template>
    <div class="config">
        <el-form ref="form" label-width="auto" label-position="left">
            <tooltip-form-item label="云引擎URL" tooltip="使用服务器中转请求">
                <el-input :size="formSize" v-model="config.cloudUrl" :placeholder="defaultConfig.cloudUrl"></el-input>
            </tooltip-form-item>
            <tooltip-form-item label="规则同步URL" tooltip="源站解析规则文件URL，支持网络链接和本地路径">
                <el-input :size="formSize" v-model="config.ruleUrl" :placeholder="defaultConfig.ruleUrl"></el-input>
            </tooltip-form-item>
            <el-form-item label="显示所有源站">
                <el-switch v-model="config.showProxyRule"></el-switch>
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
            <el-form-item label="自定义UserAgent">
                <el-switch v-model="config.customUserAgent"></el-switch>
                <el-input v-show="config.customUserAgent" type="textarea"
                          v-model="config.customUserAgentValue" placeholder="自定义UserAgent"
                          :size="formSize"></el-input>
            </el-form-item>
            <!--<el-form-item label="日志" class="form-input-center">
              <el-input disabled :size="formSize">
                <el-button slot="append" icon="el-icon-folder-opened"></el-button>
              </el-input>
            </el-form-item>-->
        </el-form>
    </div>
</template>

<script>
  import TooltipFormItem from './TooltipFormItem'
  import {ipcRenderer} from 'electron'

  export default {
    components: {TooltipFormItem},
    props: {
      config: Object
    },
    data () {
      return {
        formSize: 'mini',
        defaultConfig: ipcRenderer.sendSync('get-default-server-config')
      }
    },
    methods: {},
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
