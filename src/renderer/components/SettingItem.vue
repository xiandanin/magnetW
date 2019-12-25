<template>
  <el-form-item>
    <div slot="label" class="setting-item-label">
      <span>{{label}}</span>
      <el-tooltip v-if="tooltip" effect="light" :content="tooltip" placement="bottom">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </div>
    <slot></slot>
  </el-form-item>
</template>

<script>
  export default {
    props: ['label', 'tooltip']
  }
</script>

<style lang="scss">

  .setting-item-label {
    color: $color-title;
  }

  .el-form-item {
    margin-bottom: 0 !important;
  }

  .el-form-item__content .el-input-group {
    vertical-align: middle !important;
  }
</style>
