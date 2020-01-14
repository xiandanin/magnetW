<template>
  <div class="guide-page">
    <el-alert
      class="guide-page-alert"
      v-show="title"
      :type="type"
      :closable="false"
      :description="message"
      show-icon>
      <span slot="title">{{title}}</span>
    </el-alert>
    <div class="guide-page-content">
      <div class="guide-page-log" v-if="serverInfo">
        <div>搜索服务已启动，启动模式：{{serverInfo.customServerPort?'自定义':'自动分配'}}，<span class="guide-page-log-success">{{serverInfo.local}}:{{serverInfo.port}}</span>
        </div>
        <div v-if="serverInfo.proxy">
          代理已启用：<span class="guide-page-log-success">{{serverInfo.proxyType}}://{{serverInfo.proxyHost}}:{{serverInfo.proxyPort}}</span>，请在设置中“测试连接”检查代理是否可用
        </div>
        <div v-if="serverInfo.filterBare||serverInfo.filterEmpty">内容过滤已启用</div>
        <div v-show="serverInfo.message" class="guide-page-log-error">{{serverInfo.message}}</div>
      </div>
      <div v-for="it in $config.guide.content" class="guide-content">
        <span class="guide-title">{{it.title}}</span>
        <div class="guide-content-item" v-for="item in it.items">
          <browser-link v-if="item.link" :href="item.link" type="primary">{{item.text}}</browser-link>
          <span v-else class="guide-content-item-text">{{item.text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import BrowserLink from './BrowserLink'
  import {ipcRenderer} from 'electron'

  export default {
    props: ['message', 'type', 'title'],
    components: {
      BrowserLink
    },
    data () {
      return {
        serverInfo: null
      }
    },
    computed: {},
    methods: {},
    created () {
      // 接收设置刷新的通知
      this.$on('global:event-config-refreshed', (config, oldConfig) => {
        ipcRenderer.send('get-server-info')
      })
      ipcRenderer.on('on-get-server-info', (event, serverInfo, config) => {
        if (serverInfo) {
          const info = {}
          Object.assign(info, serverInfo, config)
          this.serverInfo = info
        } else {
          this.serverInfo = {message: '搜索服务启动失败，请查看日志'}
        }
      })
      ipcRenderer.send('get-server-info')
    }
  }
</script>

<style scoped lang="scss">

  .guide-page {
    margin-top: 70px;
    padding: 0 20px 20px 20px;
    position: absolute;
    z-index: 2000;
    left: 0;
    right: 0;
  }

  .guide-page-alert {
    min-height: 36px;
  }

  .guide-page-content {
    position: absolute;
    top: 0;
    margin-top: 60px;
  }

  .guide-content {
    margin: 10px 0 20px 0;
  }

  .guide-title {
    display: block;
    font-size: 1.3em;
    margin: 10px 0;
    font-weight: bold;
    color: $--color-text-primary;
  }

  .guide-content-item {
    margin-bottom: 5px;
    margin-left: 20px;
    font-size: 16px;

    .el-link {
      font-size: 16px;
    }
  }

  .guide-content-item-text {
    margin-right: 10px;
  }

  .footerText {
    color: $color-text-gray;
    font-size: $font-size;
  }

  .guide-page-log {
    color: $--color-text-primary;
    line-height: 300%;
  }

  .guide-page-log-success {
    color: $--color-success;
  }

  .guide-page-log-error {
    color: $--color-danger;
  }
</style>
