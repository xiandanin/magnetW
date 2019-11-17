<template>
    <div>
        <span>{{name}}</span>
        <el-button size="medium">去源站</el-button>
        <el-input :placeholder="project.searchPlaceholder"
                  @keyup.enter.native="handleClickSearch"
                  size="medium">
            <span slot="prepend">{{name}}</span>
            <el-button slot="append" icon="el-icon-search" @click="handleClickSearch">搜索</el-button>
        </el-input>
    </div>
</template>

<script>
  export default {
    props: ['name'],
    methods: {
      handleClickSearch (value) {
        this.$emit('search', value)
      }
    },
    mounted () {
    }
  }
</script>

<style lang="scss">

</style>
