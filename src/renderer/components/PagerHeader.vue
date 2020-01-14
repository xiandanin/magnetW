<template>
  <div class="pager-header">
    <div class="header-left" @dblclick="dblclick">
      <header-version></header-version>
    </div>
    <div class="header-center">
      <div class="header-center-placeholder" @dblclick="dblclick"></div>
      <slot name="center"></slot>
    </div>
    <div class="header-right">
      <el-menu mode="horizontal" default-active="index" @select="select">
        <el-menu-item index="index">首页</el-menu-item>
        <el-menu-item index="setting">设置</el-menu-item>
        <template v-for="menuItem in $config.menu">
          <el-submenu v-if="menuItem.submenu" :index="menuItem.index" popper-class="header-submenu"
                      :key="menuItem.index">
            <template slot="title">{{menuItem.text}}</template>
            <el-menu-item v-for="subItem in menuItem.submenu" :key="subItem.link">
              <browser-link :href="subItem.link" :underline="false">{{subItem.text}}</browser-link>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="menuItem.index" :key="menuItem.index">
            <browser-link :href="menuItem.link" :underline="false">{{menuItem.text}}</browser-link>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </div>
</template>

<script>
  import HeaderVersion from './HeaderVersion'
  import BrowserLink from './BrowserLink'

  export default {
    props: ['dblclick', 'select'],
    components: {
      BrowserLink,
      HeaderVersion
    },
    data () {
      return {
        defaultActive: 'index'
      }
    },
    created () {
      const menus = this.$config.menu
      if (menus && menus.length > 0) {
        this.defaultActive = menus[0].index
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pager-header {
    display: flex;

    .header-right, .el-menu, .el-menu .el-submenu, /deep/ .el-menu .el-submenu__title, .el-menu .el-link {
      height: 100%;
    }

    .header-right {
      margin-left: auto;
      z-index: 1000;
    }

    .el-menu {
      background-color: transparent;
      border: none !important;
    }

    /deep/ .el-menu-item {
      background-color: transparent !important;
    }

    .header-left {
      display: flex;
    }

    .header-center {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;

      .pager-header-input {
        width: 100%;
      }

      .header-center-placeholder {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      }
    }
  }

</style>
