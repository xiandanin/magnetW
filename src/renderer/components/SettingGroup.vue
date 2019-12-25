<template>
  <div>
    <h3 class="setting-title">{{title}}</h3>
    <el-divider></el-divider>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: ['title']
  }
</script>

<style lang="scss">
  .setting-title {
    color: $color-title;
  }

  .el-divider--horizontal {
    margin: 12px 0 !important;
  }
</style>
