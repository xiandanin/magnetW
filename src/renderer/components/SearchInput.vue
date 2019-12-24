<template>
  <div class="search-input">
    <el-input :placeholder="placeholder"
              @keyup.enter.native="emitClickSearch"
              v-model="value"
              clearable
              size="medium">
      <span slot="prepend">{{name||'请选择源站'}}</span>
      <el-button slot="append" icon="el-icon-search" @click="emitClickSearch">搜索</el-button>
    </el-input>
  </div>
</template>

<script>
  export default {
    props: ['name', 'keyword'],
    data () {
      return {
        value: null,
        placeholder: null
      }
    },
    watch: {
      keyword (val) {
        this.value = val
      }
    },
    methods: {
      emitClickSearch () {
        this.$emit('search', this.value || this.placeholder)
      }
    },
    created () {
      this.placeholder = this.$config.searchPlaceholder[Math.floor(Math.random() * this.$config.searchPlaceholder.length)]
      this.value = this.keyword
    },
    mounted () {
    }
  }
</script>
