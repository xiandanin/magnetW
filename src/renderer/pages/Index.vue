<template>
    <div class="container">
        <el-input placeholder="请输入关键词" v-model="page.current.keyword" size="small">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
        </el-input>
        <div>
            <el-table
                    border
                    :data="page.items"
                    style="width: 100%">
                <el-table-column
                        label="名称">
                    <template slot-scope="scope">
                        <div>
                            <el-tag size="small" v-if="scope.row.resolution"
                                    :type="getResolutionTagType(scope.row.resolution)">
                                {{scope.row.resolution}}
                            </el-tag>
                            <div v-html="highlight(page.current.keyword, scope.row.name, 'highlight-name')"></div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="大小"
                        width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.size| size}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="人气"
                        width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.hot}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="时间"
                        width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.date| date}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
  import {ipcRenderer} from 'electron'

  export default {
    data () {
      return {
        page: {
          current: {
            keyword: null
          }
        },
        sourceList: []

      }
    },
    methods: {
      registerRendererListener () {
        ipcRenderer.on('on-search-response', (event, rsp) => {
          console.log(rsp)
          if (rsp.success) {
            this.page = rsp.data
          }
        })
      },
      getResolutionTagType (resolution) {
        if (resolution) {
          const regx = {
            '4K': 'primary',
            '2K': 'danger',
            '1080P': 'success'
          }
          for (let key in regx) {
            if (new RegExp(key, 'i').test(resolution)) {
              return regx[key]
            }
          }
          return 'info'
        }
      },
      handleAllSource (list) {

      },
      handleSearch () {
        console.log('搜索', this.page.current)
        this.page.current.id = this.global.active.id
        ipcRenderer.send('search', this.page.current)
      }
    },
    mounted () {
      console.log(this.global)
      this.registerRendererListener()
    }
  }
</script>

<style lang="scss">


</style>
