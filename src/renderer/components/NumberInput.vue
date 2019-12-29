<template>
  <el-input class="number-input" v-model="value" size="mini" :placeholder="placeholder">
    <span slot="append" class="number-input__append">{{append}}</span>
  </el-input>
</template>

<script>
  export default {
    props: ['value', 'placeholder', 'append'],
    methods: {}
  }
</script>

<style lang="scss">
  .number-input {
    width: auto !important;

    .el-input__inner {
      width: 80px;
      text-align: center;
    }
  }

</style>
