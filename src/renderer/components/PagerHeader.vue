<template>
    <div class="header">
        <el-row>
            <el-col :span="6">
                <header-version></header-version>
            </el-col>
            <el-col :span="18" class="header-right">
                <el-menu mode="horizontal" router>
                    <el-menu-item index="/">首页</el-menu-item>
                    <el-menu-item index="/setting">设置</el-menu-item>
                </el-menu>
            </el-col>
        </el-row>
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
        .header-right {
            display: flex;
            justify-content: flex-end;
        }
    }
</style>
