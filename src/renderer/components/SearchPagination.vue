<template>
  <!--页码-->
  <el-pagination
    @current-change="emitPageChanged"
    :current-page="page"
    background
    layout="prev, pager, next"
    :pager-count="5"
    :page-count="50">
  </el-pagination>
</template>

<script>
  export default {
    props: {
      page: Number
    },
    components: {},
    methods: {
      emitPageChanged (page) {
        this.$emit('change', page)
      }
    },
    created () {
    }
  }
</script>

<style lang="scss" scoped>

  .el-pagination {
    padding-right: 0 !important;

    /deep/ .number:last-child {
      display: none;
    }

    /deep/ .btn-next {
      margin-right: 0 !important;
    }
  }

</style>
