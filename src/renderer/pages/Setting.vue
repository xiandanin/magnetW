<template>
    <div class="scroll-container">
        <el-scrollbar>
            <div class="container">
                <div class="setting-button-container">
                    <el-button type="primary" size="mini" @click="handleSaveSetting">保存</el-button>
                    <el-button size="mini" @click="handleResetSetting">重置</el-button>
                </div>

                <el-form label-width="130px" label-position="left">
                    <setting-group title="规则">
                        <setting-item label="源站列表URL" tooltip="源站解析规则文件URL，支持网络链接和本地路径">
                            <el-input v-model="localSetting.ruleUrl" size="mini"
                                      :placeholder="defaultSetting.ruleUrl">
                            </el-input>
                            <div>
                                <el-checkbox v-model="localSetting.rememberLastRule" label="记住上次使用的源站"></el-checkbox>
                                <el-checkbox v-model="localSetting.showProxyRule" label="显示需要代理的源站"></el-checkbox>
                            </div>
                        </setting-item>
                    </setting-group>

                    <setting-group title="优化">
                        <setting-item label="预加载">
                            <el-checkbox v-model="localSetting.preload" label="启用"></el-checkbox>
                        </setting-item>
                        <!--<setting-item label="Tracker服务器" tooltip="开启后会在复制链接时拼接Tracker列表">
                            <el-checkbox v-model="localSetting.trackers" label="启用">
                            </el-checkbox>
                            <el-input v-model="localSetting.trackersUrl"
                                      :placeholder="defaultSetting.trackersUrl"
                                      size="mini">
                                <template slot="prepend">列表URL</template>
                            </el-input>
                        </setting-item>-->
                    </setting-group>

                    <setting-group title="缓存">
                        <setting-item label="过期时间">
                            <el-input class="number-input" v-model="localSetting.cacheExpired" size="mini" type="number"
                                      :placeholder="defaultSetting.cacheExpired">
                                <span slot="append" class="number-input__append">秒</span>
                            </el-input>
                        </setting-item>
                        <setting-item label="管理缓存">
                            <el-button size="mini" @click="handleClearCache">清空</el-button>
                        </setting-item>
                    </setting-group>

                    <setting-group title="请求">
                        <setting-item label="自定义UserAgent">
                            <el-checkbox v-model="localSetting.customUserAgent" label="启用">
                            </el-checkbox>
                            <el-input v-show="localSetting.customUserAgent" type="textarea"
                                      v-model="localSetting.customUserAgentValue" placeholder="自定义UserAgent"
                                      size="small">
                            </el-input>
                        </setting-item>
                        <setting-item label="代理">
                            <el-checkbox v-model="localSetting.proxy" label="启用">
                            </el-checkbox>
                            <span class="setting-item-proxy">
                        <el-input class="setting-item-proxy-host" v-model="localSetting.proxyHost" size="mini"
                                  :placeholder="defaultSetting.proxyHost">
                        </el-input>
                        <span class="setting-proxy-line">:</span>
                        <el-input class="setting-item-proxy-port" v-model="localSetting.proxyPort" size="mini"
                                  :placeholder="defaultSetting.proxyPort">
                        </el-input>
                    </span>
                        </setting-item>
                    </setting-group>

                    <setting-group v-if="appInfo" title="日志">
                        <setting-item label="保存路径">
                            <el-input v-model="appInfo.logDir" disabled size="mini">
                                <el-button slot="append" icon="el-icon-folder-opened"
                                           @click="handleOpenDir(appInfo.logDir)"></el-button>
                            </el-input>
                        </setting-item>
                    </setting-group>
                </el-form>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
  import {ipcRenderer, shell} from 'electron'
  import SettingGroup from '../components/SettingGroup'
  import SettingItem from '../components/SettingItem'
  import NumberInput from '../components/NumberInput'

  export default {
    components: {
      SettingGroup, SettingItem, NumberInput
    },
    data () {
      return {
        defaultSetting: null,
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
        ipcRenderer.send('apply-setting', this.localSetting)
        this.$message({
          message: '保存成功',
          type: 'success'
        })
      },
      handleResetSetting () {
        this.localSetting = this.deepCopy(this.defaultSetting)
      },
      handleClearCache () {
        ipcRenderer.send('clear-cache')
        this.$message({
          message: '清除完成',
          type: 'success'
        })
      },
      handleOpenDir (path) {
        shell.showItemInFolder(path)
      }
    },
    created () {
      this.registerRendererListener()
      ipcRenderer.send('get-app-info')
      this.defaultSetting = this.deepCopy(this.global.settings.defaultSetting)
      this.localSetting = this.deepCopy(this.global.settings.localSetting)
    }
  }
</script>

<style lang="scss">

    .container {
        font-size: 14px;
        padding: 20px 40px 40px 40px;
    }

    .setting-button-container {
        z-index: 100;
        position: absolute;
        right: 0;
        margin-right: 40px;
    }

    .number-input {
        width: auto !important;

        .el-input__inner {
            width: 80px;
            text-align: center;
        }
    }

    .setting-item-proxy {
        margin-left: 20px;

        input {
            text-align: center;
        }

        .setting-item-proxy-host {
            width: 100px !important;
        }

        .setting-item-proxy-port {
            width: 70px !important;
        }
    }


</style>
