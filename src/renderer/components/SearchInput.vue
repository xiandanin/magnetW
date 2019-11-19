<template>
    <div class="search-input">
        <el-input :placeholder="project.searchPlaceholder"
                  @keyup.enter.native="emitClickSearch"
                  v-model="value"
                  @change="emitInputChanged"
                  size="medium">
            <span slot="prepend">{{name}}</span>
            <el-button slot="append" icon="el-icon-search" @click="emitClickSearch">搜索</el-button>
        </el-input>
    </div>
</template>

<script>
  export default {
    props: ['name', 'keyword'],
    model: {
      prop: 'keyword',
      event: 'input'
    },
    data () {
      return {
        value: null
      }
    },
    methods: {
      emitInputChanged (value) {
        this.$emit('input', value)
      },
      emitClickSearch () {
        const value = this.value || this.project.searchPlaceholder
        this.$emit('search', value)
      }
    },
    mounted () {
    }
  }
</script>
