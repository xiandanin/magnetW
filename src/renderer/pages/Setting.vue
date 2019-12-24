<template>
    <el-scrollbar>
        <div class="setting">
            <div class="server-config-action">
                <el-button :loading="loading.save" type="primary" size="mini" @click="handleSaveSetting">保存</el-button>
                <el-button size="mini" type="info" plain @click="handleResetConfig">重置</el-button>
            </div>
            <server-config v-if="config"
                           :config="config"></server-config>
        </div>
    </el-scrollbar>
</template>

<script>
  import {ipcRenderer, remote, shell} from 'electron'
  import ServerConfig from '../components/ServerConfig'

  export default {
    components: {ServerConfig},
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
        this.loading.save = true
        ipcRenderer.send('save-server-config', this.config)
      },
      handleResetConfig () {
        this.config = ipcRenderer.sendSync('get-default-server-config')
      }
    },
    created () {
      // 加载配置信息的监听
      ipcRenderer.on('on-server-config', (event, config) => {
        this.loading.full = false
        this.config = config
      })

      // 保存配置的监听
      ipcRenderer.on('on-save-server-config', (event, config, err) => {
        this.loading.save = false
        this.config = config
        if (err) {
          this.$message({message: err, type: 'error'})
        } else {
          this.$message({message: '保存成功', type: 'success'})
        }
      })

      // 获取服务配置
      this.loading.full = true
      ipcRenderer.send('get-server-config')
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
