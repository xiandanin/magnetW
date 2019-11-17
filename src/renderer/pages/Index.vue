<template>
    <el-container v-loading="loading.page">
        <el-aside width="200px" v-if="rule" class="scroll-container">
            <el-scrollbar>
                <aside-menu @change="handleSourceChanged" :ruleArray="rule.list"
                            :active="activeRule?activeRule.id:''"></aside-menu>
            </el-scrollbar>
        </el-aside>

        <el-main class="index-main scroll-container">
            <el-scrollbar class="index-main-scrollbar">
                <div class="index-main-content">
                    <div class="active-rule-link">
                        <span class="active-rule-name">{{activeRule.name}}</span>
                        <browser-link :href="page.current.url||activeRule.url" :underline="false">
                            {{page.current.url||activeRule.url}}
                        </browser-link>
                    </div>
                    <el-input :placeholder="placeholder" v-model="page.current.keyword"
                              @keyup.enter.native="handleSearch"
                              size="medium">
                        <el-select slot="prepend" @change="handleSortChanged" v-model="page.current.sort"
                                   placeholder="排序方式"
                                   v-if="activeRule">
                            <el-option
                                    v-for="(value, key, i) in activeRule.paths"
                                    :key="key"
                                    :label="formatPathName(key)"
                                    :value="key">
                            </el-option>
                        </el-select>
                        <i slot="suffix" class="el-input__icon el-icon-link"></i>
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    </el-input>
                    <!--<browser-link class="page-header-url" :href="page.current.url">{{page.current.url}}</browser-link>-->
                    <div v-loading="loading.table" class="page-search-content">
                        <div v-if="page.items">
                            <el-row class="page-header-option">
                                <el-col :span="8">
                                    <div v-if="page.res" class="page-res-message">
                                    <span v-show="page.res.useCache"><i
                                            class="el-icon-lightning"></i>命中预加载结果，</span><span>耗时{{page.res.time}}ms</span>
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
                                        type="index"
                                        width="40"
                                        align="center"
                                        label="#">
                                </el-table-column>
                                <el-table-column
                                        label="名称">
                                    <template slot-scope="scope">
                                        <highlight-name :keyword="page.current.keyword" :url="scope.row.magent"
                                                        :resolution="scope.row.resolution" :value="scope.row.name"
                                        ></highlight-name>
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
                                <el-table-column type="expand">
                                    <div class="page-column-expand" slot-scope="scope">
                                        <div>
                                            <span class="page-item-expand"><span
                                                    class="page-item-expand-label">人气</span>{{scope.row.hot}}</span>
                                            <span class="page-item-expand"><span
                                                    class="page-item-expand-label">时间</span>{{scope.row.date|date}}</span>
                                        </div>
                                        <div class="page-column-expand-action">
                                            <item-button-group :activeUrl="activeRule.url" :item="scope.row">
                                            </item-button-group>
                                        </div>
                                    </div>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </div>
            </el-scrollbar>
            <el-backtop target=".index-main-scrollbar .el-scrollbar__wrap">
            </el-backtop>
        </el-main>
    </el-container>
</template>

<script>
  import AsideMenu from '../components/AsideMenu'
  import BrowserLink from '../components/BrowserLink'
  import HighlightName from '../components/HighlightName'
  import ItemButtonGroup from '../components/ItemButtonGroup'
  import {ipcRenderer, remote, shell} from 'electron'

  export default {
    components: {
      AsideMenu, BrowserLink, HighlightName, ItemButtonGroup
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
          // 如果设置不限时代理源站 就过滤掉
          if (!this.global.settings.localSetting.showProxyRule) {
            rule.list = rule.list.filter(it => !it.proxy)
          }
          this.rule = rule
          // 如果设置记住上次的源站
          let lastRule
          if (this.global.settings.localSetting.rememberLastRule) {
            lastRule = JSON.parse(localStorage.getItem('last_rule'))
          }
          this.handleSourceChanged(lastRule || rule.list[0])
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
      formatPathName (pathKey) {
        const paths = {
          'preset': '默认排序',
          'time': '收录时间',
          'size': '文件大小',
          'hot': '下载人气'
        }
        return pathKey in paths ? paths[pathKey] : pathKey
      },
      formatCurrentSort (sort) {
        if (!sort) {
          const sortKeys = Object.keys(this.activeRule.paths)
          return sortKeys[sortKeys.length - 1]
        }
        return sort
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
        localStorage.setItem('last_rule', JSON.stringify(ruleItem))
        this.activeRule = ruleItem
        this.page.current.sort = this.formatCurrentSort()
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
      this.registerRendererListener()

      this.handleLoadRuleData()
    },
    mounted () {
    }
  }
</script>

<style lang="scss">

    .index-main {
        padding: 0 !important;

        .index-main-content {
            padding: 20px;
        }
    }

    .el-table th {
        padding-top: 7px !important;
        padding-bottom: 7px !important;
    }

    .page-header-option {
        display: flex;
        margin-top: 10px;
        align-items: flex-end;
    }

    .page-header-url {
        color: $color-text-gray !important;
        margin-top: 10px;
    }

    .active-rule-link {
        margin-bottom: 10px;
        color: $--color-info;
        font-size: 12px;
        display: flex;
        align-items: center;
        background-color: cadetblue;

        .el-link {
            background-color: chocolate;
            color: $--color-info;
        }
    }

    .active-rule-name {
        background-color: #3F8BFA;
        margin-right: 5px;
    }

    .page-res-message {
        color: $--color-success;
        font-size: 12px;

        i {
            margin-right: 3px;
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
        margin-top: 10px;
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

    .el-table__expanded-cell[class*=cell] {
        padding: 10px !important;
    }

    .page-column-expand {
        display: flex;
        align-items: center;
        margin-left: 40px;
    }

    .page-column-expand-action {
        text-align: right;
        flex: 1;
    }

    .page-item-expand-label {
        color: #99a9bf;
        margin-right: 8px;
    }

    .page-item-expand {
        color: #606266;
        margin-right: 15px;
    }

</style>
