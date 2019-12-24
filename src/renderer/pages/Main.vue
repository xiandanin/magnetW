<template>
    <el-container>
        <div class="header-placeholder drag" @dblclick="handleClickMaxWindow"></div>
        <el-header class="drag">
            <pager-header :dblclick="handleClickMaxWindow"></pager-header>
        </el-header>

        <el-main class="main">
            <keep-alive>
                <router-view/>
            </keep-alive>
        </el-main>
    </el-container>
</template>

<script>
  import {ipcRenderer, remote, shell} from 'electron'
  import PagerHeader from '../components/PagerHeader'

  export default {
    components: {
      PagerHeader
    },
    data () {
      return {}
    },
    methods: {
      handleClickMaxWindow () {
        ipcRenderer.send('window-max')
      }
    },
    created () {
      /**
       * 有新版本
       */
      ipcRenderer.on('new-version', (event, data) => {
        this.$confirm(data.content, `有新版本 v${data.version}`, {
          confirmButtonText: '去更新',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true
        }).then(() => {
          shell.openExternal(data.url)
        }).catch(() => {
        })
      })
    },
    mounted () {
      // 检查更新
      // ipcRenderer.send('check-update')
    }
  }
</script>

<style lang="scss" scoped>
    .header-placeholder {
        height: 10px;
    }

    .main {
        padding: 0 !important;
        height: 100%;
    }
</style>
