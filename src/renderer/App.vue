<template>
    <div id="app">
        <div class="header-placeholder"></div>
        <el-container>
            <el-header class="drag">
                <pager-header></pager-header>
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
  import PagerHeader from './components/PagerHeader'

  export default {
    name: 'magnetw',
    components: {
      PagerHeader
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

    .header-placeholder{
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

    .el-header{
        border-bottom: 1px solid $color-border;
    }

    .el-aside {
        .el-scrollbar {
            height: 100%;
        }

        .el-scrollbar__wrap {
            overflow-x: hidden !important;
        }
    }

    .el-link {
        font-weight: normal;
        text-decoration: underline;
    }

</style>

