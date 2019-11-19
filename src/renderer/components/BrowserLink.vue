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

  export default {
    props: ['href', 'underline', 'type', 'button', 'size', 'from'],
    methods: {
      handleClickLink () {
        console.log(this.href)
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
        vertical-align: baseline;
    }
</style>
