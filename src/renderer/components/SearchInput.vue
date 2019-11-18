<template>
    <div class="search-input">
        <el-input :placeholder="project.searchPlaceholder"
                  @keyup.enter.native="handleClickSearch"
                  v-model="input"
                  size="medium">
            <span slot="prepend">{{name}}</span>
            <el-button slot="append" icon="el-icon-search" @click="handleClickSearch">搜索</el-button>
        </el-input>
    </div>
</template>

<script>
  export default {
    props: ['name'],
    components: {},
    data () {
      return {
        input: null
      }
    },
    methods: {
      handleClickSearch () {
        const value = this.input || this.project.searchPlaceholder
        this.$emit('search', value)
      }
    },
    mounted () {
    }
  }
</script>
