<template>
  <el-scrollbar>
    <div class="setting">
      <el-row>
        <el-col :span="12">
          <browser-link :href="$config.docURL" :button="true" size="mini">查看帮助</browser-link>
        </el-col>
        <el-col :span="12" class="server-config-action">
          <el-button :loading="loading.save" type="primary" size="mini" @click="handleSaveSetting">保存</el-button>
          <el-button size="mini" type="info" plain @click="handleResetConfig">重置</el-button>
        </el-col>
      </el-row>
      <server-config v-if="config"
                     :config="config"></server-config>
    </div>
  </el-scrollbar>
</template>

<script>
  import {ipcRenderer, remote, shell} from 'electron'
  import ServerConfig from '../components/ServerConfig'
  import BrowserLink from '../components/BrowserLink'

  export default {
    components: {BrowserLink, ServerConfig},
    data () {
      return {
        config: null,
        loading: {
          full: false,
          save: false
        }
      }
    },
    methods: {
      handleSaveSetting () {
        let message = null
        if (this.config.cloudUrl && !this.config.cloudUrl.startsWith('http')) {
          message = '请输入正确的云解析地址'
        } else if (!/^[1-9]\d*$/.test(this.config.cacheExpired)) {
          message = '请输入正确的缓存时间'
        } else if (!/^[1-9]\d*$/.test(this.config.proxyPort)) {
          message = '请输入正确的代理端口'
        } else if (this.config.customUserAgent && /[\u4e00-\u9fa5]|.*magnet.*|.*magnetw.*|.*mwbrowser.*|.*magnetx.*|.*mwspider.*/.test(this.config.customUserAgentValue)) {
          message = '请输入正确的UserAgent'
        }
        if (message) {
          this.$message({message: message, type: 'error'})
        } else {
          this.loading.save = true
          ipcRenderer.send('save-server-config', this.config)
        }
      },
      handleResetConfig () {
        this.config = ipcRenderer.sendSync('get-default-server-config')
      }
    },
    created () {
      // 保存配置的监听
      ipcRenderer.on('on-save-server-config', (event, config, err) => {
        this.loading.save = false
        this.config = config
        if (err) {
          this.$message({message: err, type: 'error'})
        } else {
          this.$resethttp()
          this.$message({message: '保存成功', type: 'success', duration: 1000})
        }
      })

      // 获取服务配置
      this.config = ipcRenderer.sendSync('get-server-config')
    }
  }
</script>

<style lang="scss" scoped>
  .setting {
    padding: 20px 40px 40px 40px;
  }

  .server-config-action {
    margin-bottom: 20px;
    text-align: right;
  }
</style>
