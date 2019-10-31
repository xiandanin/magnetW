<template>
    <div id="app">
        <el-container>
            <el-header class="drag">
                <pager-header></pager-header>
            </el-header>

            <el-main class="main">
                <router-view></router-view>
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

    .title {
        font-size: 18px;
        color: $color-title;
    }

    .highlight-name {
        color: $--color-primary;
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

