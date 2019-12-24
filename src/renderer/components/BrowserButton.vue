<template>
  <el-button :size="size" :icon='icon' :type="type" :plain='plain' @click="handleClickButton">
    <slot></slot>
  </el-button>
</template>

<script>
  export default {
    props: {
      'href': String,
      'type': String,
      'size': String,
      'icon': String,
      'plain': Boolean
    },
    methods: {
      handleClickButton (e) {
        if (this.href) {
          window.open(this.href)
        } else {
          this.$emit('click')
        }
      }
    }
  }
</script>

<style scoped>
</style>
