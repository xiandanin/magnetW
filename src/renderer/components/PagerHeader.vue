<template>
    <div class="header" @dblclick="dblclick">
        <header-version></header-version>
        <div class="header-right">
            <span class="header-disclaimer-text">{{project.headerText}}</span>
            <el-menu mode="horizontal" default-active="/" router>
                <el-menu-item index="/">首页</el-menu-item>
                <el-menu-item index="/setting">设置</el-menu-item>

                <template v-for="menuItem in project.menu">
                    <el-submenu v-if="menuItem.submenu" :index="menuItem.index">
                        <browser-link slot="title" :href="menuItem.link" :underline="false">{{menuItem.text}}
                        </browser-link>
                        <el-menu-item v-for="subItem in menuItem.submenu">
                            <browser-link :href="subItem.link" :underline="false">{{subItem.text}}</browser-link>
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item v-else :index="menuItem.index">
                        <browser-link :href="menuItem.link" :underline="false">{{menuItem.text}}
                        </browser-link>
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
    props: ['dblclick'],
    components: {
      BrowserLink,
      HeaderVersion
    }
  }
</script>

<style lang="scss">
    .header {
        display: flex;

        .header-right {
            display: flex;
            flex: 1;
            align-items: flex-end;
        }

        .el-menu {
            background-color: transparent;
            border: none !important;
        }

        .header-disclaimer-text {
            flex: 1;
            margin-bottom: 10px;
            text-align: left;
            margin-right: 20px;
            color: $color-text-gray;
            font-size: 12px;
        }

        .el-link {
            vertical-align: baseline !important;
        }
    }
</style>
