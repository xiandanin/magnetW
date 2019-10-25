<template>
    <div id="app">
        <el-container>
            <el-aside width="200px">
                <aside-menu></aside-menu>
            </el-aside>

            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script>
  import AsideMenu from './components/AsideMenu'

  export default {
    components: {
      AsideMenu
    },
    name: 'magnetw'
  }
</script>

<style lang="scss">
    @import 'plugins/element-variables.scss';

    /* CSS */
    .container {
        // padding: 0 $padding-container;
    }

    .title {
        font-size: 18px;
        color: $color-title;
    }
</style>

