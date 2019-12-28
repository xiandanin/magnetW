<template>
  <el-scrollbar>
    <div class="setting">
      <el-row>
        <el-col :span="12">
          <browser-link :href="$config.docURL" :button="true" size="mini">查看帮助</browser-link>
        </el-col>
        <el-col :span="12" class="server-config-action">
          <el-button :loading="loading.save" type="primary" size="mini" class="button-apply" @click="handleSaveSetting">
            应用
          </el-button>
          <el-button size="mini" type="info" plain @click="handleResetConfig">重置</el-button>
        </el-col>
      </el-row>
      <server-config v-if="config"
                     ref="settingInfo"
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
        this.$refs.settingInfo.$refs.settingForm.validate((valid) => {
          if (valid) {
            this.loading.save = true
            ipcRenderer.send('save-server-config', this.config)
          }
        })
      },
      handleResetConfig () {
        this.config = ipcRenderer.sendSync('get-default-server-config')
      }
    },
    created () {
      // 保存配置的监听 - 保存后的配置对象,异常对象,是否通知重载
      ipcRenderer.on('on-save-server-config', (event, config, oldConfig, err) => {
        this.loading.save = false
        this.config = config
        if (err) {
          this.$message({message: err, type: 'error'})
        } else {
          this.$resethttp()
          this.$message({message: '保存成功', type: 'success', duration: 1000})
          this.$emit('global:event-config-refreshed', config, oldConfig)
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

  .button-apply {
    min-width: 80px;
  }
</style>
