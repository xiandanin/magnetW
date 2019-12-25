<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  export default {}
</script>

<style lang="scss">
    /* CSS */
    .el-scrollbar {
        height: 100%;

        .el-scrollbar__wrap {
            overflow-x: hidden;
        }
    }

    .header-submenu {
        .el-menu--popup {
            min-width: 120px !important;
        }
    }
</style>
