<template>
    <div id="app">
        <el-container>
            <div class="header-placeholder drag" @dblclick="handleClickMaxWindow"></div>
            <el-header class="drag">
                <pager-header :dblclick="handleClickMaxWindow"></pager-header>
            </el-header>

            <el-main class="main">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  import PagerHeader from './components/PagerHeader'

  export default {
    components: {
      PagerHeader
    },
    methods: {
      handleClickMaxWindow () {
        ipcRenderer.send('window-max')
      }
    }
  }
</script>

<style lang="scss">

    /* CSS */
    .container {
        // height: 100%;
        // padding: 0 $padding-container;
    }

    .main {
        height: 100%;
        padding: 0 !important;
    }

    .header-placeholder {
        height: 15px;
    }

    .title {
        font-size: 18px;
        color: $color-title;
    }

    .highlight-name {
        color: $--color-primary;
    }

    .align-items-center {
        display: flex;
        align-items: center;
    }

    .el-checkbox {
        font-weight: normal !important;
    }

    .el-header {
        border-bottom: 1px solid $color-border;
    }

    .scroll-container {
        height: 100%;

        .el-scrollbar {
            height: 100%;
        }

        .el-scrollbar__wrap {
            overflow-x: hidden !important;
        }

        .el-scrollbar__view {
            height: auto !important;
        }
    }

    .el-link {
        font-weight: normal;
        text-decoration: underline;
    }

</style>

