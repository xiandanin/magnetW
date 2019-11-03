<template>
    <el-link target="_blank" @click="handleClickLink" :underline="underline">
        <slot></slot>
    </el-link>
</template>

<script>
  import {shell} from 'electron'

  export default {
    props: ['href', 'underline'],
    methods: {
      handleClickLink () {
        shell.openExternal(this.href)
      }
    }
  }
</script>

<style scoped>
    .el-link {
        font-weight: normal;
    }
</style>
