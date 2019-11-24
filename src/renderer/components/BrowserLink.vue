<template>
    <el-button v-if="button" :type="type" @click="handleClickLink" :size="size">
        <slot></slot>
    </el-button>
    <el-link v-else target="_blank" :type="type" @click="handleClickLink" :underline="underline||false">
        <slot></slot>
    </el-link>
</template>

<script>
  import {shell} from 'electron'
  import mixin from '../mixins/mixin'

  export default {
    props: ['href', 'underline', 'type', 'button', 'size'],
    mixins: [mixin],
    methods: {
      handleClickLink () {
        if (this.href) {
          const url = this.formatURL(this.href)
          shell.openExternal(url)
        }
      }
    }
  }
</script>

<style scoped>
    .el-link {
        font-weight: normal;
        vertical-align: baseline;
    }
</style>
