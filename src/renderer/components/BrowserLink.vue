<template>
  <el-link :type="type"
           :target="target||'_blank'"
           :underline="underline||false"
           :icon="icon"
           :class="linkClass"
           @click="handleClickLink">
    <slot></slot>
  </el-link>
</template>

<script>
  import {shell} from 'electron'

  export default {
    props: {
      'href': String,
      'underline': Boolean,
      'type': String,
      'button': Boolean,
      'size': String,
      'target': String,
      'icon': String
    },
    computed: {
      linkClass () {
        const linkClass = this.href ? 'browser-link' : 'browser-link browser-link-empty'
        return this.button ? `el-button el-button--default el-button--${this.size} browser-link-button` : linkClass
      }
    },
    methods: {
      handleClickLink () {
        if (this.href) {
          shell.openExternal(this.href)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .browser-link {
    font-size: inherit;
    font-weight: normal;
  }

  .browser-link-button {
    vertical-align: baseline;
  }

  .browser-link-empty, .browser-link-empty:hover {
    color: $--color-text-primary !important;
    cursor: inherit;
  }
</style>
