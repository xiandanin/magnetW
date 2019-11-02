<template>
    <div class="header">
        <header-version></header-version>
        <div class="header-right">
            <span class="header-disclaimer-text">本应用开源且免费，仅用于爬虫技术交流学习，搜索结果均来自源站，亦不承担任何责任</span>
            <el-menu mode="horizontal" default-active="/" router>
                <el-menu-item index="/">首页</el-menu-item>
                <el-menu-item index="/setting">设置</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script>
  import HeaderVersion from './HeaderVersion'

  export default {
    name: 'pager-header',
    components: {
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
            align-items: center;
        }

        .el-menu {
            background-color: transparent;
            border: none !important;
        }

        .header-disclaimer-text {
            flex: 1;
            text-align: left;
            margin-right: 20px;
            color: $color-text-gray;
            font-size: 12px;
        }
    }
</style>
