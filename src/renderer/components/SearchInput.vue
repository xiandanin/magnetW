<template>
  <div class="search-input">
    <el-input :placeholder="placeholder"
              @keyup.enter.native="emitClickSearch"
              v-model="value"
              clearable
              size="small">
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
        const keyword = this.value || this.placeholder
        const query = {}
        Object.assign(query, this.$router.query)
        query.k = keyword
        this.$router.push({path: 'index', query})
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
