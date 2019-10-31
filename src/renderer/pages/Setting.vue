<template>
    <div class="container">
        <div class="setting-button-container">
            <el-button type="primary" size="mini" @click="handleSaveSetting">保存</el-button>
            <el-button size="mini" @click="handleResetSetting">重置</el-button>
        </div>

        <setting-title title="规则"></setting-title>

        <setting-content label="源站列表 URL">
            <el-input v-model="localSetting.rule.url" size="mini"
                      :placeholder="global.settings.defaultSetting.rule.url">
            </el-input>
            <div class="setting-desc">*源站列表规则的URL，支持在线文件和本地文件</div>
        </setting-content>


        <setting-title title="优化"></setting-title>

        <setting-content label="预加载">
            <el-checkbox v-model="localSetting.optimization.preload.source" label="预加载未访问的源站"></el-checkbox>
            <el-checkbox v-model="localSetting.optimization.preload.page" label="预加载后续的页码"></el-checkbox>
        </setting-content>
        <setting-content label="Tracker服务器" class="setting-content-append">
            <div>
                <el-checkbox v-model="localSetting.optimization.trackers.enabled" label="启用">
                </el-checkbox>
                <span class="setting-desc">*开启后会在复制链接时拼接Tracker列表</span>
            </div>
            <div class="setting-content-tracker">
                <el-row>
                    <el-col :span="3">列表 URL</el-col>
                    <el-col :span="21">
                        <el-input v-model="localSetting.optimization.trackers.url"
                                  :placeholder="global.settings.defaultSetting.optimization.trackers.url"
                                  size="mini"></el-input>
                    </el-col>
                </el-row>
            </div>
        </setting-content>


        <setting-title title="缓存"></setting-title>
        <setting-content label="过期时间">
            <el-input class="number-input" v-model="localSetting.cache.expired" size="mini" type="number"
                      :placeholder="global.settings.defaultSetting.cache.expired">
                <span slot="append" class="number-input__append">秒</span>
            </el-input>
        </setting-content>

        <setting-title title="请求"></setting-title>
        <setting-content label="自定义UserAgent">
            <el-checkbox v-model="localSetting.request.customUserAgent.enabled" label="启用">
            </el-checkbox>
            <div class="setting-content-useragent" v-show="localSetting.request.customUserAgent.enabled">
                <el-input type="textarea" v-model="localSetting.request.customUserAgent.userAgent" size="small">
                </el-input>
            </div>
        </setting-content>
        <setting-content label="代理" class="setting-content-append setting-proxy align-items-center">
            <el-row class="align-items-center">
                <el-col :span="3">
                    <el-checkbox v-model="localSetting.proxy.enabled" label="启用">
                    </el-checkbox>
                </el-col>
                <el-col :span="5">
                    <el-input v-model="localSetting.proxy.host" size="mini"
                              :placeholder="global.settings.defaultSetting.proxy.host">
                    </el-input>
                </el-col>
                <el-col :span="1" class="setting-proxy-line">:</el-col>
                <el-col :span="3">
                    <el-input v-model="localSetting.proxy.port" size="mini"
                              :placeholder="global.settings.defaultSetting.proxy.port">
                    </el-input>
                </el-col>
            </el-row>
        </setting-content>

        <div v-if="appInfo">
            <setting-title title="日志"></setting-title>
            <setting-content label="保存路径" class="align-items-center">
                <el-input v-model="appInfo.logDir" disabled size="mini">
                    <el-button slot="append" icon="el-icon-folder-opened"
                               @click="handleOpenDir(appInfo.logDir)"></el-button>
                </el-input>
            </setting-content>
        </div>
    </div>
</template>

<script>
  import {ipcRenderer, shell} from 'electron'
  import SettingTitle from '../components/SettingTitle'
  import SettingContent from '../components/SettingContent'
  import NumberInput from '../components/NumberInput'

  export default {
    components: {
      SettingTitle, SettingContent, NumberInput
    },
    data () {
      return {
        localSetting: null,
        appInfo: null
      }
    },
    methods: {
      registerRendererListener () {
        ipcRenderer.on('on-get-app-info', (event, info) => {
          this.appInfo = info
        })
      },
      handleSaveSetting () {
        this.global.settings.saveSetting(this.localSetting)
      },
      handleResetSetting () {
        this.localSetting = this.copyObject(this.global.settings.defaultSetting)
      },
      handleOpenDir (path) {
        shell.showItemInFolder(path)
      }
    },
    created () {
      this.registerRendererListener()
      ipcRenderer.send('get-app-info')
      this.localSetting = this.global.settings.localSetting
    }
  }
</script>

<style lang="scss">

    .container {
        font-size: 14px;
        padding: 20px;
    }

    .setting-button-container {
        z-index: 100;
        position: absolute;
        right: 0;
        margin-right: 20px;
    }

    .btn-rule-pull {
        margin-left: 10px !important;
    }

    .setting-content {
        color: $color-sub-title;
    }

    .setting-desc {
        margin-top: 8px;
        font-size: 12px;
        color: $color-text-gray;
    }

    .el-checkbox {
        font-weight: normal !important;
    }

    .number-input {
        width: auto !important;

        .el-input__inner {
            width: 80px;
            text-align: center;
        }
    }

    .setting-content-append {
        margin-top: 15px;
    }

    .align-items-center {
        display: flex;
        align-items: center;
    }

    .setting-proxy {

        .el-input {
            input {
                text-align: center;
            }
        }

        .setting-proxy-line {
            text-align: center;
        }
    }

    .setting-content-useragent {
        margin-top: 15px;
    }

    .setting-content-tracker {
        margin-top: 15px;

        .el-row {
            display: flex;
            align-items: center;
        }
    }
</style>
