<template>
    <el-row class="setting-content">
        <el-col :span="4">
            <span class="setting-label">{{label}}</span></el-col>
        <el-col :span="20">
            <slot></slot>
        </el-col>
    </el-row>
</template>

<script>
  export default {
    props: ['label']
  }
</script>

<style lang="scss">
    .setting-label {
        color: $color-title;
    }
</style>
