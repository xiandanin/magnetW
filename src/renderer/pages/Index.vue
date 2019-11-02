<template>
    <el-container v-loading="loading.page">
        <el-aside width="200px" v-if="rule">
            <el-scrollbar>
                <aside-menu @change="handleSourceChanged" :ruleArray="rule.list"
                            :active="activeRule?activeRule.id:''"></aside-menu>
            </el-scrollbar>
        </el-aside>

        <el-main class="drag">
            <div class="page-header-fixed no-drag">
                <el-input :placeholder="placeholder" v-model="page.current.keyword" @keyup.enter.native="handleSearch"
                          size="medium">
                    <el-select slot="prepend" @change="handleSortChanged" v-model="page.current.sort" placeholder="排序方式"
                               v-if="activeRule">
                        <el-option
                                v-for="(value, key, i) in activeRule.paths"
                                :key="key"
                                :label="formatPathName(key)"
                                :value="key">
                        </el-option>
                    </el-select>
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </el-input>
                <browser-link class="page-header-url" :href="page.current.url">{{page.current.url}}</browser-link>
            </div>
            <div v-loading="loading.table" class="page-search-content">
                <div v-if="page.items">
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
                    <el-table
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
                </div>
            </div>
            <el-backtop target=".el-main">
            </el-backtop>
        </el-main>
    </el-container>
</template>

<script>
  import AsideMenu from '../components/AsideMenu'
  import BrowserLink from '../components/BrowserLink'
  import {ipcRenderer, clipboard, shell} from 'electron'
  import {Base64} from 'js-base64'

  export default {
    components: {
      AsideMenu, BrowserLink
    },
    data () {
      return {
        page: {
          current: {
            keyword: null
          }
        },
        activeRule: null,
        rule: null,
        loading: {
          table: false,
          page: false
        },
        placeholder: '钢铁侠'

      }
    },
    methods: {
      registerRendererListener () {
        /**
         * 加载规则
         *
         */
        ipcRenderer.on('on-load-rule-data', (event, rule) => {
          this.loading.page = false
          this.rule = rule
          this.handleSourceChanged(rule.list[0])
        })
        /**
         * 搜索结果
         */
        ipcRenderer.on('on-search-response', (event, rsp) => {
          this.loading.table = false
          if (rsp.success) {
            this.page = rsp.data
          } else {
            this.$message({
              message: rsp.message,
              type: 'error'
            })
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
      /**
       * 排序切换
       * @param sort
       */
      handleSortChanged (sort) {
        this.page.current.sort = sort
        this.handleSearch()
      },
      /**
       *页码切换
       * @param page
       */
      handlePageChanged (page) {
        this.page.current.page = page
        this.handleSearch()
      },
      /**
       * 源站切换
       * @param ruleItem
       */
      handleSourceChanged (ruleItem) {
        this.activeRule = ruleItem
        this.page.current.id = ruleItem.id
        this.page.current.page = 1
        if (this.page.current.keyword) {
          this.handleSearch()
        }
      },
      handleSearch () {
        this.loading.table = true
        this.page.current.keyword = this.page.current.keyword || this.placeholder
        console.log('搜索', this.page.current)
        ipcRenderer.send('search', this.page.current, this.global.settings.localSetting)
      },
      handleLoadRuleData () {
        this.loading.page = true
        ipcRenderer.send('load-rule-data', this.global.settings.localSetting.ruleUrl)
      }
    },
    created () {
      console.log(this.global)
      this.registerRendererListener()

      this.handleLoadRuleData()
    },
    mounted () {
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

    .page-header-url {
        color: $color-text-gray !important;
        margin-top: 10px;
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

    .page-search-content {

        .el-loading-spinner {
            top: 100px !important;
        }
    }

    .page-items-table {
        margin-top: 15px;
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
        color: $--color-primary;
        cursor: pointer;

        .highlight-name {
            color: $--color-danger;
        }
    }

    .el-table__expanded-cell[class*=cell] {
        padding: 10px !important;
    }

</style>
