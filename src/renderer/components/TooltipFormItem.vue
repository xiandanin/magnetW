<template>
  <el-form-item :prop="prop">
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
    props: ['label', 'tooltip', 'prop'],
    data () {
      return {}
    },
    methods: {},
    created () {
    }
  }
</script>

<style scoped lang="scss">
</style>
