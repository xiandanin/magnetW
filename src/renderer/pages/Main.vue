<template>
  <el-container>
    <div class="header-placeholder drag" @dblclick="handleClickMaxWindow"></div>
    <el-header class="drag">
      <pager-header :dblclick="handleClickMaxWindow" :select="handleSelectMenu">
        <!--搜索框与排序菜单-->
        <search-input slot="center" class="no-drag" @search="handleSearch"></search-input>
      </pager-header>
    </el-header>

    <el-main class="main">
      <transition name="el-fade-in">
        <index class="main-child" v-show="indexActivated" ref="index"></index>
      </transition>
      <transition name="el-fade-in">
        <setting class="main-child" v-show="settingActivated"></setting>
      </transition>
    </el-main>
    <github-badge></github-badge>
  </el-container>
</template>

<script>
  import {ipcRenderer, shell} from 'electron'
  import PagerHeader from '../components/PagerHeader'
  import SearchInput from '../components/SearchInput'
  import GithubBadge from '../components/GithubBadge'
  import Index from '../pages/Index'
  import Setting from './Setting'

  export default {
    components: {
      PagerHeader, SearchInput, GithubBadge, Index, Setting
    },
    data () {
      return {
        active: 'index'
      }
    },
    computed: {
      indexActivated () {
        return this.active === 'index'
      },
      settingActivated () {
        return this.active === 'setting'
      }
    },
    methods: {
      handleClickMaxWindow () {
        ipcRenderer.send('window-max')
      },
      handleSelectMenu (index) {
        if (index === 'index' || index === 'setting') {
          this.active = index
        }
      },
      handleSearch (keyword) {
        this.$refs.index.handleClickSearch(keyword)
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
      ipcRenderer.send('check-update')
    }
  }
</script>

<style lang="scss" scoped>
  .header-placeholder {
    height: 10px;
  }

  .main {
    background-color: white;
    padding: 0 !important;
    height: 100%;
    position: relative;
  }

  .el-header {
    border-bottom: 1px solid $color-border;
  }

  .main-child {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .pager-header-input {
    padding-left: 30px;
    padding-right: 30px;
    max-width: 500px;
    margin: auto;
  }

  .search-input {
    margin-left: 15%;
    margin-right: 15%;
    width: 100%;
  }

  .el-fade-in-enter-active, .el-fade-in-leave-active {
    transition-duration: 0.2s;
  }

</style>
