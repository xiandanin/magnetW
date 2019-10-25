<template>
    <div class="container">
        <el-input placeholder="请输入关键词" v-model="current.keyword" size="small">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
        <div>{{global.active}}</div>
    </div>
</template>

<script>
  import {ipcRenderer} from 'electron'

  export default {
    data () {
      return {
        current: {
          keyword: ''
        },
        sourceList: []
      }
    },
    methods: {
      handleAllSource (list) {

      },
      handleSearch () {
        console.log('搜索', this.current)
        this.current.id = this.global.active.id
        ipcRenderer.send('search', this.current)
      }
    },
    mounted () {
      console.log(this.global)
    }
  }
</script>

<style lang="scss">


</style>
