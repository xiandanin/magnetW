<template>
    <el-link target="_blank" :type="type" @click="handleClickLink" :underline="underline||false">
        <slot></slot>
    </el-link>
</template>

<script>
  import {shell} from 'electron'

  export default {
    props: ['href', 'underline', 'type', 'from'],
    methods: {
      handleClickLink () {
        if (this.href) {
          const url = this.from ? this.formatURL(this.href) : this.href
          shell.openExternal(url)
        }
      },
      formatURL (url) {
        const params = 'from=mw'
        const symbol = url.indexOf('?') !== -1 ? '&' : '?'
        return url + symbol + params
      }
    }
  }
</script>

<style scoped>
    .el-link {
        font-weight: normal;
    }
</style>
