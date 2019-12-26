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
      },
      '$route.query.k' (to, from) {
        if (to) {
          this.value = to
        }
      }
    },
    methods: {
      emitClickSearch () {
        const query = {}
        Object.assign(query, this.$router.query)
        query.k = this.value || this.placeholder
        this.$router.push({path: '/', query})
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
