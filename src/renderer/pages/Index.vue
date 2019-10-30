<template>
    <el-container>
        <el-aside width="200px">
            <el-scrollbar>
                <aside-menu></aside-menu>
            </el-scrollbar>
        </el-aside>

        <el-main>
            <div class="page-header-fixed">
                <el-input placeholder="请输入关键词" v-model="page.current.keyword" size="medium">
                    <el-select slot="prepend" @change="handleSortChanged" v-model="page.current.sort" placeholder="排序方式"
                               v-if="global.active">
                        <el-option
                                v-for="(value, key, i) in global.active.paths"
                                :key="key"
                                :label="formatPathName(key)"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </el-input>
                <el-row class="page-header-option">
                    <el-col :span="8">
                        <div v-if="page.res" class="page-res-message">
                            <span v-show="page.res.useCache"><i class="el-icon-lightning"></i>命中预加载结果，</span><span>耗时{{page.res.time}}ms</span>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <el-pagination
                                @current-change="handlePageChanged"
                                :current-page="page.current.page"
                                class="page-items-pagination"
                                background
                                layout="prev, pager, next"
                                :pager-count="5"
                                :page-count="50">
                        </el-pagination>
                    </el-col>
                </el-row>
            </div>
            <el-table
                    v-loading="loading.table"
                    class="page-items-table"
                    border
                    default-expand-all
                    :data="page.items"
                    style="width: 100%;">
                <el-table-column
                        label="名称">
                    <template slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.resolution"
                                :type="getResolutionTagType(scope.row.resolution)">
                            {{scope.row.resolution}}
                        </el-tag>
                        <span class="page-items-magnet" @click="handleOpenMagnet(scope.row.magnet)"
                              v-html="highlight(page.current.keyword, scope.row.name, 'highlight-name')"></span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="大小"
                        align="right"
                        :sort-by="['size','hot','date']"
                        sortable
                        width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.size| size}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="right"
                        sort-by="hot"
                        label="人气"
                        :sort-by="['hot','date','size']"
                        sortable
                        width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.hot}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        align="center"
                        sort-by="date"
                        sortable
                        :sort-by="['date','hot','size']"
                        label="时间"
                        width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.date| date}}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="100">
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button size="small" @click="handleCopyMagnet(scope.row.magnet)">复制链接</el-button>
                        </el-button-group>
                    </template>
                </el-table-column>
            </el-table>
            <el-backtop target=".el-main">
            </el-backtop>
        </el-main>
    </el-container>
</template>

<script>
  import AsideMenu from '../components/AsideMenu'
  import {ipcRenderer, clipboard, shell} from 'electron'
  import {Base64} from 'js-base64'

  export default {
    components: {
      AsideMenu
    },
    data () {
      return {
        page: {
          current: {
            keyword: null
          }
        },
        sourceList: [],
        loading: {table: false}

      }
    },
    methods: {
      registerRendererListener () {
        /**
         * 搜索结果
         */
        ipcRenderer.on('on-search-response', (event, rsp) => {
          this.loading.table = false
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
      formatPathName (pathKey) {
        const paths = {
          'preset': '默认排序',
          'time': '收录时间',
          'size': '文件大小',
          'hot': '下载人气'
        }
        return pathKey in paths ? paths[pathKey] : pathKey
      },
      /**
       * 点击磁力链
       */
      handleOpenMagnet (url) {
        shell.openExternal(url)
      },
      /**
       * 复制链接
       * @param url
       */
      handleCopyMagnet (url) {
        clipboard.writeText(url)
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      },
      /**
       * 小米路由
       * @param url
       */
      handleMiWiFi (url) {
        const miwifi = 'http://d.miwifi.com/d2r/?url=' + Base64.encodeURI(url)
        shell.openExternal(miwifi)
      },
      handleFiles (detailUrl) {
      },
      handleSortChanged (sort) {
        this.page.current.sort = sort
        this.handleSearch()
      },
      handlePageChanged (page) {
        this.page.current.page = page
        this.handleSearch()
      },
      handleSearch () {
        console.log('搜索', this.page.current)
        this.loading.table = true
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

    .el-table th {
        padding-top: 7px !important;
        padding-bottom: 7px !important;
    }

    .page-header-option {
        display: flex;
        margin-top: 15px;
        align-items: center;
    }

    .page-res-message {
        color: $--color-success;
        font-size: 12px;

        i {
            margin-right: 5px;
        }
    }

    .page-items-pagination {
        text-align: right;
    }

    .page-items-table {
        margin-top: 15px;
    }

    .el-loading-mask {
        bottom: auto;
    }

    .el-pagination {
        padding-right: 0 !important;

        .number:last-child {
            display: none;
        }

        .btn-next {
            margin-right: 0 !important;
        }
    }

    .el-select .el-input {
        width: 110px;
    }

    .page-items-magnet {
        cursor: pointer;
    }

    .el-table__expanded-cell[class*=cell] {
        padding: 10px !important;
    }

</style>
