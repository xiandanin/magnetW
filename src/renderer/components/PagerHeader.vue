<template>
    <div class="header" @dblclick="dblclick">
        <header-version></header-version>
        <div class="header-right">
            <span class="header-disclaimer-text">本应用开源且免费，仅用于爬虫技术交流学习，搜索结果均来自源站，亦不承担任何责任</span>
            <el-menu mode="horizontal" default-active="/" router>
                <el-menu-item index="/">首页</el-menu-item>
                <el-menu-item index="/setting">设置</el-menu-item>
                <el-submenu index="doc">
                    <browser-link slot="title" href="http://magnetw.github.io" :underline="false">文档</browser-link>
                    <el-menu-item>
                        <browser-link href="http://magnetw.github.io" :underline="false">文档1</browser-link>
                    </el-menu-item>
                    <el-menu-item>
                        <browser-link href="http://magnetw.github.io" :underline="false">文档2</browser-link>
                    </el-menu-item>
                    <el-menu-item>
                        <browser-link href="http://magnetw.github.io" :underline="false">文档3</browser-link>
                    </el-menu-item>
                </el-submenu>
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
    }
</style>
