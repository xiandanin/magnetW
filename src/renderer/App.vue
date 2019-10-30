<template>
    <div id="app">
        <el-container>
            <el-aside width="78px">
                <aside-bar></aside-bar>
            </el-aside>

            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  import AsideBar from './components/AsideBar'

  export default {
    name: 'magnetw',
    components: {
      AsideBar
    }
  }
</script>

<style lang="scss">

    /* CSS */
    .container {
        // height: 100%;
        // padding: 0 $padding-container;
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

